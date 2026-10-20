# POLYMATCH LOGISTICS — THIẾT KẾ HỆ THỐNG THEO VNYTL.docx

## 1. Định vị
**POLYMATCH – Nền tảng đánh giá mức độ trưởng thành số và kết nối giải pháp công nghệ cho doanh nghiệp trong chuỗi cung ứng.** Slogan: **Đánh giá đúng – Kết nối trúng – Chuyển đổi nhanh.** Định vị: từ bài toán logistics và chuỗi cung ứng đến giải pháp công nghệ phù hợp. Phục vụ doanh nghiệp nhỏ, vừa và lớn trong vận tải, kho bãi, giao nhận, forwarding và chuỗi cung ứng.

## 2. Vai trò và hành trình
**Buyer:** đăng ký → khai hồ sơ → đánh giá DBI → chẩn đoán logistics → xem mức/điểm nghẽn → khai ngân sách và khả năng tiếp nhận → xem, so sánh giải pháp → mô phỏng ROI → yêu cầu kết nối/báo giá → chọn mua báo cáo chuyên sâu hoặc tư vấn → theo dõi KPI, tiến độ và phân công sau hợp đồng.

**Seller:** đăng ký → xác minh mã số thuế → quản lý hồ sơ giải pháp → nhận kết nối phù hợp → xác nhận điều kiện tham gia trả phí → trao đổi, báo giá, ký hợp đồng → cập nhật trạng thái giao dịch, đối soát hoa hồng theo thỏa thuận.

**Admin:** duyệt nhà cung cấp, quản lý giải pháp, bộ câu hỏi, cấu hình chấm điểm, dịch vụ, kết nối, hợp đồng, đối soát hoa hồng, chuyên gia đối tác, báo cáo và audit log.

**Chuyên gia:** là đối tác tư vấn theo gói Basic/Pro. Báo cáo nêu luồng chuyên gia đăng ký và xác thực nhưng ở phần tổng quan mô tả website ba vai trò. Cần quyết định có tách `Expert` thành vai trò đăng nhập thứ tư hay quản lý dưới Admin trước khi thiết kế RBAC.

## 3. Cấu trúc trang
**Công khai:** trang chủ, giới thiệu, đánh giá, danh mục công nghệ, bảng giá, tin tức, liên hệ, đăng nhập/đăng ký.
**Buyer:** dashboard, hồ sơ, đánh giá DBI, chẩn đoán logistics, kết quả, 3 điểm nghẽn, giải pháp đề xuất, so sánh, ROI, báo cáo chuyên sâu, tư vấn, yêu cầu kết nối, hợp đồng và dự án, KPI.
**Seller:** dashboard, xác minh doanh nghiệp, giải pháp, yêu cầu kết nối, báo giá, giao dịch, nghĩa vụ phí, thanh toán.
**Admin:** người dùng, xác thực, giải pháp, tiêu chí và phiên bản đánh giá, dịch vụ, đối soát, chuyên gia, KPI, báo cáo.

## 4. Chấm điểm và ghép nối
- DBI sử dụng phương pháp TOPSIS và bộ tiêu chí được mô tả trong VNYTL; báo cáo chưa cung cấp ma trận câu hỏi/điểm chuẩn đủ để triển khai trực tiếp. **Không mặc định 12 câu hoặc 25 câu là đã được chốt.**
- Lớp chẩn đoán logistics xác định điểm nghẽn theo nhóm hoạt động. Kết quả cần giải thích được.
- Bộ lọc gợi ý xét mức chuyển đổi số, ngành/quy mô, ngân sách và mức sẵn sàng; **không đề xuất nhảy quá một mức**.
- ROI là mô phỏng có giả định đầu vào, không cam kết mức tiết kiệm.
- AI diễn giải văn bản từ dữ liệu đã tính; không tự thay đổi điểm, xếp hạng hoặc tự hứa kết quả.
- Không để nhà cung cấp trả phí thay đổi điểm phù hợp hoặc thứ hạng; có thể gắn nhãn tài trợ tách biệt.
- Trọng số 7 thành phần trong đặc tả v3 là phương án kỹ thuật kế thừa **chưa được VNYTL xác nhận chính xác**, cần duyệt trước khi đóng băng thuật toán.

## 5. Kết nối và thu phí
Theo VNYTL, buyer dùng cơ bản miễn phí, trả phí tùy chọn cho báo cáo, tư vấn, theo dõi. Seller trả phí tham gia và hoa hồng khi giao dịch đủ điều kiện. Lưu mã kết nối, thời điểm giới thiệu, điều khoản chấp thuận, bằng chứng và lịch sử đối soát. Không mặc định rằng một yêu cầu kết nối là giao dịch thành công.

## 6. Dữ liệu và kiểm thử
Bắt buộc có `assessment_version`, lịch sử kết quả, giải pháp, buyer/seller, yêu cầu kết nối, hợp đồng, trạng thái xác minh, khoản phí, đối soát, tư vấn, dự án, milestone, KPI, log. Kiểm thử riêng rò rỉ dữ liệu cá nhân, IDOR, trùng thu phí, chứng cứ hoa hồng, công thức ROI, quyền truy cập và tính trung lập của matching.

## 7. Các điểm phải chốt trước khi code
1. Số câu DBI/logistics chính thức: trong báo cáo có cách diễn đạt khác nhau (ví dụ “35 câu” và “DBI/đặc thù”); thiếu bộ câu hỏi gốc.
2. Expert có phải tài khoản độc lập không.
3. Biểu phí hoa hồng 5/8/10% áp dụng toàn hợp đồng hay lũy tiến; giá trị 50 và 100 triệu ở biên.
4. Khi nào thu phí Seller 6 triệu/năm và trường hợp miễn phí.
5. Điều kiện chứng minh giao dịch thành công, kỳ hạn đối soát và xử lý tranh chấp.
6. Công thức TOPSIS và ngưỡng DBI; trọng số matching và quy trình xác minh hiệu quả ROI.
