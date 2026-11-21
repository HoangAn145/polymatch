import {DiagnosticEvidencePanel} from '../../components/platform/DiagnosticEvidencePanel';
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Award,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  FileSpreadsheet,
  Download,
  Share2,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { useToast } from '../../components/ui/Toast';

export const BuyerAssessmentResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const assessments = dbService.getAssessments().filter(a => a.userId === currentUser?.id);
  const [params] = useSearchParams();
  const result = assessments.find(a=>a.id===params.get('assessment')) || assessments[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'dbi' | 'ldmi' | 'gaps' | 'ai'>('overview');

  if (!result) return <div className="bg-white rounded-2xl border p-6 space-y-3"><h1 className="text-xl font-bold">Kết quả đánh giá</h1><p>Chưa có đánh giá của bạn.</p><Link className="text-blue-700 underline" to="/buyer/assessment">Thực hiện đánh giá</Link></div>;

  // Chart data for DBI
  const dbiChartData = result.dbi_tru_cot.map(p => ({
    subject: p.ten.length > 15 ? p.ten.substring(0, 14) + '...' : p.ten,
    fullSubject: p.ten,
    diem: p.diem
  }));

  // Chart data for LDMI
  const ldmiChartData = result.ldmi_nhom.map(g => ({
    subject: g.ten,
    diem: g.diem
  }));

  const handleDownloadPdf = () => {
    toast.info("Đang xuất báo cáo PDF", "Bản xem trước tóm tắt kết quả đánh giá đang được khởi tạo.");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="success">Kết quả đánh giá hoàn tất</Badge>
            <span className="text-xs text-slate-500 font-mono">Lần thứ {result.lan_thu} • {new Date(result.ngay_tao).toLocaleDateString('vi-VN')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Báo cáo Chẩn đoán Mức độ Trưởng thành số & Điểm nghẽn
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleDownloadPdf}
          >
            Tải PDF kết quả
          </Button>
          <Link to="/buyer/solutions">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Xem giải pháp đề xuất
            </Button>
          </Link>
        </div>
      </div>

      <DiagnosticEvidencePanel analysis={result.diagnostic?.analysis}/>
      {/* Primary Dual Score Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DBI Card */}
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 p-6 sm:p-7 rounded-2xl border border-blue-200/90 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Chỉ số Chuyển đổi số Doanh nghiệp (DBI)
            </span>
            <Badge variant="primary" size="sm">{result.dbi_muc}</Badge>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-[#1769AA]">{result.dbi_diem}</span>
            <span className="text-slate-400 font-medium text-sm">/ 100 điểm</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Mức độ: <strong>{result.dbi_muc}</strong>. Đánh giá toàn diện 7 trụ cột chiến lược, khách hàng, an toàn thông tin, vận hành và dữ liệu theo định hướng Quyết định 2158/QĐ-BTTTT.
          </p>

          <div className="text-[11px] text-slate-400 border-t border-blue-100 pt-2 italic">
            * Kết quả tự đánh giá sơ bộ mô phỏng, không đại diện chứng nhận pháp lý chính thức.
          </div>
        </div>

        {/* LDMI Card */}
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 p-6 sm:p-7 rounded-2xl border border-indigo-200/90 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Năng lực Logistics Chuỗi cung ứng (LDMI)
            </span>
            <Badge variant="secondary" size="sm">{result.ldmi_muc}</Badge>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-indigo-700">{result.ldmi_diem}</span>
            <span className="text-slate-400 font-medium text-sm">/ 100 điểm</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Mức độ: <strong>{result.ldmi_muc}</strong>. Phản ánh năng lực số hóa chuyên sâu các hoạt động vận tải, kho bãi, chứng từ, đối soát và mức độ liên thông hệ thống.
          </p>

          <div className="text-[11px] text-slate-400 border-t border-indigo-100 pt-2 italic">
            * Nền tảng đề xuất các giải pháp nâng cấp trong phạm vi ≤ Mức hiện tại + 1.
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'overview', title: 'Tổng quan & Radar' },
          { id: 'gaps', title: '3 Điểm nghẽn cốt lõi' },
          { id: 'ai', title: 'Diễn giải AI Tự động' },
          { id: 'dbi', title: 'Chi tiết 7 Trụ cột DBI' },
          { id: 'ldmi', title: 'Chi tiết Nhóm LDMI' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'border-[#1769AA] text-[#1769AA]'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* TAB 1: Radar Chart & Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Radar Chart Component */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-sm text-slate-900">
                  Biểu đồ Radar Năng lực Logistics (LDMI)
                </h3>
                <span className="text-[11px] text-slate-400">Thang 0 - 100</span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={ldmiChartData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                    <Radar
                      name="Điểm năng lực"
                      dataKey="diem"
                      stroke="#1769AA"
                      fill="#1769AA"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pillar Bars Component */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-sm text-slate-900">
                  Điểm số 7 Trụ cột Chuyển đổi số (DBI)
                </h3>
                <span className="text-[11px] text-slate-400">Điểm bình quân</span>
              </div>

              <div className="space-y-3 pt-2">
                {result.dbi_tru_cot.map(p => (
                  <div key={p.ten} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">{p.ten}</span>
                      <strong className="text-slate-900">{p.diem} / 100</strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${p.diem >= 60 ? 'bg-emerald-600' : p.diem >= 40 ? 'bg-[#1769AA]' : 'bg-amber-500'}`}
                        style={{ width: `${p.diem}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Top 3 Bottlenecks */}
      {activeTab === 'gaps' && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Chẩn đoán 3 điểm nghẽn nghiêm trọng nhất:</span>
            </div>
            <p className="leading-relaxed">
              Các điểm nghẽn này được suy ra từ các câu hỏi có điểm số thấp nhất kết hợp với ma trận tri thức khoảng trống logistics (17 mã tham chiếu). Giải quyết các điểm nghẽn này sẽ mang lại tác động hoàn vốn nhanh nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.top_khoang_trong.map((gap, idx) => (
              <div
                key={gap.ma}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <Badge variant="danger" size="sm">{gap.ma}</Badge>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {gap.ten}
                  </h3>

                  <div className="text-xs text-slate-500 font-medium">{gap.nhom}</div>

                  <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="font-bold text-slate-700 block">Triệu chứng & Tác động:</span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{gap.trieu_chung}</p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 block">Nguyên nhân cốt lõi:</span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{gap.nguyen_nhan}</p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 block">Bước chuẩn bị tiếp theo:</span>
                      <p className="text-emerald-700 font-medium mt-0.5 leading-relaxed">{gap.buoc_tiep_theo}</p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 block">Chỉ số KPI nên theo dõi:</span>
                      <p className="text-slate-600 mt-0.5">{gap.chi_so_khuyen_nghi}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Link to={`/buyer/solutions?gap=${gap.ma}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Xem giải pháp giải quyết &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Natural Language AI Interpretation */}
      {activeTab === 'ai' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                Bản diễn giải AI Tự động từ dữ liệu đánh giá
              </h3>
            </div>
            <Badge variant="primary">Quy chuẩn 06/VNYTL</Badge>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">Tóm tắt hiện trạng doanh nghiệp:</strong>
              <p>{result.ai_dien_giai.tom_tat}</p>
            </div>

            <div>
              <strong className="text-slate-900 block mb-2 font-bold">Điểm mạnh & Nền tảng sẵn có:</strong>
              <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-600">
                {result.ai_dien_giai.diem_manh.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong className="text-slate-900 block mb-2 font-bold">Phân tích chi tiết từng điểm nghẽn:</strong>
              <div className="space-y-3">
                {result.ai_dien_giai.diem_nghen.map(gap => (
                  <div key={gap.ma} className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Mã: {gap.ma}</span>
                      <span className="text-slate-400 font-normal">Nguồn: {gap.nguon.join(', ')}</span>
                    </div>
                    <div><strong>Hiện trạng:</strong> {gap.hien_trang}</div>
                    <div><strong>Nguyên nhân có thể:</strong> {gap.nguyen_nhan_co_the}</div>
                    <div><strong>Tác động vận hành:</strong> {gap.tac_dong}</div>
                    <div><strong>Việc nên chuẩn bị trước:</strong> <span className="text-emerald-700 font-semibold">{gap.buoc_chuan_bi}</span></div>
                    <div><strong>KPI theo dõi:</strong> {gap.kpi.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
              <strong className="text-slate-700 block">Giới hạn của đánh giá:</strong>
              <p>{result.ai_dien_giai.gioi_han}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DBI Pillars Detail */}
      {activeTab === 'dbi' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 mb-2">Chi tiết 7 trụ cột DBI</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {result.dbi_tru_cot.map(p => (
              <div key={p.ten} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{p.ten}</span>
                  <span className="text-[#1769AA]">{p.diem} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-[#1769AA]" style={{ width: `${p.diem}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: LDMI Groups Detail */}
      {activeTab === 'ldmi' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 mb-2">Chi tiết 8 nhóm năng lực LDMI</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {result.ldmi_nhom.map(g => (
              <div key={g.ma} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{g.ma} - {g.ten}</span>
                  <span className="text-indigo-700">{g.diem} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-indigo-700" style={{ width: `${g.diem}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        <Link
          to="/buyer/solutions"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
        >
          <div className="space-y-1">
            <Lightbulb className="w-6 h-6 text-[#1769AA]" />
            <h4 className="font-bold text-sm text-slate-900">Xem giải pháp ghép nối</h4>
            <p className="text-xs text-slate-500">Khám phá các phần mềm có điểm tương thích cao nhất với điểm nghẽn của bạn.</p>
          </div>
          <span className="text-xs font-bold text-[#1769AA]">Khám phá ngay &rarr;</span>
        </Link>

        <Link
          to="/buyer/roi"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
        >
          <div className="space-y-1">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <h4 className="font-bold text-sm text-slate-900">Mô phỏng hiệu quả ROI</h4>
            <p className="text-xs text-slate-500">Tính toán dòng tiền hoàn vốn và tỷ lệ hoàn vốn đầu tư trước khi ký hợp đồng.</p>
          </div>
          <span className="text-xs font-bold text-emerald-700">Mô phỏng ngay &rarr;</span>
        </Link>

        <Link
          to="/buyer/reports"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
        >
          <div className="space-y-1">
            <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
            <h4 className="font-bold text-sm text-slate-900">Báo cáo chuyên sâu 700k</h4>
            <p className="text-xs text-slate-500">Nhận bản phân tích đối sánh chi tiết để trình ban lãnh đạo phê duyệt ngân sách.</p>
          </div>
          <span className="text-xs font-bold text-indigo-700">Đặt mua báo cáo &rarr;</span>
        </Link>
      </div>
    </div>
  );
};
