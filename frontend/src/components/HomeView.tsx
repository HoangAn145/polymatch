import React, { useState } from 'react';
import { TEN_NHANH } from '../data/weights';
import { BranchCode } from '../data/questions';
import { 
  Truck, 
  Warehouse, 
  Ship, 
  Package, 
  MapPin, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  BarChart3, 
  Cpu, 
  Sparkles,
  Users,
  Lock,
  ChevronRight
} from 'lucide-react';

interface HomeViewProps {
  onStartQuickScan: (branch?: BranchCode) => void;
  onStartFullAssessment: () => void;
  onNavigateToSolutions: () => void;
  onNavigateToVendorInfo: () => void;
  onNavigateToInsights: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartQuickScan,
  onStartFullAssessment,
  onNavigateToSolutions,
  onNavigateToVendorInfo,
  onNavigateToInsights,
}) => {
  const [activeSegment, setActiveSegment] = useState<BranchCode>('VT');

  const SEGMENTS: {
    id: BranchCode;
    title: string;
    icon: any;
    painPoint: string;
    targetSolution: string;
    metric: string;
  }[] = [
    {
      id: 'VT',
      title: 'Vận tải nội địa (VT)',
      icon: Truck,
      painPoint: 'Chi phí dầu tăng cao, xe chạy rỗng chiều về từ 50–70%, điều phối thủ công qua điện thoại & Zalo.',
      targetSolution: 'Hệ thống TMS tối ưu tuyến đường, ghép đơn tự động, khai thác dữ liệu GPS hộp đen để chấm điểm tài xế.',
      metric: 'Giảm km rỗng & tối ưu chi phí theo tuyến',
    },
    {
      id: 'KB',
      title: 'Dịch vụ Kho bãi (KB)',
      icon: Warehouse,
      painPoint: 'Số liệu tồn kho lệch giữa sổ sách và thực tế, nhặt hàng thủ công mất thời gian, dồn ứ đơn giờ cao điểm.',
      targetSolution: 'Phần mềm WMS quản lý vị trí kệ ô (bin location), quét mã vạch kiểm kê luân phiên cuốn chiếu.',
      metric: 'Đạt độ chính xác tồn kho > 98%',
    },
    {
      id: 'FF',
      title: 'Giao nhận quốc tế (FF)',
      icon: Ship,
      painPoint: 'Báo giá cước thủ công chậm trễ làm mất đơn, tra cứu container đa hãng tàu tốn hàng giờ mỗi ngày.',
      targetSolution: 'Phần mềm FMS quản lý lô hàng tự động, công cụ tra cứu vận đơn tập trung và khai hải quan VNACCS.',
      metric: 'Rút ngắn thời gian báo giá từ 24h xuống 15 phút',
    },
    {
      id: '3PL',
      title: '3PL / 4PL Tổng thể',
      icon: Package,
      painPoint: 'Hệ thống vận tải, kho và đơn hàng rời rạc, nhập lại dữ liệu thủ công, khó đáp ứng cam kết SLA với khách hàng FDI.',
      targetSolution: 'Nền tảng tích hợp WMS-TMS-OMS, tháp điều hành Control Tower và báo cáo phát thải chuẩn GLEC.',
      metric: 'Đồng bộ dữ liệu thời gian thực toàn chuỗi',
    },
    {
      id: 'LM',
      title: 'Chặng cuối (Last Mile)',
      icon: MapPin,
      painPoint: 'Giao trễ giờ cam kết, tỷ lệ giao thất bại lần đầu cao, tranh chấp biên bản giao nhận bằng giấy.',
      targetSolution: 'Ứng dụng tài xế xác nhận giao điện tử (ePOD) có chữ ký số và chụp ảnh, định tuyến giao hàng chặng cuối.',
      metric: 'Nâng tỷ lệ giao đúng hạn đủ hàng (OTIF)',
    }
  ];

  const currentSegmentData = SEGMENTS.find((s) => s.id === activeSegment)!;

  return (
    <div className="space-y-16 py-6 pb-20">
      
      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Phiên bản v3: Chấm điểm kép DBI &amp; LDMI chuyên sâu Logistics
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Từ bài toán logistics đến <br />
          <span className="text-blue-700">giải pháp công nghệ phù hợp nhất</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Đánh giá mức độ trưởng thành số (DBI chuẩn quốc gia &amp; LDMI chuyên ngành), xác định chính xác 3 khoảng trống vận hành then chốt và kết nối giải pháp công nghệ đã xác thực.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Quick Scan CTA (No login required) */}
          <button
            onClick={() => onStartQuickScan(activeSegment)}
            className="w-full sm:w-auto px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <Compass className="w-4 h-4 text-blue-200" />
            Làm Quick Scan miễn phí (2 phút)
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Full Assessment CTA (Protected action: Guest triggers login/register modal) */}
          <button
            onClick={onStartFullAssessment}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            Đánh giá đầy đủ &amp; Nhận đề xuất (10–12 phút)
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Không cần đăng nhập khi Quick Scan
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Không bán thứ hạng (R10)
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-purple-600" /> Ẩn danh dữ liệu doanh nghiệp (R14)
          </span>
        </div>
      </section>

      {/* 5 LOGISTICS SEGMENTS TABS SECTION (M01.01) */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              M01.01 · THÔNG ĐIỆP THEO 5 PHÂN KHÚC
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Chọn phân khúc logistics của doanh nghiệp bạn
            </h2>
            <p className="text-xs text-slate-500">
              Mỗi mô hình hoạt động đối mặt với những thách thức và khoảng trống công nghệ riêng biệt
            </p>
          </div>

          {/* Segment Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {SEGMENTS.map((seg) => {
              const Icon = seg.icon;
              const isActive = activeSegment === seg.id;
              return (
                <button
                  key={seg.id}
                  onClick={() => setActiveSegment(seg.id)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    isActive
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span className="text-xs">{seg.title}</span>
                </button>
              );
            })}
          </div>

          {/* Segment Pain Point & Solution Focus Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1.5">
              <span className="font-bold text-rose-800 uppercase tracking-wider font-mono text-[10px] block">
                NỖI ĐAU VẬN HÀNH THƯỜNG GẶP:
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {currentSegmentData.painPoint}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-blue-800 uppercase tracking-wider font-mono text-[10px] block">
                HƯỚNG GIẢI PHÁP ĐỀ XUẤT:
              </span>
              <p className="text-slate-700 leading-relaxed">
                {currentSegmentData.targetSolution}
              </p>
            </div>

            <div className="space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-bold text-emerald-800 uppercase tracking-wider font-mono text-[10px] block">
                  MỤC TIÊU CẢI THIỆN ĐO ĐƯỢC:
                </span>
                <p className="text-slate-800 font-semibold mt-1">
                  {currentSegmentData.metric}
                </p>
              </div>

              <button
                onClick={() => onStartQuickScan(currentSegmentData.id)}
                className="w-full py-2.5 px-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                Chẩn đoán nhánh {currentSegmentData.id} ngay
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3-STEP HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
            QUY TRÌNH 3 BƯỚC KHÉP KÍN
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Cách POLYMATCH giải quyết bài toán chuyển đổi số
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-base flex items-center justify-center">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Chẩn đoán Độc lập Hai lớp (DBI &amp; LDMI)
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Lớp 1 đo chỉ số trưởng thành số DBI (TOPSIS). Lớp 2 đánh giá sâu 8 nhóm năng lực logistics theo đặc thù nhánh hoạt động, không hỏi dàn trải câu hỏi vô ích.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-extrabold text-base flex items-center justify-center">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Xác định 3 Khoảng trống &amp; Lộ trình (R07)
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Tự động tính độ lớn khoảng trống, chỉ ra nguyên nhân gốc và đề xuất bước đi tiếp theo đúng với mức LDMI hiện tại, tuyệt đối không nhảy cóc (R19).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-base flex items-center justify-center">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Ghép nối 7 Thành phần &amp; Yêu cầu Báo giá
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Lọc theo ngân sách, quy mô và hệ thống hiện có. Tạo Hồ sơ nhu cầu ẩn danh gửi tới tối đa 5 nhà cung cấp đã xác thực mã số thuế để nhận báo giá cạnh tranh.
            </p>
          </div>
        </div>
      </section>

      {/* TEASER DÀNH CHO NHÀ CUNG CẤP CÔNG NGHỆ (M01.03) */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl text-left">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              M01.03 · DÀNH CHO NHÀ CUNG CẤP CÔNG NGHỆ (VENDORS)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Tiếp cận nguồn nhu cầu logistics đã chẩn đoán chính xác
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Không còn lãng phí công sức lọc phễu khách hàng ảo. Nhận ngay các Hồ sơ nhu cầu (RFQs) ẩn danh có đầy đủ thông tin về quy mô, mức trưởng thành, khoảng trống nghiệp vụ và khung ngân sách. Mở hồ sơ minh bạch với trần 5 nhà cung cấp.
            </p>
            <div className="flex items-center gap-4 text-xs text-amber-300 font-medium pt-1">
              <span>✓ Xác thực MST trong 24h</span>
              <span>✓ Hoàn tín chỉ nếu sai số liên hệ (R17)</span>
              <span>✓ Không thu hoa hồng hợp đồng</span>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <button
              onClick={onNavigateToVendorInfo}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Xem quyền lợi &amp; Đăng ký đối tác
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-5xl mx-auto px-4 pt-10 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-slate-800">POLYMATCH LOGISTICS v3</span> · Nền tảng Đánh giá Trưởng thành số &amp; Kết nối Công nghệ
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onNavigateToInsights} className="hover:text-slate-800">Logistics Insights</button>
          <a href="#dieukhoan" onClick={(e) => { e.preventDefault(); alert('Chính sách bảo mật dữ liệu doanh nghiệp theo Nghị định 13/2023/NĐ-CP'); }} className="hover:text-slate-800">Điều khoản &amp; Bảo mật</a>
          <a href="#lienhe" onClick={(e) => { e.preventDefault(); alert('Liên hệ Ban thư ký dự án: contact@polymatch.vn'); }} className="hover:text-slate-800">Liên hệ</a>
        </div>
      </footer>

    </div>
  );
};
