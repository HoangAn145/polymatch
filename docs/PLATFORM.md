# POLYMATCH P0 + P1

Cổng mặc định `/platform` tích hợp 5 hạng mục: nền tảng Supabase/Auth/RLS/API; Diagnostic/Matching; chatbot; Roadmap/ROI; KPI/quản trị. Code demo cũ được giữ trong `src/DemoApp.tsx` và chỉ bật bằng `VITE_APP_MODE=demo`. Demo localStorage không phải cơ chế xác thực production.

## Trạng thái đã kiểm chứng ngày 16/11/2026

- Supabase thật: `https://cjwnwdzegbdywuhbkavb.supabase.co`. Đã chạy 3 migration `202611160001` đến `202611160003`, nhập 131 mục tri thức, 23 mục tham khảo nguồn/quy trình và 12 giải pháp mẫu. **Tất cả nội dung nhập vẫn là bản nháp**.
- 8 bảng `pm_*` bật RLS, có grants cụ thể. Tiền tố giúp tránh đè bảng của ứng dụng khác.
- Kiểm tra PostgreSQL cục bộ bằng PGlite: migration, import lặp, owner isolation, chống tự nâng quyền, atomic assessment/KPI, quota, tìm kiếm toàn bộ kho và ẩn bản nháp.
- Kiểm tra RLS trực tiếp trên Supabase bằng giao dịch rollback: chống nâng quyền qua metadata, chặn đọc/ghi chéo owner, ẩn bản nháp và nguồn nội bộ, quota 30 yêu cầu/giờ. Không để lại tài khoản thử, không gửi email đăng ký.
- Kiểm tra API bằng HTTP và Chromium: đăng nhập, 25 câu hỏi + KPI, lưu đánh giá, Roadmap, ROI có biểu đồ, cập nhật/lịch sử KPI, FAQ, tạo ticket, lịch sử báo cáo, logout, admin duyệt và chatbot dẫn mã FAQ001. **Auth HTTP trong các kiểm tra này được mô phỏng**, không thay thế kiểm thử email/login thật.
- Chưa có `GEMINI_API_KEY` hoặc `VERCEL_TOKEN` trong phiên. Chưa gọi Gemini/Google Search thật hoặc deploy Vercel. Không tự publish thêm cấu hình môi trường.

## Chạy và kiểm thử

Node 24.22.1, Bun 1.4.4 đã được dùng. Bun 1.3.13 không đọc được lockfile v2.

```sh
bun install --frozen-lockfile
npm run lint
npm test
npm run build
CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e
npm run dev -- --strictPort
```

Nếu máy thiếu Bun, cài vào vị trí riêng với cache ghi được như sau (không sửa lockfile):

```sh
npm --cache /workspace/.npm-cache install --prefix /workspace/.onboarding-tools --no-package-lock bun@1.4.4
BUN_INSTALL_CACHE_DIR=/workspace/.bun-cache /workspace/.onboarding-tools/node_modules/.bin/bun install --frozen-lockfile
```

Vite phục vụ cùng `/api/platform` handler sẽ dùng trên Vercel. Browser harness tạo Vite riêng ở 3197 và mock Supabase rồi đóng các process do nó tạo. Không dùng port 3197 cho ứng dụng khác trong lúc kiểm thử.

## Biến môi trường

| Biến                     | Phạm vi               | Giá trị                                                                          |
| ------------------------ | --------------------- | -------------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | build trình duyệt     | `https://cjwnwdzegbdywuhbkavb.supabase.co`                                       |
| `SUPABASE_URL`           | máy chủ               | cùng URL gốc, không có `/rest/v1/`                                               |
| `VITE_SUPABASE_ANON_KEY` | build trình duyệt     | publishable key do chủ dự án cung cấp                                            |
| `SUPABASE_ANON_KEY`      | máy chủ               | cùng publishable key                                                             |
| `GEMINI_API_KEY`         | chỉ máy chủ, tùy chọn | nhập qua secret bảo mật                                                          |
| `GEMINI_MODEL`           | chỉ máy chủ           | mặc định `gemini-2.5-flash`, cần hỗ trợ Google Search grounding nếu dùng tìm web |
| `VITE_APP_MODE`          | build trình duyệt     | mặc định cổng thật; chỉ dùng `demo` khi diễn tập localStorage                    |
| `SUPABASE_ACCESS_TOKEN`  | công cụ quản trị      | chỉ dùng qua proxy đến `api.supabase.com`, không phải khóa ứng dụng              |
| `VERCEL_TOKEN`           | công cụ triển khai    | cần nếu muốn triển khai bằng Vercel API/CLI                                      |

