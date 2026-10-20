# POLYMATCH — HƯỚNG DẪN ĐỌC ĐẶC TẢ (ĐỒNG BỘ VNYTL)

**Nguồn nghiệp vụ ưu tiên:** `VNYTL.docx` (báo cáo vòng bán kết, 2026). Bộ file này được cập nhật để phản ánh nội dung báo cáo, **không** áp dụng quy tắc cũ “XLSX thắng VNYTL”. Khi báo cáo không mô tả chi tiết kỹ thuật, đặc tả cũ chỉ là **đề xuất cần phê duyệt**, không tự coi là yêu cầu đã chốt.

## Đọc theo thứ tự
1. `VNYTL.docx`: mục tiêu, mô hình sản phẩm, giá, kế hoạch tài chính và định hướng.
2. `01_CHUC_NANG_NEN_TANG_v3.xlsx`: xem sheet `VNYTL_YEU_CAU` và `DOI_CHIEU_VNYTL` **trước** các sheet kỹ thuật gốc; các sheet gốc còn tồn tại để truy vết và có thể chứa yêu cầu legacy.
3. `04_POLYMATCH_LOGISTICS_THIET_KE.md`: thiết kế mục tiêu theo báo cáo.
4. `05_MODULE_THU_PHI.md`: mô hình thu phí báo cáo, hoa hồng, phí nhà cung cấp, theo dõi và tư vấn.
5. `03_TRI_THUC_KHOANG_TRONG.json`: dữ liệu tham khảo 17 khoảng trống; chưa được VNYTL phê duyệt từng mã.
6. `06_PROMPT_AI_DIEN_GIAI.md`: AI chỉ diễn giải, không thay công thức.

## Các quyết định từ VNYTL
- Ba vai trò tài khoản: **Buyer, Seller, Admin**. Chuyên gia là đối tác dịch vụ; việc cấp tài khoản Expert độc lập chưa được báo cáo quyết định.
- Đánh giá chung DBI, chẩn đoán logistics, TOPSIS, matching có giải thích, ROI, quản lý KPI và tiến độ.
- Buyer sử dụng chức năng cơ bản miễn phí, **có thể trả tiền** cho báo cáo chuyên sâu 700.000đ, tư vấn và theo dõi.
- Seller trả phí nền tảng 6.000.000đ/năm theo điều kiện tham gia đã nêu; hoa hồng hợp đồng theo 5% / 8% / 10%.
- Không được triển khai mô hình bán thông tin liên hệ bằng tín chỉ như mô hình duy nhất thay thế hoa hồng. Luồng mở hồ sơ tối đa 5, ví tín chỉ và hoàn tín chỉ **không được xác nhận trong VNYTL**.
- Bảng giá và dự phóng trong VNYTL là nguồn tham chiếu; nếu có phép tính hoặc điều khoản chưa rõ, đánh dấu cần xác nhận thay vì âm thầm sửa.

## Chưa có trong bộ file người dùng cung cấp
`02_BANG_CAU_HOI_CAI_TIEN.xlsx` được tài liệu cũ viện dẫn nhưng không được đính kèm. Vì vậy không thể khẳng định bộ câu hỏi 12+24 hay công thức từng câu đã khớp VNYTL. Cần xin tài liệu câu hỏi chuẩn trước khi seed hoặc nghiệm thu.

## Quy trình cho IT
Đọc sheet đối chiếu → xác nhận điểm chưa rõ → sửa schema/API/UI/test → chạy kiểm thử → chỉ công bố tính năng đã triển khai. Không dùng AI để tự tạo số liệu kết quả đánh giá. Không dùng tên và logo BDX trong sản phẩm.
