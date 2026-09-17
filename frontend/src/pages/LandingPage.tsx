import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Building2, 
  Store, 
  Sparkles, 
  Cpu, 
  Users, 
  Target, 
  Server, 
  Award,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Search
} from 'lucide-react';
import { DBI_PILLARS, DBI_LEVELS } from '../data/mockData';

export const LandingPage: React.FC = () => {
  const { navigate, switchRole, techListings, currentUser } = useApp();

  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-left space-y-8">
          <h1 id="landing-hero-heading" className="text-left text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-5xl leading-tight sm:leading-tight uppercase">
            NỀN TẢNG ĐÁNH GIÁ MỨC ĐỘ CHUYỂN ĐỔI SỐ <br className="hidden sm:inline" />
            <span className="text-teal-300 font-bold">
              VÀ KẾT NỐI GIẢI PHÁP CHO DOANH NGHIỆP
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed text-left">
            Hệ thống hỗ trợ doanh nghiệp Việt Nam tự đánh giá toàn diện theo 6 trụ cột DBI, nhận báo cáo chỉ số độc lập và kết nối mạng lưới nhà cung cấp công nghệ số uy tín đã qua kiểm định.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 pt-2">
            <button
              onClick={() => {
                if (currentUser.role === 'GUEST') {
                  sessionStorage.setItem('dbi_login_notice', 'Vui lòng đăng nhập tài khoản doanh nghiệp để làm bài Đánh giá DBI và lưu kết quả.');
                  navigate('/login');
                } else {
                  navigate('/assessment/intro');
                }
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Làm bài Đánh giá DBI (Miễn phí 10-15p)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                if (currentUser.role === 'GUEST') {
                  navigate('/register/role');
                } else {
                  navigate('/vendor');
                }
              }}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold text-sm sm:text-base border border-slate-700 backdrop-blur-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4 text-teal-400" />
              <span>Đăng ký Nhà cung cấp (Vendor)</span>
            </button>
          </div>

          {/* Trust stats badge */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mr-auto border-t border-slate-800/80 text-left">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">6 Trụ cột</div>
              <div className="text-xs text-slate-400 mt-0.5">Tiêu chuẩn DBI đồng bộ</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">5 Cấp độ</div>
              <div className="text-xs text-slate-400 mt-0.5">Lộ trình số hóa từ 0 - 100</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">1.450+</div>
              <div className="text-xs text-slate-400 mt-0.5">Doanh nghiệp đã đánh giá</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Nhà cung cấp xác thực MST</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 6 TRỤ CỘT ĐÁNH GIÁ DBI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Khung Đánh giá Toàn diện
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            6 Trụ cột Trưởng thành Số theo Bộ chỉ số DBI
          </h2>
          <p className="text-sm text-slate-600">
            Bộ câu hỏi được thiết kế khoa học, giúp doanh nghiệp phát hiện chính xác "điểm nghẽn" và khoảng trống công nghệ để tối ưu hóa nguồn lực đầu tư.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DBI_PILLARS.map((pillar, idx) => (
            <div
              key={pillar.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 font-extrabold text-sm flex items-center justify-center border border-teal-100">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Trọng số: {Math.round(pillar.weight * 100)}%
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{pillar.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
                onClick={() => {
                  if (currentUser.role === 'GUEST') {
                    sessionStorage.setItem('dbi_login_notice', 'Vui lòng đăng nhập tài khoản để xem tiêu chuẩn khảo sát và bộ câu hỏi đánh giá.');
                    navigate('/login');
                  } else {
                    navigate('/assessment/intro');
                  }
                }}
              >
                <span>Xem tiêu chuẩn khảo sát</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: 5 CẤP ĐỘ TRƯỞNG THÀNH SỐ */}
      <section className="bg-slate-100/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Thang điểm 0 - 100
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              5 Mức độ Chuyển đổi số Doanh nghiệp
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Mỗi cấp độ định danh chính xác hiện trạng vận hành và đưa ra lộ trình khuyến nghị hành động phù hợp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {DBI_LEVELS.map((lvl) => (
              <div 
                key={lvl.level}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400">CẤP {lvl.level}</span>
                    <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {lvl.minScore}-{lvl.maxScore} điểm
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 leading-snug">{lvl.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{lvl.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
                  <strong className="text-slate-700 block mb-0.5">Khuyến nghị:</strong>
                  {lvl.advice}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: SÀN CÔNG NGHỆ B2B KIỂM ĐỊNH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Thị trường Giải pháp B2B
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sàn Kết nối Giải pháp Công nghệ Kiểm định
            </h2>
          </div>

          <button
            onClick={() => {
              if (currentUser.role === 'GUEST') {
                sessionStorage.setItem('dbi_login_notice', 'Vui lòng đăng nhập tài khoản để khám phá toàn bộ giải pháp số phù hợp.');
                navigate('/login');
              } else {
                navigate('/assessment/active/recommendations');
              }
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800"
          >
            <span>Xem tất cả giải pháp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Top Tech Listing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {techListings.slice(0, 3).map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 w-full overflow-hidden relative">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.techName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                    {item.id_tech}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 text-teal-800 text-[11px] font-extrabold px-2 py-0.5 rounded shadow-xs">
                    ★ {item.rating} ({item.reviewCount} đánh giá)
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>{item.vendorName}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {item.techName}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="pt-2 text-xs font-bold text-teal-700">
                    {item.priceMin.toLocaleString('vi-VN')} - {item.priceMax.toLocaleString('vi-VN')} VND
                    <span className="text-[10px] text-slate-500 font-normal block">{item.priceUnit}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <button
                  onClick={() => {
                    navigate(`/tech/${item.id}`);
                  }}
                  className="text-xs font-bold text-slate-700 hover:text-teal-700"
                >
                  Xem chi tiết
                </button>
                <button
                  onClick={() => {
                    if (currentUser.role === 'GUEST') {
                      sessionStorage.setItem('dbi_login_notice', `Vui lòng đăng nhập tài khoản doanh nghiệp để bày tỏ quan tâm giải pháp "${item.techName}".`);
                      navigate('/login');
                    } else {
                      navigate('/assessment/active/recommendations');
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
                >
                  Bày tỏ quan tâm
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-teal-800 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sẵn sàng định vị doanh nghiệp trên bản đồ chuyển đổi số?
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              Nhận ngay báo cáo phân tích chỉ số Radar 6 trụ cột, chỉ ra 3 khoảng trống công nghệ ưu tiên và tự động kết nối giải pháp tối ưu theo ngân sách.
            </p>
          </div>

          <button
            onClick={() => {
              if (currentUser.role === 'GUEST') {
                sessionStorage.setItem('dbi_login_notice', 'Vui lòng đăng nhập tài khoản doanh nghiệp để bắt đầu bài khảo sát chuyển đổi số.');
                navigate('/login');
              } else {
                navigate('/assessment/intro');
              }
            }}
            className="shrink-0 px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-blue-950 font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Bắt đầu khảo sát ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
