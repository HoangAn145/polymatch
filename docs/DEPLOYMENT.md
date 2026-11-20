# Cấu hình và triển khai

## 1. Supabase

Tạo project hoặc sử dụng project hiện có. Chạy các migration trong SQL Editor theo thứ tự:

1. `supabase/migrations/001_platform.sql`
2. `supabase/migrations/002_admin_audit.sql`
3. `supabase/migrations/003_chat_history.sql` — mới, lưu lịch sử chatbot và metadata tin. Nếu đã chạy 001/002 thì chỉ chạy thêm file này.

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

- Router phân câu hỏi vào 4 nhóm: CSKH, thị trường logistics, công nghệ, tin tức/chính sách.
- CSKH/công nghệ dùng RAG tài liệu đã duyệt; thị trường kết hợp RAG và Search; tin tức/chính sách dùng Live Search.
- Gemini tổng hợp có schema, ID nguồn và kiểm tra số liệu/ngày. Tách ngày đăng, thông qua, ban hành và hiệu lực; phân loại tuyên bố/ý kiến/thông tin đã đối chiếu hoặc chưa xác minh.
- Chuyển chuyên viên vẫn theo hành động đồng ý của người dùng; chưa gửi email ngoài ứng dụng.
- Lịch sử và metadata tin lưu ở `chat_queries`/`chat_news_items`, có RLS theo người dùng; không lưu toàn văn báo, không tự đưa tin vào RAG.

Xem [cơ chế định tuyến và kiểm chứng nguồn](CHAT_ROUTING.md). Nếu chưa có migration 003, chatbot thông báo chưa lưu lịch sử; các bảng cũ không cần tạo lại.

## 4. Nghiệm thu trên preview

1. Tạo hai tài khoản Buyer, một Seller và một Admin được nâng quyền qua SQL; xác nhận email.
2. Kiểm tra đăng nhập, đăng xuất, khôi phục mật khẩu qua email thật.
3. Buyer hoàn thành đủ câu hỏi và KPI gốc; tải lại trang để xác minh lịch sử lưu trong Supabase.
4. Kiểm tra kết quả/điểm thành phần, lý do loại giải pháp; thử ngân sách thấp và nguồn lực thấp. Các trang gốc `/buyer/results`, `/buyer/solutions`, `/buyer/compare`, `/buyer/history` vẫn sử dụng cùng kết quả.
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

## Bảo toàn ứng dụng gốc

Nhánh này giữ các dashboard `/buyer/*`, `/seller/*`, `/admin/*`. Liên kết email `/workspace` tự chuyển về dashboard đúng vai trò. Sau khi redeploy Preview, các menu gốc và nghiệp vụ cũ vẫn truy cập được, không cần bật demo để khôi phục menu. Bật `VITE_DEMO_MODE=true` chỉ khi chủ dự án muốn dùng dữ liệu diễn tập và bộ đổi vai trò.

Các tính năng cũ và Diagnostic dùng các bảng đã tạo bởi hai migration hiện có; không chạy lại SQL đã thành công. Bổ sung lịch sử chatbot cần chạy thêm migration `003_chat_history.sql`. Dữ liệu localStorage gốc không bị xóa hoặc đổi tên. Cache production tách theo người đăng nhập để tránh dùng nhầm dữ liệu demo hoặc dữ liệu người khác.

## 5. Bật Gemini trả lời từ RAG

1. Tạo API key trong Google AI Studio (https://aistudio.google.com/apikey), chọn project có quyền/hạn mức Gemini.
2. Vercel → project → Settings → Environment Variables: thêm `GEMINI_API_KEY` dạng secret cho **Preview** nếu đang thử nhánh PR; `GEMINI_MODEL=gemini-2.5-flash`. Chỉ cấu hình phía server, không dùng tiền tố `VITE_`.
3. Kiểm tra `SUPABASE_URL` và `SUPABASE_ANON_KEY` cùng scope, sau đó triển khai lại nhánh `codex/platform-diagnostic-cskh`. Thay biến môi trường không cập nhật deployment cũ.
4. Admin → Quản lý tri thức: thêm/nhập tài liệu đúng danh mục `FAQ_CSKH`, `Cong_nghe_CDS`, `Logistics` hoặc `Thi_truong`; rà soát rồi duyệt. Gemini chỉ nhận các đoạn liên quan trong tài liệu `approved`, không tự có nội dung workbook.
5. Trong chatbot chọn tự động hoặc FAQ/tri thức, hỏi về nội dung tài liệu vừa duyệt và kiểm tra nguồn trích dẫn. Chế độ **Tìm tin tức mới** sử dụng Google Search grounding, không phải chế độ chỉ RAG.

Nếu gặp HTTP 500 dạng văn bản thay vì JSON, xem Runtime Logs của function `/api/chat` trên đúng deployment. Các import của function phải chạy được bằng Node ESM; kiểm thử `tests/chat-runtime.test.ts` kiểm tra điều này mà không bundle hoặc dùng TS loader. Lỗi 429/403 từ Gemini cần kiểm tra hạn mức/quyền API trong project Google. Không gửi khóa API trong chat hoặc đưa vào repository.

### Lỗi “Chưa cấu hình dịch vụ dữ liệu”

Lỗi này xảy ra trước bước Gemini khi API không nhận được cặp URL/public key của Supabase. API dùng `SUPABASE_URL`/`SUPABASE_ANON_KEY`, hoặc dự phòng bằng `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` trong cùng deployment. Không dùng service role thay anon; JWT người dùng và RLS vẫn được giữ. Sau khi sửa biến phải redeploy đúng Preview/Production. Fallback không thể đọc biến ở môi trường khác hoặc deployment cũ.
