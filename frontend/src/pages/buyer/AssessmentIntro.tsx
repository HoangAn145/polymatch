import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  HelpCircle, 
  Save, 
  GitFork, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  Building2,
  Building,
  FileSpreadsheet,
  Info,
  Award,
  Layers
} from 'lucide-react';
import { DBI_PILLARS } from '../../data/mockData';
import { 
  LARGE_PILLAR_MAX, 
  SME_PILLAR_MAX 
} from '../../data/assessmentData';

export const AssessmentIntro: React.FC = () => {
  const { 
    navigate, 
    assessmentAnswers, 
    clearAssessmentDraft, 
    currentUser,
    assessmentType,
    setAssessmentType 
  } = useApp();

  const answeredCount = Object.keys(assessmentAnswers).length;
  const hasDraft = answeredCount > 0;
  const isLarge = assessmentType === 'LARGE';

  const pillarMaxMap = isLarge ? LARGE_PILLAR_MAX : SME_PILLAR_MAX;
  const scaleMax = isLarge ? 695 : 100;
  const questionCount = isLarge ? 24 : 25;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Main card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Khảo sát Đánh giá Mức độ Chuyển đổi số Quốc gia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Khảo sát Mức độ Chuyển đổi số Doanh nghiệp
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Doanh nghiệp: <strong>{currentUser.company.companyName}</strong> (Ngành: {currentUser.company.industry})
          </p>
        </div>

        {/* Enterprise Size Selection Tabs */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Bước 1: Chọn Nhóm Quy mô Doanh nghiệp
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tab 1: SME */}
            <div 
              onClick={() => setAssessmentType('SME')}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                assessmentType === 'SME'
                  ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className={`w-5 h-5 ${assessmentType === 'SME' ? 'text-teal-700' : 'text-slate-500'}`} />
                    <h3 className="text-sm font-bold text-slate-900">
                      Doanh nghiệp Nhỏ & Vừa (SME)
                    </h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                    assessmentType === 'SME' ? 'bg-teal-600 text-white border-teal-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    Phụ lục I (Thang 100 điểm)
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dành cho các doanh nghiệp vừa, nhỏ và siêu nhỏ. Đo lường mức độ vận dụng nền tảng số, phần mềm kế toán, bán hàng, CRM và hiệu quả liên thông dữ liệu.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/70 mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500">25 câu hỏi trắc nghiệm</span>
                <span className="font-bold text-teal-800">Thang điểm: 0 - 100</span>
              </div>
            </div>

            {/* Tab 2: Large Enterprise */}
            <div 
              onClick={() => setAssessmentType('LARGE')}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                assessmentType === 'LARGE'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className={`w-5 h-5 ${assessmentType === 'LARGE' ? 'text-indigo-700' : 'text-slate-500'}`} />
                    <h3 className="text-sm font-bold text-slate-900">
                      Doanh nghiệp Lớn & Tập đoàn (DNL)
                    </h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                    assessmentType === 'LARGE' ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    Phụ lục II (Thang 695 điểm)
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dành cho các tổng công ty, tập đoàn và doanh nghiệp lớn. Đánh giá toàn diện 6 trụ cột chuyên sâu: Kiến trúc doanh nghiệp, Cloud-native, Data Lakehouse, SOC 24/7 và hệ sinh thái số.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/70 mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500">24 câu hỏi chuyên sâu 6 trụ cột</span>
                <span className="font-bold text-indigo-800">Thang điểm: 0 - 695</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Thời lượng ước tính: 10 - 15 phút</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bao gồm {questionCount} câu hỏi trắc nghiệm được phân bổ theo 6 trụ cột cốt lõi.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tự động lưu bản nháp liên tục</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hệ thống lưu trữ từng câu trả lời theo thời gian thực, có thể quay lại làm tiếp bất kỳ lúc nào.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Chuẩn hóa 6 Cấp độ Chuyển đổi số</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Xếp loại từ Mức 0 (Chưa CĐS) đến Mức 5 (Dẫn dắt) theo đúng công thức phân ngưỡng điểm pháp định.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Báo cáo Radar & Đề xuất AI tức thời</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhận kết quả phân tích 6 trụ cột, so sánh bình quân ngành và danh sách giải pháp công nghệ phù hợp.
              </p>
            </div>
          </div>
        </div>

        {/* Pillar List Overview according to selected size */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Cấu trúc Điểm số 6 Trụ cột theo {isLarge ? 'Phụ lục II (Doanh nghiệp Lớn)' : 'Phụ lục I (SME)'}
            </h2>
            <span className="text-xs font-extrabold text-teal-700">
              Tổng điểm tối đa: {scaleMax} Điểm
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {DBI_PILLARS.map((p, idx) => (
              <div key={p.id} className="p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs hover:border-teal-300 transition-colors">
                <span className="font-bold text-slate-900 block mb-1">
                  {idx + 1}. {p.shortName}
                </span>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Điểm tối đa:</span>
                  <strong className="text-teal-700 font-extrabold">{pillarMaxMap[p.id]} đ</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Draft Notification & CTAs */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {hasDraft ? (
              <div className="text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 font-medium">
                ⚡ Đang có bản nháp: <strong>Đã trả lời {answeredCount}/{questionCount} câu</strong> (Nhóm: {isLarge ? 'Doanh nghiệp Lớn' : 'SME'})
              </div>
            ) : (
              <div className="text-xs text-slate-500">
                Sẵn sàng khảo sát theo chuẩn <strong>DBI</strong> cho doanh nghiệp của bạn.
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasDraft && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Bạn có chắc muốn xóa bản nháp và làm lại từ đầu?')) {
                    clearAssessmentDraft();
                  }
                }}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 px-3 py-2 cursor-pointer"
              >
                Xóa nháp làm lại
              </button>
            )}
            <button
              onClick={() => navigate('/assessment/new')}
              className={`px-8 py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                isLarge ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              <span>{hasDraft ? 'Làm tiếp bài khảo sát' : `Bắt đầu Khảo sát (${isLarge ? 'DNL - 695đ' : 'SME - 100đ'})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
