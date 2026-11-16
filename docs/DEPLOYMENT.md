# Cấu hình và triển khai

## 1. Supabase

Tạo project hoặc sử dụng project hiện có. Chạy các migration trong SQL Editor theo thứ tự:

1. `supabase/migrations/001_platform.sql`
2. `supabase/migrations/002_admin_audit.sql`

Các migration dành cho database mới, chưa có các bảng cùng tên. Nếu project đã có schema ứng dụng, cần đối chiếu schema trước khi áp dụng. Không chạy lại migration cấu trúc trên database đã áp dụng. Có thể dùng Supabase CLI migration workflow nếu project đã liên kết đúng.

Bật xác nhận email. Đặt Site URL là domain Vercel thật. Thêm redirect URL chính xác:

- `https://YOUR_DOMAIN/workspace`
- `https://YOUR_DOMAIN/reset-password`
- Các URL preview được chủ project cho phép, nếu cần thử nghiệm.

Cấu hình SMTP production và chính sách mật khẩu tối thiểu 8 ký tự trong Supabase. Giao diện đăng ký không cho nhập vai trò ADMIN. Sau khi tài khoản quản trị đã đăng ký và xác nhận email, chủ project nâng quyền duy nhất qua SQL Editor:

```sql
update public.profiles
set role = 'ADMIN', status = 'active'
where email = 'REPLACE_WITH_VERIFIED_ADMIN_EMAIL';
```

Người dùng thường không thể tự cập nhật vai trò/trạng thái. Nhà cung cấp mới có trạng thái chờ duyệt. Quản trị viên có thể duyệt/khóa tài khoản trong không gian làm việc.

## 2. Vercel

Dùng project Vercel hiện đang kết nối `HoangAn145/polymatch`. Giữ nhánh production hiện tại trong khi kiểm tra preview của nhánh triển khai. Thêm các biến cho đúng scope Preview/Production:

| Biến | Scope | Giá trị |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Build/browser | URL project Supabase |
| `VITE_SUPABASE_ANON_KEY` | Build/browser | Public anon key |
| `VITE_DEMO_MODE` | Build/browser | `false` |
| `SUPABASE_URL` | Functions | Cùng URL project |
| `SUPABASE_ANON_KEY` | Functions | Cùng public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Functions secret | Legacy service role key của project; chỉ dùng lưu kết quả Diagnostic đã tính ở server |
| `GEMINI_API_KEY` | Functions secret | Khóa Gemini có hạn mức được cấu hình |
| `GEMINI_MODEL` | Functions | Mặc định `gemini-2.5-flash`; chọn model hỗ trợ Google Search grounding |

Không đặt service role hoặc Gemini key vào biến có tiền tố `VITE_`. Không commit `.env.local` hoặc gửi secret trong chat. Sau khi đổi biến `VITE_`, build/deploy lại để frontend nhận cấu hình mới.

`vercel.json` cấu hình build, SPA rewrite, security headers và function timeout 60 giây. Khóa Node ở phiên bản được Vercel hỗ trợ (khuyến nghị 24.x). `package-lock.json` dùng cho `npm ci`; lockfile Bun cũ được loại bỏ để tránh Vercel tự chọn nhầm package manager.

## 3. Tri thức và chatbot

Dữ liệu workbook không được đưa vào repository công khai. Dùng công cụ local để chuyển file do chủ dự án cung cấp thành JSON và SQL riêng tư:

```sh
python scripts/import_workbook.py /path/to/workbook.xlsx --out /private/path/polymatch-import
```

Công cụ giữ nguyên 7 sheet và ID; 4 sheet nội dung được chuyển thành SQL ở trạng thái `pending`. Chạy file `knowledge_seed.sql` được tạo qua SQL Editor của đúng project Supabase. Giữ cả hai file kết quả trong vùng riêng tư, không commit hoặc đưa vào thư mục public. Script không tự kết nối, tải lên hoặc công bố dữ liệu. Schema có thể triển khai và kiểm thử mà chưa cần nhập workbook.

Sau khi nhập dữ liệu riêng: đăng nhập admin → Quản lý tri thức → rà soát nội dung/nguồn → duyệt từng tài liệu. Chỉ tài liệu `approved` được truy xuất. Chatbot ban đầu có thể báo chưa đủ tài liệu; đây là trạng thái dự kiến khi chưa duyệt.

- FAQ: PostgreSQL full-text search trên tài liệu đã duyệt; chưa dùng vector embedding.
- RAG: Gemini diễn giải các tài liệu truy xuất, nguồn hiển thị kèm câu trả lời. Nếu Gemini lỗi, trả tài liệu đã duyệt trực tiếp.
- Tin tức: Gemini Google Search grounding; chỉ hiển thị câu trả lời khi có nguồn trả về, không giả định dữ liệu workbook là thời sự.
- Chuyển chuyên viên: người dùng bấm đồng ý gửi câu hỏi → tạo ticket thật trong Supabase. Admin phân bộ phận, cập nhật trạng thái và phản hồi. Chưa gửi email hoặc nhắn tin ngoài ứng dụng.

## 4. Nghiệm thu trên preview

1. Tạo hai tài khoản Buyer, một Seller và một Admin được nâng quyền qua SQL; xác nhận email.
2. Kiểm tra đăng nhập, đăng xuất, khôi phục mật khẩu qua email thật.
3. Buyer hoàn thành đủ câu hỏi và KPI gốc; tải lại trang để xác minh lịch sử lưu trong Supabase.
4. Kiểm tra kết quả/điểm thành phần, lý do loại giải pháp; thử ngân sách thấp và nguồn lực thấp.
5. Tạo lộ trình, ghi KPI ở ít nhất hai ngày và đối chiếu cảnh báo; thử cả chiều tăng tốt và giảm tốt.
6. Duyệt một tài liệu FAQ và logistics, kiểm tra trích dẫn; thử câu hỏi không có tài liệu và chế độ tìm tin tức.
7. Gửi yêu cầu sau khi bấm đồng ý chuyển chuyên viên; Admin xử lý và Buyer xem phản hồi.
8. Buyer thứ hai không thấy đánh giá/KPI/ticket của Buyer thứ nhất. Kiểm tra bằng request Supabase với JWT thật, không chỉ giao diện.
9. Kiểm tra log Vercel Functions, hạn mức Gemini và callback Auth trên domain thật trước khi merge/deploy production.

## Cần chủ dự án cung cấp

- URL ứng dụng Vercel và quyền truy cập project để cấu hình/kiểm tra preview.
- Project Supabase và quyền chạy migration, cấu hình Auth.
- Thêm các biến bí mật vào Vercel qua dashboard hoặc cơ chế secrets bảo mật.
- Email tài khoản quản trị và người có trách nhiệm duyệt dữ liệu/nguồn tin.
