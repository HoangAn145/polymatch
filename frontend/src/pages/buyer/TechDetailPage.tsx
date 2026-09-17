import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Star, 
  ShieldCheck, 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  Check, 
  Share2, 
  Scale, 
  Phone, 
  Mail, 
  Send,
  Sparkles,
  Lock
} from 'lucide-react';
import { TechListing } from '../../types';

export const TechDetailPage: React.FC = () => {
  const { 
    techListings, 
    activeTechDetailId, 
    navigate, 
    toggleCompare, 
    comparisonList, 
    createLead,
    currentUser,
    investmentPrefs
  } = useApp();

  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryNotes, setInquiryNotes] = useState('Chúng tôi quan tâm và muốn nhận báo giá chi tiết cho giải pháp này.');

  // Find tech by active ID or fallback to first
  const tech: TechListing = techListings.find(t => t.id === activeTechDetailId) || techListings[0];
  const isComparing = comparisonList.includes(tech.id);

  const handleQuickInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role === 'GUEST') {
      sessionStorage.setItem('dbi_login_notice', `Vui lòng đăng nhập tài khoản doanh nghiệp để gửi yêu cầu báo giá cho giải pháp "${tech.techName}".`);
      navigate('/login');
      return;
    }
    createLead({
      listingId: tech.id,
      techName: tech.techName,
      vendorName: tech.vendorName,
      buyerName: currentUser.company.companyName,
      buyerMst: currentUser.company.mst,
      buyerPhone: currentUser.phone,
      buyerEmail: currentUser.email,
      buyerDbiLevel: 2,
      buyerDbiScore: 48,
      notes: inquiryNotes,
      budgetRange: investmentPrefs.budgetText,
      timeline: 'Quý 2/2026'
    });
    setInquirySent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/assessment/active/recommendations')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Danh sách Đề xuất</span>
      </button>

      {/* Main Product Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Col 1: Thumbnail & Media */}
          <div className="h-72 lg:h-auto relative bg-slate-100 overflow-hidden">
            <img
              src={tech.thumbnailUrl}
              alt={tech.techName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-slate-900/80 text-white text-xs font-bold px-3 py-1 rounded-md backdrop-blur-xs">
              Mã chuẩn: {tech.id_tech}
            </div>
            <div className="absolute bottom-4 left-4 bg-teal-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-md shadow-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Khớp {tech.matchPercentage || 92}% với hồ sơ DBI</span>
            </div>
          </div>

          {/* Col 2 & 3: Info & Actions */}
          <div className="p-6 sm:p-8 lg:col-span-2 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                    Trụ cột: {tech.pillarId}
                  </span>
                  <span className="text-xs text-slate-500">
                    Dành cho doanh nghiệp cấp DBI: <strong>Cấp {tech.targetDbiLevels.join(', ')}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{tech.rating}</span>
                  <span className="text-slate-400 text-xs font-normal">({tech.reviewCount} đánh giá từ doanh nghiệp)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {tech.techName}
              </h1>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>Phát triển bởi: <strong>{tech.vendorName}</strong></span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> MST Đã thẩm định
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                {tech.summary}
              </p>

              {/* Price Tag Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">
                    Chi phí tham chiếu chính thức
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-teal-700">
                    {tech.priceMin.toLocaleString('vi-VN')} - {tech.priceMax.toLocaleString('vi-VN')} VND
                  </span>
                  <span className="text-xs text-slate-500 ml-2">({tech.priceUnit})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (currentUser.role === 'GUEST') {
                        sessionStorage.setItem('dbi_login_notice', 'Vui lòng đăng nhập để thêm và so sánh các giải pháp công nghệ.');
                        navigate('/login');
                        return;
                      }
                      toggleCompare(tech.id);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      isComparing ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isComparing ? 'Đã thêm so sánh' : 'Thêm vào so sánh'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Inquire quick bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Nhà cung cấp cam kết phản hồi trong <strong>24h làm việc</strong>.
              </span>
              <button
                onClick={() => {
                  const elem = document.getElementById('inquiry-form-section');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Bày tỏ quan tâm & Nhận Báo giá</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs & Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Features & Specs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900">
              Tính năng Trọng tâm & Lợi ích Doanh nghiệp
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tech.features.map((feature, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-slate-800 leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Thông số Triển khai & Hỗ trợ kỹ thuật
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Mô hình vận hành</span>
                  <strong className="text-slate-800">Cloud SaaS / On-premise</strong>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Thời gian triển khai</span>
                  <strong className="text-slate-800">2 - 4 tuần</strong>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Thời gian cam kết SLA</span>
                  <strong className="text-teal-700">99.9% Uptime</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Simulation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900">
                Đánh giá từ các Doanh nghiệp cùng ngành ({tech.reviewCount})
              </h2>
              <span className="text-xs font-bold text-teal-700">100% Đã xác thực người dùng</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                      CP
                    </span>
                    <strong className="text-slate-800">CTCP Chế biến Thủy hải sản Nam Việt</strong>
                  </div>
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  "Triển khai rất nhanh chóng, đội ngũ hỗ trợ nhiệt tình. Giúp chúng tôi số hóa toàn bộ dữ liệu đơn hàng và kho bãi, điểm DBI trụ cột Vận hành tăng rõ rệt từ 35 lên 68 điểm."
                </p>
                <div className="text-[11px] text-slate-400">Đã triển khai tháng 01/2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Direct Inquiry Form */}
        <div id="inquiry-form-section" className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">
              Gửi yêu cầu Khảo sát & Báo giá
            </h2>
            <p className="text-xs text-slate-500">
              Kết nối trực tiếp với đại diện kỹ thuật của {tech.vendorName}.
            </p>

            {inquirySent ? (
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-950">Đã gửi yêu cầu thành công!</h4>
                <p className="text-xs text-emerald-800">
                  Nhà cung cấp đã nhận được thông tin liên hệ và báo cáo DBI của bạn.
                </p>
                <button
                  onClick={() => navigate('/interests')}
                  className="w-full mt-2 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold"
                >
                  Mở phòng chat trao đổi
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuickInquiry} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ghi chú nhu cầu triển khai
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={inquiryNotes}
                    onChange={(e) => setInquiryNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-teal-600"
                  />
                </div>

                {currentUser.role === 'GUEST' ? (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1.5 text-amber-900">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <Lock className="w-3.5 h-3.5" />
                      Yêu cầu đăng nhập tài khoản
                    </div>
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      Bạn đang ở vai trò Khách. Nhấn nút bên dưới sẽ chuyển bạn đến trang đăng nhập để kết nối chính thức với nhà cung cấp.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="text-slate-500">Thông tin liên hệ gửi kèm:</div>
                    <div className="font-semibold text-slate-800">{currentUser.company.companyName}</div>
                    <div className="text-slate-600">{currentUser.phone} • {currentUser.email}</div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{currentUser.role === 'GUEST' ? 'Đăng nhập để gửi yêu cầu' : 'Gửi yêu cầu Báo giá'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Brochure download */}
          <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-3">
            <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wider">
              Tài liệu Giải pháp (Brochure)
            </h4>
            <p className="text-xs text-teal-900/80">
              Tải trọn bộ tài liệu kiến trúc kỹ thuật và hướng dẫn tích hợp API.
            </p>
            <button
              onClick={() => alert(`Tải xuống thành công Brochure: ${tech.techName}_Brochure_2026.pdf`)}
              className="w-full py-2.5 bg-white hover:bg-teal-100/50 text-teal-800 border border-teal-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải Brochure PDF (2.4MB)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
