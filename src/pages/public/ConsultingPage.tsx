import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EXPERTS_DATA } from '../../data/expertsData';
import { Expert } from '../../types';
import { connectionService } from '../../services/connectionService';
import { authService } from '../../services/authService';
import { useToast } from '../../components/ui/Toast';

export const ConsultingPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = authService.getCurrentUser();

  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [bookingPackage, setBookingPackage] = useState<'Basic' | 'Pro'>('Basic');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [contactName, setContactName] = useState(currentUser?.fullName || '');
  const [companyName, setCompanyName] = useState(currentUser?.companyName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [preferredDate, setPreferredDate] = useState('2026-11-02');
  const [timeSlot, setTimeSlot] = useState('09:00 - 10:30');
  const [objective, setObjective] = useState('');

  const handleOpenBooking = (pkg: 'Basic' | 'Pro', expert?: Expert) => {
    setBookingPackage(pkg);
    if (expert) setSelectedExpert(expert);
    setIsModalOpen(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactName || !companyName || !phone || !email || !objective) {
      toast.warning("Vui lòng điền đủ thông tin", "Hãy cung cấp tên, công ty, liên hệ và mục tiêu cần tư vấn.");
      return;
    }

    try {
      const booking = connectionService.bookConsultation({
        buyerId: currentUser?.id || `guest-${Date.now()}`,
        buyerCompany: companyName,
        buyerContactName: contactName,
        buyerPhone: phone,
        buyerEmail: email,
        goi_dich_vu: bookingPackage,
        ngay_mong_muon: preferredDate,
        khung_gio: timeSlot,
        muc_tieu_tu_van: objective,
        chuyen_gia_id: selectedExpert?.id
      });

      setIsModalOpen(false);
      toast.success(
        "Đặt lịch tư vấn thành công!",
        `Gói ${bookingPackage} đã được tiếp nhận. Admin sẽ xác nhận và gửi lịch phòng họp qua email trong 24 giờ.`
      );

      if (currentUser?.role === 'BUYER') {
        navigate('/buyer/consulting');
      }
    } catch {
      toast.error("Có lỗi xảy ra", "Không thể gửi yêu cầu đặt lịch lúc này.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="primary" size="md">Dịch vụ Cố vấn Độc lập</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Tư vấn Chuyển đổi số & Tối ưu Vận hành Logistics
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Đội ngũ chuyên gia độc lập giàu kinh nghiệm thực tiễn đồng hành cùng doanh nghiệp từ bước chẩn đoán điểm nghẽn, thẩm định giải pháp công nghệ, rà soát hợp đồng đến nghiệm thu chỉ số KPI.
        </p>
      </div>

      {/* Packages Pricing Cards (Standardized per VNYTL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Basic Package */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm hover:shadow-md transition-shadow space-y-6 relative flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" size="md">Gói Cơ Bản</Badge>
              <span className="text-xs text-slate-500 font-medium">3 buổi × 60-90 phút</span>
            </div>

            <div>
              <div className="text-3xl font-black text-slate-900">
                3.000.000 <span className="text-sm text-slate-500 font-normal">VNĐ</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Phù hợp doanh nghiệp bắt đầu tìm kiếm và thẩm định giải pháp.</p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Buổi 1:</strong> Đánh giá hiện trạng quy trình và bóc tách nguyên nhân 3 điểm nghẽn.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Buổi 2:</strong> Thẩm định các báo giá, phạm vi chức năng và chi phí ẩn từ các nhà cung cấp.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Buổi 3:</strong> Xây dựng bảng tiêu chí nghiệm thu và bộ chỉ số KPI đo lường trước/sau.</span>
              </li>
            </ul>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full font-bold"
            onClick={() => handleOpenBooking('Basic')}
          >
            Đăng ký Gói Basic (3 triệu)
          </Button>
        </div>

        {/* Pro Package */}
        <div className="bg-gradient-to-b from-blue-50/70 to-white rounded-2xl border-2 border-[#1769AA] p-8 shadow-md relative flex flex-col justify-between space-y-6">
          <div className="absolute -top-3.5 right-6 bg-[#1769AA] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Khuyên dùng cho Doanh nghiệp
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="primary" size="md">Gói Chuyên Sâu (Pro)</Badge>
              <span className="text-xs text-[#1769AA] font-semibold">5 buổi × 60-90 phút</span>
            </div>

            <div>
              <div className="text-3xl font-black text-[#1769AA]">
                6.500.000 <span className="text-sm text-slate-500 font-normal">VNĐ</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Đồng hành trọn vẹn xuyên suốt giai đoạn triển khai và nghiệm thu dự án.</p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1769AA] shrink-0 mt-0.5" />
                <span>Toàn bộ quyền lợi thuộc gói Basic (3 buổi).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1769AA] shrink-0 mt-0.5" />
                <span><strong>Buổi 4:</strong> Giám sát tiến độ tại mốc chạy thử nghiệm (UAT) và tháo gỡ vướng mắc nhân sự.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1769AA] shrink-0 mt-0.5" />
                <span><strong>Buổi 5:</strong> Nghiệm thu chỉ số hiệu quả thực tế và lập kế hoạch mở rộng lộ trình 12 tháng.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1769AA] shrink-0 mt-0.5" />
                <span>Bàn giao biên bản tư vấn & tài liệu khuyến nghị lộ trình số hóa riêng biệt.</span>
              </li>
            </ul>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-md"
            onClick={() => handleOpenBooking('Pro')}
          >
            Đăng ký Gói Pro (6.5 triệu)
          </Button>
        </div>
      </div>

      {/* Experts Profiles Showcase */}
      <div className="space-y-6 pt-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Danh sách chuyên gia cố vấn tiêu biểu
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Chuyên gia độc lập, không đại diện cho bất kỳ nhà cung cấp phần mềm nào
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXPERTS_DATA.map(exp => (
            <div
              key={exp.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={exp.avatarUrl}
                    alt={exp.ho_ten}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900">{exp.ho_ten}</h3>
                    <p className="text-xs font-medium text-[#1769AA]">{exp.chuc_danh}</p>
                    <p className="text-xs text-slate-500">{exp.cong_ty_to_chuc}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {exp.gioi_thieu}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.linh_vuc.map((l, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span className="font-bold text-amber-600">★ {exp.danh_gia_sao}</span> ({exp.so_phien_da_tu_van} phiên)
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenBooking('Basic', exp)}
                >
                  Chọn chuyên gia này
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Wizard Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Đăng ký Tư vấn Chuyên gia (Gói ${bookingPackage})`}
        subtitle={`Giá niêm yết: ${bookingPackage === 'Basic' ? '3.000.000' : '6.500.000'} VNĐ • Hình thức: Online qua Google Meet`}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Họ và tên người đại diện *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tên Doanh nghiệp *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Công ty TNHH Vận tải ABC"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Số điện thoại liên hệ *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0912345678"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email nhận lịch họp *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Ngày mong muốn buổi đầu</label>
              <input
                type="date"
                value={preferredDate}
                onChange={e => setPreferredDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Khung giờ phù hợp</label>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs bg-white"
              >
                <option value="09:00 - 10:30">Buổi sáng (09:00 - 10:30)</option>
                <option value="14:00 - 15:30">Buổi chiều (14:00 - 15:30)</option>
                <option value="16:00 - 17:30">Cuối giờ chiều (16:00 - 17:30)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Chuyên gia mong muốn (tùy chọn)</label>
            <select
              value={selectedExpert?.id || ''}
              onChange={e => {
                const exp = EXPERTS_DATA.find(x => x.id === e.target.value);
                setSelectedExpert(exp || null);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs bg-white"
            >
              <option value="">-- Để Admin chỉ định chuyên gia phù hợp nhất --</option>
              {EXPERTS_DATA.map(exp => (
                <option key={exp.id} value={exp.id}>{exp.ho_ten} ({exp.chuc_danh})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Mục tiêu & Vấn đề cần hỗ trợ *</label>
            <textarea
              rows={3}
              required
              value={objective}
              onChange={e => setObjective(e.target.value)}
              placeholder="Ví dụ: Cần thẩm định giải pháp TMS cho đội xe 30 chiếc, làm rõ bài toán tích hợp định vị GPS và giảm tỷ lệ xe chạy rỗng chiều về..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Hủy bỏ
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Xác nhận gửi yêu cầu
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
