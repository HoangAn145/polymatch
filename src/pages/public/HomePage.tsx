import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  Truck,
  Warehouse,
  Ship,
  Boxes,
  MapPin,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Compass,
  FileCheck2,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SOLUTIONS_DATA } from '../../data/solutionsData';
import { ARTICLES_DATA, EXPERTS_DATA } from '../../data/expertsData';

export const HomePage: React.FC = () => {
  const segments = [
    {
      id: "VT",
      title: "Vận tải đường bộ (VT)",
      desc: "Giải quyết xe chạy rỗng, định tuyến giao hàng, lệnh điều xe điện tử & quản lý GPS.",
      icon: <Truck className="w-5 h-5" />,
      color: "from-blue-600 to-indigo-700"
    },
    {
      id: "KB",
      title: "Kho bãi & Phân phối (KB)",
      desc: "Tối ưu vị trí ô kệ, kiểm kê luân phiên barcode/RFID & nâng cao năng suất nhặt hàng.",
      icon: <Warehouse className="w-5 h-5" />,
      color: "from-emerald-600 to-teal-700"
    },
    {
      id: "FF",
      title: "Giao nhận & Hải quan (FF)",
      desc: "Số hóa quy trình booking, tự động hóa báo giá cước, theo dõi container & e-Manifest.",
      icon: <Ship className="w-5 h-5" />,
      color: "from-cyan-600 to-blue-700"
    },
    {
      id: "3PL",
      title: "Logistics tích hợp (3PL)",
      desc: "Đồng bộ đa phân hệ WMS-TMS-OMS, tháp điều khiển Control Tower & đo lường chi phí phục vụ.",
      icon: <Boxes className="w-5 h-5" />,
      color: "from-purple-600 to-indigo-800"
    },
    {
      id: "LM",
      title: "Giao hàng chặng cuối (LM)",
      desc: "Ký nhận điện tử ePOD, cập nhật thời gian thực ETA cho khách hàng & đối soát cước COD.",
      icon: <MapPin className="w-5 h-5" />,
      color: "from-amber-600 to-orange-700"
    }
  ];

  const featuredSolutions = SOLUTIONS_DATA.slice(0, 4);

  return (
    <div className="space-y-16">
      {/* 1. Hero Section (BDX Portal Inspired) */}
      <section className="bg-gradient-to-b from-[#EAF4FC] via-[#F4F8FC] to-[#F7F9FC] border-b border-slate-200/80 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-100/80 text-[#1769AA] text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                <ShieldCheck className="w-4 h-4 text-[#1769AA]" />
                <span>NỀN TẢNG ĐÁNH GIÁ CHUYỂN ĐỔI SỐ CHUỖI CUNG ỨNG LOGISTICS</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Chuyển đổi số logistics bắt đầu từ <span className="text-[#1769AA]">đúng vấn đề.</span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                POLYMATCH hỗ trợ doanh nghiệp trong chuỗi cung ứng đánh giá mức độ trưởng thành số, nhận diện điểm nghẽn và tìm kiếm giải pháp công nghệ phù hợp với ngân sách và khả năng triển khai thực tế.
              </p>

              {/* Slogan pill */}
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-800 bg-white/80 backdrop-blur-xs p-3 rounded-lg border border-slate-200/80 w-fit">
                <span className="flex items-center gap-1.5 text-[#1769AA]">
                  <CheckCircle2 className="w-4 h-4" /> Đánh giá đúng
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5 text-indigo-700">
                  <CheckCircle2 className="w-4 h-4" /> Kết nối trúng
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" /> Chuyển đổi nhanh
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link to="/quick-scan">
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Làm Quick Scan (2 phút)
                  </Button>
                </Link>
                <Link to="/solutions">
                  <Button variant="outline" size="lg">
                    Khám phá giải pháp công nghệ
                  </Button>
                </Link>
              </div>

              {/* Trust statement */}
              <div className="pt-4 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  ✓ Không cần thẻ tín dụng
                </span>
                <span className="flex items-center gap-1">
                  ✓ Đánh giá cơ bản miễn phí
                </span>
                <span className="flex items-center gap-1">
                  ✓ Nguyên tắc ghép nối trung lập
                </span>
              </div>
            </div>

            {/* Right Interactive Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-5 relative">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Chẩn đoán theo 5 phân khúc</h3>
                    <p className="text-xs text-slate-500">Chọn ngành của bạn để khám phá các bài toán</p>
                  </div>
                  <Badge variant="primary" size="sm">Pilot 2026</Badge>
                </div>

                <div className="space-y-2.5">
                  {segments.map(seg => (
                    <Link
                      key={seg.id}
                      to={`/quick-scan?branch=${seg.id}`}
                      className="group flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#1769AA] flex items-center justify-center shrink-0 group-hover:bg-[#1769AA] group-hover:text-white transition-colors">
                        {seg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#1769AA] flex items-center justify-between">
                          <span>{seg.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {seg.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <Link
                    to="/buyer/assessment"
                    className="text-xs font-semibold text-[#1769AA] hover:text-[#104D80] inline-flex items-center gap-1"
                  >
                    Hoặc thực hiện bài đánh giá chuyên sâu đầy đủ &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Common Pain Points Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <Badge variant="warning">Khó khăn thực tế</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Vì sao doanh nghiệp logistics gặp khó khi chuyển đổi số?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Khảo sát thực tiễn cho thấy phần lớn rào cản không nằm ở công nghệ, mà do chưa chẩn đoán đúng mức độ sẵn sàng và lựa chọn giải pháp quá đắt đỏ so với quy mô.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Đầu tư dàn trải, nhảy cóc</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Doanh nghiệp ở mức vận hành thủ công (LDMI 1) nhưng vội vã mua các phần mềm phức tạp đa năng triệu đô dẫn đến nhân viên kháng cự, bỏ cuộc sau vài tháng.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Dữ liệu phân mảnh, thiếu kết nối</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Phần mềm điều xe không nối với định vị GPS; chứng từ giao hàng giấy về chậm khiến chu kỳ đối soát cước và thu hồi công nợ kéo dài 15-30 ngày.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1769AA] flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Khó đánh giá hiệu quả đầu tư (ROI)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chưa thiết lập bộ chỉ số cơ sở (baseline) trước triển khai, không biết giải pháp có thực sự giúp giảm km chạy rỗng hay tăng độ chính xác kho bãi hay không.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Three Steps Workflow */}
      <section className="bg-white border-y border-slate-200/90 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <Badge variant="primary">Quy trình 3 bước</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Cách thức POLYMATCH đồng hành cùng bạn
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Quy trình khép kín từ khâu chẩn đoán ban đầu đến kết nối nhà cung cấp và đo lường kết quả sau triển khai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#1769AA] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Đánh giá mức độ & Điểm nghẽn</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thực hiện khảo sát rút gọn (10-12 phút). Nhận kết quả kép: chỉ số trưởng thành số DBI (QĐ 2158) và chỉ số năng lực logistics LDMI, cùng 3 điểm nghẽn nghiêm trọng nhất.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#1769AA]">
                Không dùng AI tính điểm • Khách quan & minh bạch
              </div>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-700 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Ghép nối giải pháp 7 thành phần</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thuật toán ghép nối đối chiếu ngân sách, điểm nghẽn và hệ thống hiện có để đề xuất giải pháp phù hợp nhất. Không đề xuất phần mềm vượt quá 1 bậc năng lực.
              </p>
              <div className="pt-2 text-xs font-semibold text-indigo-700">
                Chỉ nhà cung cấp xác thực • Minh bạch giá & TCO
              </div>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Theo dõi tiến độ & Đo lường KPI</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thiết lập dự án theo dõi, cập nhật các mốc triển khai và đo lường chỉ số trước/sau (km chạy rỗng, OTIF, tỷ lệ sai chứng từ) cùng chuyên gia cố vấn độc lập.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-700">
                Gói theo dõi 3-8-12 tháng • Cố vấn Basic/Pro
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Solutions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="primary">Danh mục công nghệ</Badge>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              Giải pháp công nghệ logistics nổi bật
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Được chuẩn hóa theo các nhóm bài toán: WMS, TMS, OMS, ePOD, FMS và Logistics xanh
            </p>
          </div>
          <Link to="/solutions">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Xem tất cả ({SOLUTIONS_DATA.length} giải pháp)
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSolutions.map(sol => (
            <div
              key={sol.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col justify-between hover:shadow-lg hover:border-blue-200 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" size="sm">{sol.nhom_giai_phap}</Badge>
                  {sol.la_tai_tro ? (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Tài trợ
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Đã xác thực
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                  {sol.ten}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {sol.mo_ta}
                </p>

                <div className="pt-2 text-xs border-t border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Nhà cung cấp:</span>
                    <span className="font-medium truncate max-w-[130px]">{sol.nha_cung_cap_ten}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Chi phí:</span>
                    <span className="font-bold text-[#1769AA] text-[11px] truncate max-w-[140px]">
                      {sol.khoang_gia_text}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <Link to="/solutions">
                  <Button variant="outline" size="sm" className="w-full">
                    Xem chi tiết
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Consulting Experts Highlight */}
      <section className="bg-slate-50 border-y border-slate-200/80 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <Badge variant="primary">Đội ngũ chuyên môn</Badge>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Tư vấn độc lập từ chuyên gia chuỗi cung ứng
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Cung cấp góc nhìn khách quan, hỗ trợ rà soát hợp đồng và theo dõi triển khai (Gói Basic 3 triệu, Pro 6.5 triệu).
              </p>
            </div>
            <Link to="/consulting">
              <Button variant="secondary" size="sm">
                Đăng ký lịch tư vấn
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXPERTS_DATA.map(exp => (
              <div key={exp.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={exp.avatarUrl}
                    alt={exp.ho_ten}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{exp.ho_ten}</h4>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{exp.chuc_danh}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {exp.gioi_thieu}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {exp.linh_vuc.slice(0, 2).map((l, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {l}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{exp.so_nam_kinh_nghiem} năm kinh nghiệm</span>
                  <span className="font-bold text-amber-600">★ {exp.danh_gia_sao}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Insights & Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="primary">Logistics Insights</Badge>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              Bài viết & Phân tích chuyên ngành
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cập nhật quy định chính sách, kinh nghiệm số hóa kho bãi, vận tải và logistics xanh
            </p>
          </div>
          <Link to="/insights">
            <Button variant="secondary" size="sm">
              Xem tất cả bài viết
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ARTICLES_DATA.map(art => (
            <Link
              key={art.id}
              to="/insights"
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={art.hinh_anh}
                  alt={art.tieu_de}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-[#1769AA] uppercase tracking-wider">
                    {art.chuyen_muc}
                  </span>
                  <h3 className="font-bold text-xs text-slate-900 group-hover:text-[#1769AA] transition-colors line-clamp-2 leading-snug">
                    {art.tieu_de}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {art.tom_tat}
                  </p>
                </div>
                <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100">
                  <span>{art.ngay_dang}</span>
                  <span>{art.thoi_gian_doc}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="bg-white border-t border-slate-200/90 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-10">
            <Badge variant="primary">Câu hỏi thường gặp</Badge>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Giải đáp thắc mắc về POLYMATCH
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <h4 className="font-bold text-sm text-slate-900">
                1. Điểm số DBI và LDMI trên POLYMATCH có phải là chứng chỉ chính thức không?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Không. Điểm số là kết quả chẩn đoán tự đánh giá nhanh dựa trên cấu trúc tham chiếu Quyết định 2158/QĐ-BTTTT và mô hình năng lực logistics LDMI do dự án xây dựng nhằm mục đích sàng lọc và phát hiện điểm nghẽn, không dùng để cấp chứng chỉ hay xếp hạng pháp lý chính thức.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <h4 className="font-bold text-sm text-slate-900">
                2. Doanh nghiệp tham gia đánh giá có mất phí không?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hoàn toàn miễn phí cho việc làm bài đánh giá, xem kết quả tổng quan, điểm nghẽn và nhận đề xuất giải pháp. Doanh nghiệp chỉ trả phí khi chủ động đăng ký các dịch vụ giá trị gia tăng như: Báo cáo chuyên sâu (700.000đ), Gói tư vấn chuyên gia (từ 3 triệu) hoặc Gói theo dõi triển khai.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <h4 className="font-bold text-sm text-slate-900">
                3. Nền tảng có ưu tiên nhà cung cấp trả tiền quảng cáo để đẩy điểm phù hợp không?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tuyệt đối không. Theo nguyên tắc trung lập VNYTL (Rule R10), thứ hạng và điểm phù hợp 7 thành phần được tính toán hoàn toàn bằng công thức toán học. Nhà cung cấp trả phí hoặc tài trợ chỉ được gắn nhãn nhận diện riêng biệt, không được quyền thay đổi thuật toán xếp hạng.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <h4 className="font-bold text-sm text-slate-900">
                4. Nhà cung cấp tham gia nền tảng có các nghĩa vụ tài chính nào?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nhà cung cấp trả phí thường niên 6.000.000đ/năm và hoa hồng đối soát khi ký hợp đồng thành công từ kết nối nền tảng (≤50 triệu: 5%, 50-100 triệu: 8%, &gt;100 triệu: 10%). Nền tảng không áp dụng cơ chế bán thông tin liên hệ bằng ví tín chỉ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-[#104D80] rounded-2xl p-8 sm:p-12 text-white text-center space-y-6 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sẵn sàng tối ưu hóa chi phí & vận hành chuỗi cung ứng?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Bắt đầu với bài đánh giá nhanh 10 câu hỏi để nhận diện 3 điểm nghẽn nghiêm trọng nhất đang làm tiêu hao lợi nhuận của doanh nghiệp bạn.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Link to="/quick-scan">
                <Button variant="secondary" size="lg" className="bg-white text-[#104D80] hover:bg-slate-100 font-bold">
                  Bắt đầu Quick Scan miễn phí
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
                  Đăng ký tài khoản doanh nghiệp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
