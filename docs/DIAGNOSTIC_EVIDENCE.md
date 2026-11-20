# Chẩn đoán từ KPI vận hành

Phần phân tích nằm ở `server/analyze.ts`, được gọi bởi endpoint đang dùng `api/diagnostic.ts`. Điểm DBI/LDMI và Matching vẫn được tính lại bằng lõi `diagnose` dùng chung với `assessmentService`. Các trường bằng chứng chỉ bổ sung phân tích, không tự thay đổi điểm hoặc bộ lọc giải pháp.

## Đầu vào

`DiagnosticInput.operationalKpis` là mảng tùy chọn, tối đa 12 KPI. Request cũ chỉ có `baseline` vẫn hợp lệ; hệ thống nêu rõ chưa đủ bằng chứng vận hành để xác nhận nguyên nhân.

| Mã | Đơn vị | Chiều mục tiêu |
| --- | --- | --- |
| `empty_running_rate` | % | Càng thấp càng tốt |
| `on_time_delivery_rate` | % | Càng cao càng tốt |
| `inventory_accuracy_rate` | % | Càng cao càng tốt |
| `order_error_rate` | % | Càng thấp càng tốt |
| `order_cycle_time` | giờ | Càng thấp càng tốt |
| `cost_per_order` | VND/đơn | Càng thấp càng tốt |

Ví dụ tổng hợp phục vụ kiểm thử, không phải dữ liệu doanh nghiệp:

```json
{
  "operationalKpis": [
    {
      "code": "empty_running_rate",
      "value": 32,
      "numerator": 3200,
      "denominator": 10000,
      "target": 15,
      "period": { "start": "2026-10-01", "end": "2026-10-31" },
      "scope": "Đội xe thử nghiệm",
      "source": "Bản xuất GPS tổng hợp cho test",
      "sampleSize": 240,
      "definition": "Km chạy rỗng / tổng km cùng kỳ × 100"
    },
    {
      "code": "on_time_delivery_rate",
      "value": 82,
      "numerator": 820,
      "denominator": 1000,
      "target": 95,
      "period": { "start": "2026-10-01", "end": "2026-10-31" },
      "scope": "Đơn giao thử nghiệm",
      "source": "Bản xuất TMS tổng hợp cho test",
      "sampleSize": 1000,
      "definition": "Đơn giao đúng cam kết / tổng đơn đủ điều kiện × 100"
    }
  ]
}
```

Đây là trường bổ sung trong request Diagnostic hiện có, không phải request hoàn chỉnh thay cho DBI/LDMI, hồ sơ và KPI gốc.

- KPI tỷ lệ có thể nhập giá trị hoặc đủ tử số/mẫu số. Khi có tử số/mẫu số, máy chủ tính lại tỷ lệ (hai chữ số thập phân). Giá trị khai báo lệch quá 0,05 điểm phần trăm bị từ chối.
- Không chấp nhận mẫu số bằng 0, tử số vượt mẫu số, tỷ lệ ngoài 0–100, giá trị âm/không hữu hạn, cỡ mẫu không nguyên dương, ngày không tồn tại, kỳ đo đảo ngược hoặc bản ghi trùng mã/kỳ/phạm vi.
- Nguồn, định nghĩa, phạm vi, kỳ đo, cỡ mẫu và mục tiêu chưa có được giữ là thiếu. Không tự điền benchmark ngành.
- Các trường như `verified` hoặc `confidence` do client tự gửi không được dùng để xác nhận dữ liệu.

## Cấu trúc kết quả

Snapshot đánh giá có thêm `analysis`:

- `issues[]`: một quan sát cho mỗi KPI, giữ mã chỉ số và ID ổn định trong snapshot.
- `evidence[]`: giá trị, đơn vị, tử số/mẫu số, nguồn, kỳ, phạm vi, định nghĩa, cỡ mẫu và nguồn gốc tự khai. Điểm LDMI liên quan và sẵn sàng dữ liệu là bối cảnh khảo sát, không phải bằng chứng xác nhận nguyên nhân.
- `comparison`: so với mục tiêu cùng phạm vi do doanh nghiệp khai. 82% so với mục tiêu 95% có chênh lệch **−13 điểm phần trăm**, không phải giảm 13% tương đối.
- `hypotheses[]`: giả thuyết, ID bằng chứng hỗ trợ, bằng chứng phản bác cần tìm và các yêu cầu xác minh (`question`, `requiredData`, `method`). Chỉ số đạt mục tiêu không tự sinh giả thuyết về vấn đề vận hành.
- `confidence`: mức đầy đủ bằng chứng định tính (`low`/`medium`), không phải độ đúng hoặc xác suất thống kê. Tất cả dữ liệu đầu vào vẫn chưa xác minh độc lập. Tin cậy nguyên nhân luôn bị giới hạn ở `low` cho đến khi có quy trình xác minh độc lập.
- `missingData`, `verificationRequests`, `dataLimitations`: phần thiếu và cách đối chiếu trước khi kết luận.

Không có xác suất phần trăm đã hiệu chuẩn. Không khẳng định nguyên nhân chỉ từ một KPI.

## Gemini và fallback

LLM nhận hồ sơ chuẩn hóa, điểm đã tính, lựa chọn câu hỏi hợp lệ theo nhánh, KPI gốc và toàn bộ bằng chứng vận hành. Yêu cầu trả JSON theo schema. Máy chủ kiểm tra:

1. Đủ và đúng ID vấn đề, không có ID trùng/không tồn tại.
2. Mỗi giả thuyết tham chiếu KPI đang xét và chỉ dùng bằng chứng có sẵn của vấn đề.
3. Có câu hỏi, dữ liệu và phương pháp xác minh; giả thuyết phải được diễn đạt ở dạng khả năng cần kiểm tra.
4. Không thêm trường điểm, giá trị KPI, xác suất/mức tin cậy hay nguồn không có trong schema. Chặn số liệu mới và tuyên bố xác suất không hiệu chuẩn trong tóm tắt/giả thuyết.
5. Mô hình không sửa số liệu, so sánh, nguồn hoặc nhãn tin cậy do máy chủ tạo.

Khi Gemini lỗi hoặc trả cấu trúc/bằng chứng không hợp lệ, giữ toàn bộ quan sát và giả thuyết theo quy tắc, gắn thông báo fallback. Khi chưa cấu hình Gemini, dùng quy tắc và không ghi nhận là phân tích Gemini.

Đầu ra tự do của LLM vẫn cần người phụ trách nghiệp vụ rà soát; kiểm tra schema/tham chiếu không chứng minh mọi suy luận đúng. Chưa thực hiện gọi Gemini thật trong bộ kiểm thử này; provider được giả lập.

## Giao diện và lưu trữ

Wizard cũ có mục bổ sung **KPI vận hành thực tế**. Các ô giá trị để trống ban đầu, chỉ có placeholder ví dụ. Thêm/xóa KPI, xác nhận công thức, ghi nguồn và kỳ đo mà không thay các bước DBI/LDMI cũ. Bản nháp KPI lưu riêng theo doanh nghiệp; hồ sơ và request Diagnostic mang cùng dữ liệu.

Trang báo cáo cũ hiển thị bằng chứng, so sánh, giả thuyết và yêu cầu xác minh; biểu đồ và lịch sử cũ vẫn hoạt động. Snapshot `result.input.operationalKpis` và `result.analysis` lưu cùng bản ghi `assessments` trong Supabase. Dùng cột JSON hiện có, không cần migration mới hoặc chạy lại SQL. Đánh giá cũ chưa có `analysis` vẫn đọc được; tạo đánh giá mới để có cấu trúc này.
