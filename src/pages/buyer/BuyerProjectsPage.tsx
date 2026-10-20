import React, { useState } from 'react';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Calendar,
  TrendingUp,
  BarChart3,
  Plus,
  Save,
  Check,
  Building2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { ProjectTracking } from '../../types';
import { useToast } from '../../components/ui/Toast';

export const BuyerProjectsPage: React.FC = () => {
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const [projects, setProjects] = useState<ProjectTracking[]>(() => {
    return dbService.getProjects().filter(p => p.buyerId === currentUser?.id);
  });
  const [selectedProject, setSelectedProject] = useState<ProjectTracking | null>(projects[0] || null);

  const handleToggleMilestone = (milestoneId: string) => {
    if (!selectedProject) return;

    const updatedMilestones = selectedProject.cac_moc.map(m => {
      if (m.id === milestoneId) {
        return {
          ...m,
          da_hoan_thanh: !m.da_hoan_thanh,
          ngay_hoan_thanh: !m.da_hoan_thanh ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return m;
    });

    const completedCount = updatedMilestones.filter(m => m.da_hoan_thanh).length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);

    const updatedProj = {
      ...selectedProject,
      cac_moc: updatedMilestones,
      tien_do_phan_tram: progress
    };

    dbService.updateProject(selectedProject.id, updatedProj);
    setSelectedProject(updatedProj);
    setProjects(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));

    toast.success("Đã cập nhật tiến độ mốc", `Tiến độ dự án hiện tại: ${progress}%`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Badge variant="primary">Theo dõi Triển khai & Chỉ số (VNYTL 4.1.4)</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Quản trị Tiến độ Dự án & Đo lường KPI Trước/Sau
          </h1>
          <p className="text-xs text-slate-500">
            Theo dõi từng mốc cài đặt, đào tạo, vận hành thử nghiệm và đối chứng sự cải thiện của các chỉ số logistics.
          </p>
        </div>
      </div>

      {selectedProject ? (
        <div className="space-y-6">
          {/* Project Summary Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <Badge variant="success" size="sm">Gói theo dõi 3 tháng (3 triệu)</Badge>
                <h2 className="text-lg font-bold text-slate-900">{selectedProject.ten_du_an}</h2>
                <p className="text-xs text-slate-500">
                  Giải pháp áp dụng: <strong className="text-[#1769AA]">{selectedProject.solutionName}</strong> • Bắt đầu: {selectedProject.ngay_bat_dau}
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6">
                <span className="text-xs text-slate-400 font-medium">Tiến độ tổng thể:</span>
                <div className="text-3xl font-black text-[#1769AA]">{selectedProject.tien_do_phan_tram}%</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${selectedProject.tien_do_phan_tram}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Milestones Timeline */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1769AA]" />
                <span>Các mốc triển khai (Bấm để đánh dấu hoàn thành)</span>
              </h3>

              <div className="space-y-3">
                {selectedProject.cac_moc.map((m, idx) => (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMilestone(m.id)}
                    className={`p-3.5 rounded-xl border text-xs transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                      m.da_hoan_thanh
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          m.da_hoan_thanh
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        {m.da_hoan_thanh ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <div>
                        <div className={`font-bold ${m.da_hoan_thanh ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                          {m.ten_moc}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Dự kiến: {m.ngay_du_kien} {m.ngay_hoan_thanh && `• Xong: ${m.ngay_hoan_thanh}`}
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-500">
                      {m.da_hoan_thanh ? <span className="text-emerald-700">✓ Hoàn tất</span> : 'Đang thực hiện'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Before/After KPIs Tracking */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Chỉ số KPI đối chứng Trước / Sau</span>
              </h3>

              <div className="space-y-4 text-xs">
                {selectedProject.chi_so_kpi.map(kpi => (
                  <div key={kpi.ma} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{kpi.ten}</span>
                      <Badge variant="secondary" size="sm">{kpi.ma}</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-200/70">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Trước áp dụng:</span>
                        <strong className="text-rose-600 text-sm">{kpi.truoc_trien_khai} {kpi.don_vi}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Hiện tại:</span>
                        <strong className="text-emerald-700 text-sm">{kpi.hien_tai} {kpi.don_vi}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Mục tiêu:</span>
                        <strong className="text-blue-700 text-sm">{kpi.muc_tieu} {kpi.don_vi}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-[#1769AA]">Ý nghĩa đo lường KPI:</div>
                <p>
                  Theo chuẩn ASCM SCOR-DS, việc số hóa chỉ có giá trị khi cải thiện được các chỉ số vận hành cốt lõi như tỷ lệ sai chứng từ, thời gian đối soát cước và tỷ lệ xe chạy rỗng.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <p className="text-xs text-slate-500">Chưa có dự án theo dõi nào được kích hoạt.</p>
        </div>
      )}
    </div>
  );
};
