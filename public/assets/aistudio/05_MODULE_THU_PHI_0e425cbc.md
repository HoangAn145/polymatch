# POLYMATCH — MODULE THU PHÍ THEO VNYTL.docx

**Thay thế nội dung legacy “bán lead bằng ví tín chỉ” của file 05 cũ.** Nguồn: Phần 4.1 của VNYTL. Mọi số dưới đây là **giá trong báo cáo**, không phải chứng cứ thị trường đã chấp nhận.

| Nguồn thu | Người trả | Giá / nguyên tắc | Điều kiện ghi nhận |
|---|---|---|---|
| Báo cáo chuyên sâu | Buyer | 700.000đ/lần khảo sát lấy danh sách | Buyer đặt mua, thanh toán và nhận báo cáo |
| Hoa hồng hợp đồng | Seller | ≤50 triệu: 5%; 50–100 triệu: 8%; >100 triệu: 10% | Có kết nối được ghi nhận, điều khoản đã chấp thuận, bằng chứng giao dịch và đối soát |
| Phí tham gia nền tảng | Seller | 6.000.000đ/năm | Theo hình thức tham gia có thu phí và điều khoản Seller đồng ý |
| Theo dõi triển khai | Buyer | 3 tháng: 3 triệu; 7+1 tháng: 5 triệu; 9+3 tháng: 6,5 triệu | Mua gói và kích hoạt dự án theo dõi |
| Tư vấn Basic | Buyer | 3 buổi × 60–90 phút, 3 triệu | Đặt gói, lịch và nghiệm thu tư vấn |
| Tư vấn Pro | Buyer | 5 buổi × 60–90 phút, 6,5 triệu | Đặt gói, lịch và nghiệm thu tư vấn |

## Quy trình nghiệp vụ
1. Buyer dùng tính năng cơ bản miễn phí. Mua báo cáo, tư vấn và theo dõi là tùy chọn; **không** chặn đánh giá cơ bản vì chưa mua.
2. Seller đăng ký, xác minh mã số thuế, công bố giải pháp. Khi tham gia hình thức có thu phí/tiếp cận thông tin khách hàng, hệ thống hiển thị rõ giá 6 triệu/năm và lấy chấp thuận trước khi thu.
3. Kết nối Buyer–Seller được gắn `connection_id`, thời điểm, điều khoản áp dụng và trạng thái. Nếu ký hợp đồng thành công, hai bên cập nhật giá trị, bằng chứng và đối soát hoa hồng. **Không tính hoa hồng chỉ vì bấm Quan tâm.**
4. Nếu giao dịch ngoài nền tảng nhưng phát sinh từ kết nối đã chấp thuận, áp dụng điều khoản đối soát trong phạm vi pháp luật và hợp đồng. Tạm ngừng tài khoản chỉ theo điều khoản, không tự suy đoán vi phạm.
5. Sau ký hợp đồng, Buyer có thể mua gói theo dõi; hỗ trợ cả hợp đồng phát sinh ngoài POLYMATCH nếu thỏa điều kiện dịch vụ. Gói này không mặc định tạo hoa hồng.
6. Chuyên gia là đối tác cung ứng dịch vụ. Lịch, buổi đã dùng, báo cáo bàn giao và thanh toán thù lao phải được ghi nhận.

## Dữ liệu và API đề xuất (chưa phải endpoint được VNYTL chỉ định)
`service_prices`, `seller_subscriptions`, `orders`, `payments`, `connections`, `contracts`, `commission_rules`, `commission_reconciliations`, `consultation_packages`, `consultation_sessions`, `tracking_packages`, `projects`, `audit_logs`.

`POST /api/reports/orders`; `POST /api/seller/subscriptions`; `POST /api/connections`; `POST /api/contracts`; `POST /api/commissions/reconcile`; `POST /api/consultations/book`; `POST /api/tracking/orders`.

**Tất cả API:** xác thực, kiểm tra quyền chủ sở hữu, idempotency khi thu tiền, lịch sử thay đổi, kiểm toán và bảo vệ chứng từ.

## Điểm chưa đủ rõ trong VNYTL
- Bậc hoa hồng **không nói rõ tính toàn giá trị hay lũy tiến**. Không tự áp dụng vào code; cần quyết định.
- Biểu phí 6 triệu/năm nói “khi ấn xem thông tin khách hàng” nhưng cũng nêu áp dụng cho hình thức tham gia có thu phí; cần thiết kế trạng thái đồng ý/miễn phí rõ ràng.
- Các cột giá là giá niêm yết, chưa xác định VAT, hoàn tiền, thời điểm ghi nhận doanh thu và điều kiện huỷ dịch vụ.
- Không khôi phục ví tín chỉ 100/200/300 nghìn, trần 5 lượt mở, hoàn tín chỉ hoặc gói 2,4 triệu/năm **nếu chưa có quyết định mới**.
