# Chatbot POLYMATCH: 4 nhóm thông tin và tin tức trực tiếp

Giữ widget, các trang và menu cũ. `api/chat.ts` xác thực/quota rồi gọi các module trong `server/chat/`. Dùng Gemini để phân loại và diễn đạt; Google Search grounding cung cấp bằng chứng web mới. Không cần một Search API key riêng trong cấu hình hiện tại.

## Luồng theo ý định

| Ý định | Cách trả lời | Kho tri thức được truy xuất |
| --- | --- | --- |
| `customer_support` | RAG từ FAQ/hướng dẫn đã duyệt | `FAQ_CSKH`, FAQ cũ |
| `logistics_market` | RAG làm kiến thức nền + Live Search | `Logistics`, `Thi_truong` và nguồn web mới |
| `technology` | RAG từ tài liệu công nghệ đã duyệt | `Cong_nghe_CDS` |
| `news_policy` | Live Search, không dùng RAG làm tin hiện thời | Nguồn trực tiếp có grounding |

Router Gemini chỉ chọn intent, chiến lược do máy chủ quyết định. Có fallback theo quy tắc khi router lỗi/chưa cấu hình. Từ khóa về thời sự, thuế quan, luật, hải quan và xung đột không thể bị model hoặc chế độ FAQ cũ hạ xuống luồng RAG. Các câu hỏi riêng tư về đăng nhập/tài khoản/chính sách dịch vụ nội bộ vẫn ở CSKH; hỏi luật áp dụng cho chúng được tách sang luồng chính sách.

Chế độ tự động là mặc định; giữ giá trị `faq`/`news` cho client cũ. UI hiển thị nhóm thông tin và thời điểm tra cứu. Chế độ demo dùng router quy tắc và tài liệu local đã duyệt, không giả vờ đã tìm tin trên web.

## Nguồn và thời điểm

- RAG chỉ lấy `status=approved`, lọc category theo intent, xếp theo mức khớp tiêu đề/nội dung. Đây là PostgreSQL full-text retrieval, chưa phải vector embeddings.
- Live Search chạy khi người dùng hỏi, không phải crawler/RSS tự chạy nền. Câu hỏi công khai đã ẩn các chuỗi xác thực phổ biến được gửi tới search; không gửi hồ sơ, token phiên hay nội dung RAG riêng tư ra Google Search.
- Chính sách yêu cầu tìm nguồn chính thức trước. Domain cơ quan chính phủ/quốc hội/cơ sở văn bản và một số tổ chức quốc tế được phân loại theo hostname thật, không theo tiêu đề do model tự gắn.
- Bản tin có thêm nhóm cơ quan báo chí đã biết và nguồn dữ liệu ngành như nhà phát hành chỉ số cước. Domain khác không tự có nhãn đáng tin cậy. Nguồn kiểu `other` chỉ dùng với thông tin chưa xác minh/phân tích có điều kiện.
- Nguồn web phải đến từ grounding metadata của provider; phần material chỉ lấy segment được provider gắn nguồn. Không lấy URL do model tự bịa. Redirect grounding của Google được giải đến URL công khai bằng yêu cầu không đọc body; không tải bài báo của publisher.
- Có bốn trường ngày khác nhau: `publishedOn` (đăng), `adoptedOn` (thông qua), `issuedOn` (ban hành), `effectiveOn` (hiệu lực). Thiếu ngày thì để `null`, UI ghi “Chưa xác minh”. Thời điểm tra cứu không được dùng thay ngày đăng.
- Ngày phải tồn tại trong material, gắn với đúng nhãn sự kiện. Ngày pháp lý/số văn bản cần nguồn cơ quan/văn bản chính thức phù hợp; báo chí hoặc báo cáo thứ cấp không tự xác nhận ngày hiệu lực. Ngày pháp lý được trình bày ở metadata riêng thay vì để model kể ngày không kiểm soát trong văn xuôi.
- Với câu hỏi “hôm nay”, “tuần này”, “tháng này”, kiểm tra khoảng thời gian theo Asia/Bangkok. Không có nguồn xác minh đúng khoảng thì cảnh báo và không giữ các câu văn tự xưng là cập nhật trong khoảng đó.

## Phân biệt sự kiện, tuyên bố và nhận định

JSON do Gemini tạo phải qua kiểm tra nguồn, ID, số liệu, ngày và phân loại:

