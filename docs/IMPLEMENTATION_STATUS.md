# Trạng thái triển khai

Đây là triển khai mã nguồn cho phạm vi 5 nhóm chức năng được yêu cầu. Chưa nghiệm thu production khi chưa có Supabase/Vercel/Gemini thật. Không coi build thành công là xác nhận hệ thống đã vận hành trên Vercel.

| Nhóm | Đã triển khai trong nhánh này | Còn cần xác nhận/cấu hình |
| --- | --- | --- |
| P0 nền tảng | Auth email/mật khẩu, xác nhận email, khôi phục mật khẩu Supabase; role từ database; RLS dữ liệu cá nhân; Vercel Functions; quota 20 request/người/phút; cấu hình môi trường; demo opt-in | Áp dụng migration; SMTP/Auth redirect; nhập biến môi trường; kiểm tra JWT/RLS trên project thật |
| P0 Diagnostic/Matching | KPI đầu vào; bắt buộc đủ câu hỏi; tính điểm server; bộ lọc loại hình/quy mô/ngân sách/LDMI; điểm thành phần; giải thích/lý do loại; Gemini diễn giải và fallback; lịch sử lưu Supabase | Rà soát chuyên môn bộ câu hỏi/trọng số; xác minh danh mục giải pháp/giá; nghiệm thu Gemini thật |
| P0 Chatbot | Widget; FAQ full-text search; RAG Gemini từ tri thức đã duyệt; tin tức Google Search có nguồn; người dùng đồng ý tạo ticket; phân bộ phận/trả lời trong admin | Nhập workbook riêng và duyệt tài liệu; chạy 14 ca kiểm thử trong workbook với dịch vụ thật; kiểm chứng nguồn tin và chất lượng câu trả lời |
| P1 Roadmap/ROI | Lộ trình 12 tuần theo kết quả; kiểm tra nguồn lực; lưu phiên bản lộ trình; 3 kịch bản ROI, NPV, hoàn vốn, dòng tiền | Lộ trình là mẫu quy tắc cần chuyên viên điều chỉnh cho dự án; ROI là mô phỏng tương tác, chưa lưu kịch bản vào database |
| P1 KPI/quản trị | Nhập/lịch sử KPI; cảnh báo theo bản ghi mới nhất và chiều tốt; sửa/duyệt/từ chối tri thức; xử lý ticket; duyệt/khóa tài khoản; audit database | Cảnh báo hiển thị trong ứng dụng, chưa có scheduler/email/push; KPI baseline trong đánh giá chưa tự tạo bản ghi KPI theo thời gian |

## Quyết định và giới hạn

- Workbook và SQL chứa nội dung workbook được giữ ngoài repository công khai. Chỉ có công cụ chuyển đổi local; chủ dự án nhập dữ liệu vào Supabase riêng. Bộ kiểm thử schema/RLS dùng nội dung tổng hợp, không dùng dữ liệu workbook.

- `/workspace` là luồng dùng Supabase. Các dashboard cũ dựa localStorage chỉ có trong chế độ demo tường minh. Các đường dẫn dashboard cũ chuyển về `/workspace` khi dùng production. Các chức năng thương mại cũ (ví, hợp đồng, báo giá, thanh toán) chưa được chuyển sang backend trong phạm vi này.
- Trang giới thiệu/danh mục công khai kế thừa từ bản demo được đánh dấu thông tin đang chờ xác minh. Không dùng case study/giá kế thừa làm bằng chứng đã kiểm chứng.
- `gia_min_trieu` trong danh mục cũ đã là giá 12 tháng, kể cả thuê bao tháng. Không nhân thêm 12. Giá chưa biết không được khẳng định là phù hợp ngân sách.
- Điểm matching giữ 7 nhóm thành phần; phần tích hợp và kiểm chứng để 0 vì chưa có dữ liệu được xác minh, và hiển thị rõ giới hạn. Điểm không phải xác suất thành công.
- 3PL đang trả lời toàn bộ câu hỏi LDMI áp dụng cho nhánh 3PL. Chưa tách bộ câu hỏi theo từng dịch vụ 3PL.
- Truy xuất tri thức dùng PostgreSQL full-text search cấu hình `simple`, chưa có semantic vector search, reranking hoặc hội thoại nhiều lượt. Mỗi câu hỏi được xử lý độc lập. Cần đánh giá độ bao phủ tiếng Việt trên bộ test thật.
- Tin tức dùng Google Search grounding, chưa tự thu thập RSS/API từ 15 nguồn trong workbook và chưa có bộ lọc domain nguồn tin bắt buộc.
- Chuyển tiếp thực hiện qua ticket theo hành động đồng ý của người dùng; chưa tự áp dụng phân loại/SLA trong 8 dòng chuyển tiếp mẫu. Không tự hứa SLA chưa được chủ dự án phê duyệt.
- Nhật ký lưu các lần sửa tri thức, tài khoản và ticket tại database. Các danh sách hiện giới hạn số bản ghi tải; chưa có phân trang cho tập dữ liệu lớn.
- Kiểm tra RLS tự động chạy PostgreSQL trong PGlite với stub `auth.users`/`auth.uid`; chưa thay thế kiểm tra Supabase Auth và PostgREST thật.
- Không có secret thực trong repository. Service role chỉ có ở Vercel Function để lưu kết quả server đã tính; các thao tác của người dùng và admin dùng JWT + RLS.