Không đưa Gemini/service-role/management token vào `VITE_*`, Git hoặc chat. Không cần service-role key để ứng dụng chạy. Không ghi đè `.env.local` hiện có. Khởi động lại Vite sau khi đổi biến máy chủ; build lại khi đổi `VITE_*`. Khi mạng bị giới hạn cần hostname dự án, `api.supabase.com` và `generativelanguage.googleapis.com`; giữ nguyên các domain hiện có.

## Schema, migration và tài khoản đầu tiên

**Ba migration này đã được chạy trên dự án nêu trên. Không chạy lại CREATE migration đó trên cùng schema.** Trước thay đổi DB luôn kiểm tra object và lịch sử triển khai. Scripts quản trị không tự công bố website hay tạo credential:

```sh
python scripts/supabase_query.py --query "select tablename from pg_tables where schemaname='public' and tablename like 'pm_%'"
python scripts/check_remote_rls.py
```

Khi tạo môi trường Supabase mới, áp dụng theo thứ tự:

1. `supabase/migrations/202611160001_pm_platform.sql`
2. `supabase/migrations/202611160002_pm_search.sql`
3. `supabase/migrations/202611160003_pm_atomic_assessment.sql`
4. `data/chatbot/import-drafts.sql`
5. `supabase/seed-solutions.sql` (dữ liệu mẫu, không tự xuất bản)

Import dùng `ON CONFLICT DO NOTHING`, không ghi đè nội dung đã biên tập. Migration đã chạy qua Management API, chưa ghi vào lịch sử Supabase CLI. Nếu bật workflow CLI/Git deployment migration, cần đồng bộ/repair lịch sử đúng phiên bản trước; không tự chạy DDL lại.

Auth email đang bật trên dự án thật. Cần kiểm tra SMTP, email confirmation và recovery với địa chỉ thuộc quyền người dùng. Trong Supabase → Authentication → URL Configuration, đặt Site URL theo website Vercel thực tế và thêm redirect URL `/platform` chính xác cho production/staging/local. Chưa xác minh cấu hình redirect/SMTP hoặc gửi email trong phiên này.

Người dùng tự đăng ký và xác nhận email, sau đó chủ dự án cấp admin cho UUID đúng tài khoản bằng SQL Editor:

```sql
update public.pm_profiles set role='ADMIN',status='active'
where id='<UUID tài khoản đã xác nhận>';
```

Không cấp admin từ `user_metadata`. Seller đăng ký ở trạng thái pending, chưa được dùng nghiệp vụ doanh nghiệp. Admin có thể duyệt/khóa tài khoản qua giao diện; RLS thực thi trên DB, không chỉ ẩn nút.

## Cách hoạt động

### Diagnostic và Matching

Cần câu trả lời đầy đủ 1–5 của DBI và LDMI theo ngành, ngân sách năm, mức sẵn sàng, số đo KPI và mục tiêu tự đặt, kỳ đo và nguồn đối soát. KPI chỉ yêu cầu khi áp dụng cho ngành; không tạo số liệu thay phần thiếu. DBI/LDMI được tính theo quy tắc; không tạo điểm mạnh hoặc điểm nghẽn khi không có nhóm điểm yếu. KPI làm baseline, chưa suy luận nhân quả hoặc dùng benchmark ngành.

Giải pháp chỉ được xếp hạng sau khi qua tất cả bộ lọc: admin duyệt/xuất bản, nguồn xác thực, đúng ngành/quy mô, LDMI không quá hiện tại +1, giá tối thiểu nằm trong ngân sách năm và giải quyết điểm nghẽn đã đo. Hiển thị breakdown 40/20/20/20 và lý do loại. Giá tối thiểu không bảo đảm tổng chi phí; phải xin báo giá. Gemini chỉ diễn giải, không đổi điểm/bộ lọc; thiếu khóa hoặc lỗi sẽ ghi rõ fallback.

Báo cáo và KPI baseline được lưu trong một transaction RPC. Cùng KPI/kỳ sẽ cập nhật số đo hiện tại; số đo các kỳ khác giữ nguyên. Báo cáo là self-report bất biến: owner có thể tạo qua REST và không được sửa/xóa; **không dùng nó làm chứng nhận, bằng chứng thanh toán hoặc dữ liệu đã kiểm toán**. API tính lại assessment từ input khi lập Roadmap, không tin điểm/xếp hạng được client tự đưa lên.

### Chatbot

File Excel gốc giữ nguyên trong `data/chatbot`. 131 bản nháp gồm 53 FAQ, 35 logistics, 34 công nghệ, 9 dữ liệu thị trường. Giữ ID, trạng thái gốc, ngoại lệ, nguồn, người duyệt, ngày cập nhật và file hash/dòng nguồn. 15 nguồn và 8 mẫu CSKH ở bảng admin-only `pm_reference`. 14 ca đánh giá ở JSON riêng, không nhập vào context trả lời. Nội dung ô, proposed SLA và expected actions là dữ liệu, không phải system instruction.