- `confirmed_fact`: UI dùng nhãn **Thông tin đã đối chiếu nguồn**. Cần hồ sơ/văn bản chính thức có căn cứ hoặc ít nhất hai tổ chức báo chí đã biết, không phải hai URL cùng publisher.
- `reported_fact`: thông tin nguồn ghi nhận, chưa tự nâng thành xác nhận độc lập.
- `party_statement`: tuyên bố/cáo buộc của bên liên quan; attribution phải có trong material.
- `expert_assessment`: nhận định chuyên gia, attribution có căn cứ, giữ nhãn ý kiến.
- `unverified_information`: thông tin còn chưa kiểm chứng, phải có nguồn để người đọc đối chiếu.
- `logistics_impact`: phân tích của hệ thống ở dạng “có thể/nếu/cần theo dõi”, không là sự kiện đã xác nhận.

Hai báo cùng lặp lại một tuyên bố không làm tuyên bố đó thành sự thật. Bộ kiểm tra loại nguồn và dấu hiệu tuyên bố/ý kiến ngăn kiểu nâng nhãn này. Đây vẫn là heuristic trên evidence do search provider trả về; không chứng minh tính độc lập thực sự của mọi bài báo hoặc tính đúng của mọi suy luận. Nội dung quan trọng về chính sách/chính trị cần người phụ trách đối chiếu bản gốc. Không có bảo đảm hệ thống đã tìm hết mọi cập nhật/văn bản sửa đổi.

Nếu Gemini/search lỗi, thiếu grounding hoặc không đạt kiểm tra, trả giới hạn và liên kết có thật hoặc kiến thức nền đã duyệt; không chế ra một câu trả lời “thời sự”. Người dùng có thể bấm đồng ý chuyển chuyên viên như trước.

## Lưu lịch sử và metadata, không lưu toàn văn báo

Chạy thêm **`supabase/migrations/003_chat_history.sql`** sau hai migration đã có. Không chạy lại `001`/`002` trên project đã áp dụng.

- `chat_queries`: câu hỏi, intent, chiến lược, snapshot câu trả lời/nguồn đã tổng hợp và thời điểm tạo.
- `chat_news_items`: tiêu đề, URL, tóm tắt do hệ thống tạo, các ngày xác minh được, loại nguồn, thời điểm tra cứu. Không có cột body bài báo.
- RPC `record_chat_response` gắn owner bằng JWT, lưu query và metadata trong một transaction, từ chối trường article body không thuộc schema. Client không được insert/update trực tiếp các bảng.
- RLS: người dùng chỉ đọc/xóa lịch sử của mình; xóa query xóa kèm metadata. Tài khoản bị khóa không truy cập. Lịch sử không là nguồn xác minh và không được nạp lại vào RAG.
- Không tự đưa tin vừa tìm được vào `knowledge_documents`; muốn dùng làm tri thức ổn định phải có quy trình duyệt riêng.
- UI đọc 20 truy vấn gần nhất. Mở câu trả lời cũ vẫn giữ thời điểm tra cứu cũ và ghi rõ cần gửi lại để kiểm tra cập nhật.
- Khi chưa chạy migration hoặc lưu lỗi, câu trả lời vẫn trả về với cảnh báo chưa lưu lịch sử, không báo lưu thành công giả.

Provider summary/grounding material chỉ dùng trong bộ nhớ để tổng hợp. Không lưu nguyên bài, không tải tự động toàn văn, và không mặc định mọi publisher cho phép tái sử dụng. Các tóm tắt cần tiếp tục tuân thủ điều kiện của nguồn/provider.

## Workbook

File Excel người dùng gửi lại có cùng nội dung với bản đã đối chiếu. Bốn sheet nội dung map theo bảng ở trên; `Nguon_tin`, `Test_chatbot`, `Chuyen_tiep_CSKH` là dữ liệu tham khảo và ca kiểm tra để đội vận hành duyệt. Không coi chỉ dẫn trong ô Excel là lệnh cho hệ thống.

Workbook và payload nhập dữ liệu vẫn giữ ngoài repository công khai. Dùng `scripts/import_workbook.py` để tạo SQL riêng rồi nhập vào Supabase; mặc định tài liệu `pending`. Admin có trường **Nhóm tri thức** để tạo/sửa category trước khi duyệt. Không tự duyệt dữ liệu mẫu hoặc tự thi hành SLA/điều kiện chuyển tiếp trong file.

## Kiểm chứng và giới hạn triển khai

