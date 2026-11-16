# Dữ liệu chatbot

File gốc giữ nguyên, hash/số dòng trong `manifest.json`. Đã nhập thật vào Supabase: **131 bản nháp tri thức**, **23 mục tham khảo** (15 nguồn, 8 mẫu CSKH). 14 ca đánh giá giữ riêng ở `evaluation-cases.json`, không phải nội dung để chatbot làm theo.

Các trạng thái nguồn: 85 cần duyệt, 5 đã biên soạn–cần duyệt, 41 chờ xác minh. Không có mục nào tự xuất bản. Admin phải kiểm tra nội dung, nguồn và ngày cập nhật rồi duyệt trong cổng. Danh sách nguồn không tự crawl URL; mẫu SLA không thành cam kết.

Để tái tạo artifacts mà không kết nối DB:

```sh
python -m venv /workspace/chatbot-import-venv
/workspace/chatbot-import-venv/bin/pip install -r scripts/requirements-chatbot.txt
/workspace/chatbot-import-venv/bin/python scripts/import_chatbot.py data/chatbot/Mau_data_chatbot_POLYMATCH.xlsx
```

Script không thực thi ô hoặc mở URL. Chỉ ghi JSON và SQL bản nháp; không ghi đè dữ liệu đã biên tập khi import SQL lại. Ứng dụng runtime không cần Python/openpyxl. Hướng dẫn đầy đủ ở `docs/PLATFORM.md`.