RAG dùng PostgreSQL full-text có chỉ mục, chuẩn hóa dấu tiếng Việt trên toàn bộ tài liệu đã xuất bản, chọn tối đa 4 đoạn rồi Gemini tổng hợp nếu khả dụng. Không có vector embeddings. Nguồn trích dẫn là các tài liệu truy xuất; chưa bảo đảm từng câu AI đều được nguồn chứng minh. Chưa chấm chất lượng Gemini trên 14 ca nghiệp vụ.

Tin tức dùng Gemini Google Search grounding; chỉ báo tìm web khi có nguồn HTTPS. Thiếu khóa/quyền/model hoặc không có nguồn sẽ tìm kho tin nội bộ và thông báo rõ. Sheet `Thi_truong` giữ là kiến thức có kỳ dữ liệu, không tự trở thành tin mới. Danh sách `Nguon_tin` chưa kích hoạt crawler hoặc đăng ký RSS/API.

Handoff tạo ticket idempotent theo UUID, có bộ phận nhận và trạng thái; admin nhận/xử lý/đóng yêu cầu. Không có live chat, email thông báo hay SLA được cam kết. Chỉ gửi nội dung người dùng chọn chuyển, không tự sao chép toàn bộ chat; hội thoại chưa lưu lâu dài trên server.

### Roadmap và ROI

Roadmap chọn từ assessment đã lưu, kiểm tra lại các giải pháp đang đủ điều kiện, nhân sự, giờ/tuần/người, sẵn sàng dữ liệu, ngày bắt đầu và giá tối thiểu. Thiếu nguồn lực hoặc chưa có giải pháp đủ điều kiện sẽ ghi blocker và trạng thái cần chuẩn bị. Phases dựa trên khung 12 tuần/40 giờ nhóm mỗi tuần, tăng thời gian khi thiếu công suất; cần doanh nghiệp/nhà cung cấp xác nhận, chưa tự phân công người phụ trách.

ROI dùng triệu VNĐ, vốn đầu tư, chi phí/tiết kiệm tháng, thời gian làm quen, kỳ mô phỏng và chiết khấu năm. Tính NPV với chiết khấu tháng hiệu dụng, ROI, dòng tiền và hoàn vốn nội suy. Nếu không hoàn vốn trong kỳ hiển thị rõ, không báo 0 tháng. Ba kịch bản thay lợi ích −20%/cơ sở/+20%; chưa có thuế, vay và lạm phát. Không suy ra tiết kiệm từ điểm đánh giá, không cam kết ROI.

### KPI và quản trị

Giữ lịch sử theo chỉ số/kỳ; ghi nguồn và mục tiêu tự đặt. OTIF/tồn kho càng cao càng tốt, km rỗng càng thấp càng tốt. Cảnh báo trên màn hình theo mục tiêu và xu hướng kỳ trước, không giả có cảnh báo email hoặc real-time daemon.

Admin quản lý tài khoản, ticket/bộ phận, tri thức và danh mục. Tri thức có tạo/sửa/lưu nháp/ẩn/duyệt-xuất bản; danh mục có duyệt/ẩn, chỉnh nội dung nguồn bằng SQL Editor. Phân trang admin 25 mục. Người dùng xem 50 báo cáo, 50 ticket gần nhất và 200 số đo KPI gần nhất; phân trang lớn, audit chỉnh sửa từng revision, retention và monitoring tải nằm ngoài bản này.

## Vercel và các bước còn lại

Người dùng đã có project Vercel `polymatch`, domain `polymatch-sand.vercel.app` và đã sửa Git link về `HoangAn145/polymatch`. Cấu hình `vercel.json` dùng Bun 1.4.4, Vite, Node Function và SPA rewrite. Các biến công khai cần build lại. Code hiện chưa push/deploy; không redeploy commit cũ rồi coi đó là P0/P1 mới.

Trước production cần: phê duyệt tri thức/giá/danh mục thật, kiểm tra đăng ký/email/recovery và redirect thật, nhập Gemini key và đánh giá chất lượng/nguồn/tin mới, quyền triển khai Vercel, deploy staging rồi kiểm tra API và deep links. Đã có RLS thật không có nghĩa toàn bộ ứng dụng đã sẵn sàng doanh nghiệp.

Không tự publish lại cấu hình Codex. Giữ code/commit và bản sao tải xuống trước khi chuyển môi trường để tránh mất workspace chưa push.
