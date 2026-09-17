import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Send, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  Building, 
  Scale,
  Info,
  CheckSquare,
  Square,
  Tag,
  BookOpen
} from 'lucide-react';
import { DBI_PILLARS } from '../../data/mockData';
import { 
  LARGE_ASSESSMENT_QUESTIONS, 
  LARGE_PILLAR_MAX, 
  SME_PILLAR_MAX, 
  LEGAL_FRAMEWORK,
  ENTERPRISE_DBI_QUESTIONS,
  SME_ASSESSMENT_QUESTIONS_1567,
  SME_CORE_QUESTIONS,
  SME_INDUSTRIES_SOLUTIONS
} from '../../data/assessmentData';
import { AssessmentQuestion } from '../../types';

export const AssessmentWizard: React.FC = () => {
  const { 
    assessmentAnswers, 
    saveAnswer, 
    submitAssessment, 
    navigate, 
    assessmentType, 
    setAssessmentType, 
    clearAssessmentDraft,
    currentUser
  } = useApp();

  const isLarge = assessmentType === 'LARGE';
  const pillarMaxMap = isLarge ? LARGE_PILLAR_MAX : SME_PILLAR_MAX;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Vừa xong');

  // Selected industry for SME Question 18 solutions checklist
  const [selectedIndustry, setSelectedIndustry] = useState<string>(
    currentUser?.company?.industry && SME_INDUSTRIES_SOLUTIONS[currentUser.company.industry]
      ? currentUser.company.industry
      : 'Bán lẻ'
  );
  
  // Custom checklist state for SME Q18
  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([
    "Máy POS", "Thanh toán không dùng tiền mặt", "Quản lý tồn kho", "Phần mềm kế toán kết nối POS"
  ]);

  // Active question list according to enterprise type
  const activeQuestions: AssessmentQuestion[] = useMemo(() => {
    return isLarge ? LARGE_ASSESSMENT_QUESTIONS : SME_ASSESSMENT_QUESTIONS_1567;
  }, [isLarge]);

  const currentQuestion = activeQuestions[currentIndex] || activeQuestions[0];
  const totalCount = activeQuestions.length;
  const currentPillar = DBI_PILLARS.find(p => p.id === currentQuestion.pillarId) || DBI_PILLARS[0];

  const selectedOptionIndex = assessmentAnswers[currentQuestion.id];

  // Large enterprise detailed metadata
  const currentEnterpriseMeta = useMemo(() => {
    if (!isLarge) return null;
    return ENTERPRISE_DBI_QUESTIONS.find(q => q.code === currentQuestion.id);
  }, [isLarge, currentQuestion.id]);

  // SME detailed metadata
  const currentSmeMeta = useMemo(() => {
    if (isLarge) return null;
    return SME_CORE_QUESTIONS.find(q => `SME_Q${q.stt < 10 ? '0' + q.stt : q.stt}` === currentQuestion.id);
  }, [isLarge, currentQuestion.id]);

  const handleSelectOption = (idx: number) => {
    saveAnswer(currentQuestion.id, idx);
    setLastSavedTime(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const handleToggleSolution = (solutionName: string) => {
    let nextList: string[];
    if (selectedSolutions.includes(solutionName)) {
      nextList = selectedSolutions.filter(s => s !== solutionName);
    } else {
      nextList = [...selectedSolutions, solutionName];
    }
    setSelectedSolutions(nextList);

    // Map ratio to 5 levels for question 18
    const industryData = SME_INDUSTRIES_SOLUTIONS[selectedIndustry] || SME_INDUSTRIES_SOLUTIONS['Bán lẻ'];
    const maxRaw = industryData.maxScoreRaw || 20;
    const ratio = Math.min(1, nextList.length / maxRaw);
    let levelIdx = 0;
    if (ratio >= 0.8) levelIdx = 4;
    else if (ratio >= 0.6) levelIdx = 3;
    else if (ratio >= 0.4) levelIdx = 2;
    else if (ratio >= 0.2) levelIdx = 1;
    else levelIdx = 0;

    saveAnswer('SME_Q18', levelIdx);
  };

  const handleNext = () => {
    if (currentIndex < totalCount - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Switch size
  const handleSwitchType = (newType: 'SME' | 'LARGE') => {
    if (newType !== assessmentType) {
      if (confirm(`Bạn muốn chuyển sang đánh giá ${newType === 'LARGE' ? 'Doanh nghiệp Lớn (25 nhóm tiêu chí - TOPSIS, thang 695đ)' : 'SME (18 câu hỏi + 25 ngành, thang 100đ)'}?`)) {
        clearAssessmentDraft();
        setAssessmentType(newType);
        setCurrentIndex(0);
      }
    }
  };

  // Demo auto-fill
  const handleAutoFillDemo = (targetLevel: 2 | 3 | 4) => {
    const demoAnswers: Record<string, number> = {};

    if (isLarge) {
      // 25 questions for large enterprise
      const pattern = targetLevel === 2
        ? [1, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2]
        : targetLevel === 3
        ? [2, 3, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3]
        : [3, 4, 4, 3, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4, 3, 4, 4];
      
      LARGE_ASSESSMENT_QUESTIONS.forEach((q, i) => {
        demoAnswers[q.id] = pattern[i % pattern.length];
      });
    } else {
      // 18 questions for SME
      const coreScore = targetLevel === 2 ? 1 : targetLevel === 3 ? 2 : 3;
      SME_ASSESSMENT_QUESTIONS_1567.forEach((q, i) => {
        demoAnswers[q.id] = (i >= 2 && i <= 8) ? coreScore : 1;
      });
      demoAnswers['SME_Q18'] = targetLevel === 2 ? 1 : targetLevel === 3 ? 2 : 3;
    }

    Object.entries(demoAnswers).forEach(([qid, optIdx]) => {
      saveAnswer(qid, optIdx);
    });
    setLastSavedTime(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(assessmentAnswers).length;
    const minThreshold = isLarge ? 20 : 12;
    if (answeredCount < minThreshold) {
      if (!confirm(`Bạn mới trả lời ${answeredCount}/${totalCount} câu hỏi. Bạn có chắc chắn muốn nộp bài sớm? Các câu chưa trả lời sẽ tính mức khởi tạo mặc định.`)) {
        return;
      }
    }

    const res = submitAssessment();
    navigate(`/assessment/${res.id}/result`);
  };

  const progressPercent = Math.round(((currentIndex + 1) / totalCount) * 100);
  const totalAnswered = Object.keys(assessmentAnswers).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Enterprise Size & Legal Notice */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800 flex items-center gap-2">
              <span>{LEGAL_FRAMEWORK.title}</span>
              <span className="text-teal-700 font-extrabold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {LEGAL_FRAMEWORK.decisionNumber}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Đang khảo sát: <strong>{isLarge ? 'Phụ lục II - Doanh nghiệp Lớn (25 nhóm tiêu chí, Thang 695đ & TOPSIS)' : 'Phụ lục I - SME (18 câu hỏi + 25 ngành, Thang 100đ)'}</strong>
            </div>
          </div>
        </div>

        {/* Switch Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => handleSwitchType('SME')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              !isLarge ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>SME (18 câu - 100đ)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchType('LARGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isLarge ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>DN Lớn (25 tiêu chí - 695đ)</span>
          </button>
        </div>
      </div>

      {/* Header & Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center ${
              isLarge ? 'bg-indigo-100 text-indigo-800' : 'bg-teal-100 text-teal-800'
            }`}>
              {currentIndex + 1}
            </span>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Câu hỏi {currentIndex + 1} / {totalCount} {isLarge ? `(${currentEnterpriseMeta?.code || ''})` : ''}
              </div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>Trụ cột: <strong>{currentPillar.name}</strong></span>
                <span className="text-xs text-slate-500 font-semibold">
                  (Tối đa {pillarMaxMap[currentPillar.id]}đ)
                </span>
                {!isLarge && currentSmeMeta && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    currentSmeMeta.isScored ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {currentSmeMeta.isScored ? 'Có tính điểm (0-4đ)' : 'Phân loại / Khảo sát'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md">
              <Save className="w-3.5 h-3.5" />
              <span>Lưu tự động: {lastSavedTime}</span>
            </div>

            <button
              onClick={() => setShowQuestionPalette(!showQuestionPalette)}
              className="text-slate-600 hover:text-teal-700 font-bold underline cursor-pointer"
            >
              Danh sách ({totalAnswered}/{totalCount})
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${isLarge ? 'bg-indigo-600' : 'bg-teal-600'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>Tiến độ hoàn thành: {progressPercent}%</span>
            <span>Đã trả lời: {totalAnswered} / {totalCount} câu</span>
          </div>
        </div>

        {/* Demo Fast-Fill Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-semibold text-slate-700">Điền nhanh kết quả mẫu ({isLarge ? '25 câu' : '18 câu'}):</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAutoFillDemo(2)}
              className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] border border-teal-200 transition-colors cursor-pointer"
            >
              ⚡ Cấp 2: Bắt đầu
            </button>
            <button
              type="button"
              onClick={() => handleAutoFillDemo(3)}
              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[11px] border border-blue-200 transition-colors cursor-pointer"
            >
              ⚡ Cấp 3: Hình thành
            </button>
            <button
              type="button"
              onClick={() => handleAutoFillDemo(4)}
              className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-[11px] border border-purple-200 transition-colors cursor-pointer"
            >
              ⚡ Cấp 4: Nâng cao
            </button>
            {totalAnswered >= 10 && (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-2xs transition-colors cursor-pointer"
              >
                Nộp bài & Xem Kết quả →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question Palette Drawer */}
      {showQuestionPalette && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 animate-in fade-in">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex justify-between items-center">
            <span>Danh sách câu hỏi {isLarge ? 'Phụ lục II (25 tiêu chí)' : 'Phụ lục I (18 câu)'}</span>
            <span className="text-slate-400 font-normal">Màu sắc thể hiện trạng thái trả lời</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeQuestions.map((q, idx) => {
              const isAnswered = assessmentAnswers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowQuestionPalette(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    isCurrent 
                      ? isLarge ? 'bg-indigo-700 text-white ring-2 ring-indigo-400' : 'bg-teal-700 text-white ring-2 ring-teal-400'
                      : isAnswered 
                        ? isLarge ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-teal-100 text-teal-800 border border-teal-200' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isLarge ? (ENTERPRISE_DBI_QUESTIONS[idx]?.code || idx + 1) : `C${idx + 1}`}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded border ${
              isLarge ? 'text-indigo-700 bg-indigo-50 border-indigo-200' : 'text-teal-700 bg-teal-50 border-teal-200'
            }`}>
              {currentPillar.shortName} • Tối đa {pillarMaxMap[currentPillar.id]} điểm
            </span>

            {isLarge && currentEnterpriseMeta && (
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
                Nhóm {currentEnterpriseMeta.criteriaGroup}
              </span>
            )}

            {!isLarge && currentSmeMeta && (
              <span className="text-xs text-slate-500 font-medium">
                {currentSmeMeta.scoringMethod}
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
            {currentQuestion.title}
          </h2>

          {/* Large Enterprise Merged Sub-Criteria Context */}
          {isLarge && currentEnterpriseMeta && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Gộp từ các tiêu chí con:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentEnterpriseMeta.mergedSubCriteria.map((sub, sIdx) => (
                  <span key={sIdx} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 text-[11px]">
                    {sub}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                Lý do gộp: {currentEnterpriseMeta.mergeReason}
              </div>
            </div>
          )}
        </div>

        {/* QUESTION 18 SPECIAL CHECKLIST FOR SME */}
        {!isLarge && currentQuestion.id === 'SME_Q18' ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-teal-900">
                  Chọn ngành để kiểm tra danh mục giải pháp số thực tế:
                </span>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="bg-white border border-teal-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
                >
                  {Object.keys(SME_INDUSTRIES_SOLUTIONS).map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-teal-700">
                Tích chọn những giải pháp/công cụ số doanh nghiệp Anh/Chị đang sử dụng trong thực tế. Điểm giải pháp ngành chiếm <strong>60%</strong> tổng điểm DBI SME.
              </p>
            </div>

            {/* Solutions Checklist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(SME_INDUSTRIES_SOLUTIONS[selectedIndustry]?.solutions || SME_INDUSTRIES_SOLUTIONS['Bán lẻ'].solutions).map((sol, idx) => {
                const isChecked = selectedSolutions.includes(sol);
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleSolution(sol)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      isChecked
                        ? 'bg-teal-50 border-teal-500 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-teal-700 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                    <span className={`text-xs font-semibold ${isChecked ? 'text-teal-900 font-bold' : 'text-slate-700'}`}>
                      {sol}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Checklist summary bar */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                Đã chọn: <strong>{selectedSolutions.length}</strong> giải pháp
              </span>
              <span className="text-teal-700 font-bold">
                Mức ước tính: Mức {(selectedOptionIndex ?? 2) + 1} / 5
              </span>
            </div>
          </div>
        ) : (
          /* Standard 5 Options List */
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = selectedOptionIndex === optIdx;
              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? isLarge 
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs' 
                        : 'border-teal-600 bg-teal-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected 
                      ? isLarge ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-teal-600 bg-teal-600 text-white' 
                      : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {option.description || `Mức ${option.score} / 5`}
                      </span>
                      {isSelected && (
                        <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded ${
                          isLarge ? 'text-indigo-700 bg-indigo-100' : 'text-teal-700 bg-teal-100'
                        }`}>
                          Đã chọn
                        </span>
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                      isSelected ? 'text-slate-900 font-bold' : 'text-slate-700'
                    }`}>
                      {option.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Large Enterprise Follow-Up Questions (When Level 3 is selected) */}
        {isLarge && selectedOptionIndex === 2 && currentEnterpriseMeta?.followUpQuestions && (
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-900">
              <Info className="w-4 h-4 text-indigo-700" />
              <span>Câu hỏi phụ làm rõ (Khi chọn Mức 3):</span>
            </div>
            {currentEnterpriseMeta.followUpQuestions.map((fu, fIdx) => (
              <div key={fIdx} className="bg-white p-3 rounded-lg border border-indigo-100 space-y-2 text-xs">
                <div className="font-bold text-slate-800">
                  [{fu.code}] {fu.question}
                </div>
                <div className="flex flex-wrap gap-2">
                  {fu.options.map((optText, oIdx) => {
                    const fuKey = `${currentQuestion.id}_fu_${fu.code}`;
                    const isFuSelected = assessmentAnswers[fuKey] === oIdx;
                    return (
                      <button
                        type="button"
                        key={oIdx}
                        onClick={() => saveAnswer(fuKey, oIdx)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isFuSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {optText}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation CTAs */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 ${
              currentIndex === 0 ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400' : 'hover:bg-slate-100 text-slate-700 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Câu trước</span>
          </button>

          <div className="flex items-center gap-3">
            {currentIndex < totalCount - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLarge ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                <span>Câu tiếp theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Hoàn tất & Xem Báo cáo ({isLarge ? 'Thang 695đ' : 'Thang 100đ'})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