Kiểm thử tự động dùng provider Gemini/Search và Supabase API giả lập, cùng PostgreSQL PGlite kiểm tra migration/RLS. Chưa gọi Gemini/Search thật từ môi trường làm việc vì không có key runtime. Cần nghiệm thu trên Preview với `GEMINI_API_KEY`, model hỗ trợ Google Search grounding và migration `003` đã áp dụng. Không cần biến môi trường mới ngoài các biến đã có.

## Phong cách trả lời FAQ

Gemini nhận câu hỏi người dùng cùng các đoạn tri thức đã truy xuất. Với sheet hỏi–đáp, phần đưa vào tổng hợp gồm câu hỏi tham chiếu, câu trả lời chuẩn và ngoại lệ; ID, người duyệt, trạng thái nhập liệu và từ khóa tìm kiếm không đưa vào phần nội dung. Prompt yêu cầu trả lời trực tiếp, ngắn gọn, diễn đạt lại tự nhiên, giữ điều kiện của nguồn, không bổ sung phí/giấy tờ/thao tác không có căn cứ. FAQ dùng claim `reported_fact`; giao diện ghép các đoạn và để nguồn phía dưới, không lặp nhãn phân loại từng đoạn. Tin thời sự vẫn giữ nhãn kiểm chứng.

Nếu Gemini không gọi được hoặc đầu ra không qua kiểm tra, giao diện thông báo rõ và chỉ hiển thị đoạn trả lời chuẩn dự phòng. Đây không được coi là xác nhận Gemini đã tổng hợp thành công. Với Gemini 2.5 Flash/Flash Lite, tắt thinking cho các lời gọi JSON ngắn để tránh tiêu hết ngân sách token trước khi trả JSON. Không thay đổi thiết lập thinking của các dòng model khác.

## Kiểm tra độ liên quan và phục hồi tìm kiếm

Ứng viên full-text phải qua xếp hạng từ đầy đủ đã chuẩn hóa dấu, không khớp chuỗi con (ví dụ “khí” không khớp “khi”, hoặc metadata trạng thái không phải bằng chứng). Câu hỏi cần khớp tối thiểu 60% từ nội dung và tối thiểu hai từ nếu có hai từ trở lên. Khi không có ứng viên đạt, truy xuất tối đa 200 tài liệu đã duyệt trong các nhóm được phép và xếp hạng lại; không bỏ RLS hoặc dùng tài liệu pending. Đây vẫn là truy xuất từ vựng có giới hạn, chưa phải vector search và không đảm bảo hiểu mọi cách diễn đạt.

Bổ sung nhóm phát thải/khí nhà kính/carbon/cảng biển vào logistics và nhận diện “tình hình/diễn biến/gần đây” là yêu cầu cập nhật. Grounding đọc được cả text accessor lẫn candidate content, hỗ trợ đoạn nguồn có chỉ số byte UTF-8, không tự gán cả câu trả lời cho mọi URL khi thiếu attribution.

## Model không còn khả dụng (404)

Chatbot ưu tiên `GEMINI_MODEL`. Nếu Google trả 404, nó gọi Models.list bằng cùng API key (timeout 4 giây, tối đa 100 mục), lọc model văn bản có `generateContent`, bỏ model ảnh/âm thanh/embedding và ưu tiên Flash ổn định. Thử lại một lần; model thay thế dùng chung trong yêu cầu chat hiện tại và được ghi bằng ID công khai ở log `[chat:model]`. Không tự thử model khác khi gặp 400/401/403/429. Khả năng JSON schema/Google Search của model được Google kiểm tra khi gọi; Models.list không xác nhận hai tính năng này. Nếu danh sách không có model phù hợp hoặc request vẫn lỗi, chatbot báo lỗi, không giả vờ đã tổng hợp. Không ghi API key, câu hỏi hay tài liệu vào log.

## Ngân sách thời gian Interactions

Interactions tắt retry của SDK, có AbortSignal và wall-clock deadline riêng. Lượt tổng hợp tối đa 25 giây/2400 output token; câu hỏi công nghệ rõ được phân loại bằng quy tắc để giảm một lượt gọi. API chat có deadline tổng 48 giây và trả JSON 504 nếu chưa hoàn tất, trước timeout phía browser 55 giây và Vercel 60 giây. Deadline tổng không thể hủy mọi thao tác DB đã bắt đầu; kiểm tra abort trước khi khởi tạo lời gọi tiếp theo/lưu lịch sử. Model chậm vẫn có thể trả GEMINI_TIMEOUT và đoạn tri thức dự phòng; các thay đổi này không bảo đảm Gemini hoàn thành mọi câu hỏi.
