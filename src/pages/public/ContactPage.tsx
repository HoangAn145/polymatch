import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const ContactPage: React.FC = () => {
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [topic, setTopic] = useState('tu_van');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.warning("Vui lòng điền đủ thông tin", "Họ tên, email và nội dung tin nhắn là bắt buộc.");
      return;
    }

    setIsSent(true);
    toast.success(
      "Gửi liên hệ thành công!",
      "Yêu cầu của bạn đã được ghi nhận vào hệ thống demo. Đội ngũ POLYMATCH sẽ phản hồi sớm."
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="primary">Liên hệ & Hợp tác</Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Kết nối với Ban Quản trị POLYMATCH
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Chúng tôi luôn sẵn sàng lắng nghe câu hỏi, phản hồi hoặc nhu cầu hợp tác chuyển đổi số từ các doanh nghiệp và đối tác công nghệ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#104D80] to-[#1769AA] text-white p-8 rounded-2xl space-y-6 shadow-md">
          <div>
            <h3 className="font-extrabold text-lg text-white">Văn phòng Điều phối Dự án</h3>
            <p className="text-xs text-blue-100 mt-1">Đồng hành cùng cộng đồng Logistics Việt Nam</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Địa chỉ:</strong>
                <span className="text-blue-100 leading-relaxed">
                  Tầng 6, Tòa nhà Trung tâm Đổi mới Sáng tạo, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Hotline hỗ trợ:</strong>
                <span className="text-blue-100">1900 6868 (Thứ 2 - Thứ 6: 08:00 - 17:30)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Hộp thư điện tử:</strong>
                <span className="text-blue-100">lienhe@polymatch.vn • hotro@polymatch.vn</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20 text-[11px] text-blue-200 leading-relaxed">
            * Đối với các đối tác muốn thẩm định gia nhập mạng lưới Nhà cung cấp (Seller), vui lòng chuẩn bị sẵn Giấy chứng nhận ĐKKD và tài liệu giải pháp.
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="font-bold text-base text-slate-900 mb-2">Gửi tin nhắn hoặc yêu cầu hỗ trợ</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email liên hệ *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@company.vn"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tên Doanh nghiệp</label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Công ty TNHH Vận tải Logistics..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chủ đề quan tâm</label>
                  <select
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 bg-white"
                  >
                    <option value="tu_van">Tư vấn đánh giá chuyển đổi số</option>
                    <option value="seller_join">Đăng ký làm Nhà cung cấp công nghệ</option>
                    <option value="bao_cao">Mua báo cáo chẩn đoán chuyên sâu</option>
                    <option value="hop_tac">Hợp tác hiệp hội / Viện nghiên cứu</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung chi tiết *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Mô tả tóm tắt nhu cầu, quy mô đội xe/kho hoặc thắc mắc cần giải đáp..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
                />
              </div>

              <div className="pt-2">
                <Button variant="primary" size="md" rightIcon={<Send className="w-4 h-4" />} type="submit">
                  Gửi thông tin liên hệ
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">Cảm ơn bạn đã liên hệ!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Yêu cầu của bạn đã được ghi nhận thành công trong phiên diễn tập. Ban Điều phối POLYMATCH sẽ chủ động liên hệ lại theo email <strong>{email}</strong>.
              </p>
              <Button variant="outline" size="sm" onClick={() => setIsSent(false)}>
                Gửi liên hệ khác
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
