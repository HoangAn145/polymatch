import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  Award,
  AlertTriangle,
  Lightbulb,
  Send,
  FolderGit2,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Sparkles,
  ExternalLink,
  Users
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';

export const BuyerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const enterprise = dbService.getEnterprises().find(e => e.userId === currentUser?.id) || dbService.getEnterprises()[0];
  const assessments = dbService.getAssessments().filter(a => a.userId === currentUser?.id);
  const latestAssessment = assessments[0] || dbService.getAssessments()[0];
  const connections = dbService.getConnections().filter(c => c.buyerId === currentUser?.id);
  const projects = dbService.getProjects().filter(p => p.buyerId === currentUser?.id);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1769AA] to-[#104D80] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/30 text-blue-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-400/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>DOANH NGHIỆP LOGISTICS (BUYER)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Xin chào, {currentUser?.fullName || enterprise.nguoi_lien_he}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            {enterprise.ten} • Ngành chính: <strong>{enterprise.nhanh}</strong> • Quy mô: <strong className="capitalize">{enterprise.quy_mo} ({enterprise.so_lao_dong_bhxh} lao động)</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link to="/buyer/assessment">
            <Button variant="secondary" size="md" className="bg-white text-[#1769AA] font-bold shadow-sm">
              Làm lại bài đánh giá
            </Button>
          </Link>
          <Link to="/buyer/solutions">
            <Button variant="outline" size="md" className="border-white/40 text-white hover:bg-white/10 font-medium">
              Xem giải pháp đề xuất
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Mức DBI (QĐ 2158)"
          value={`${latestAssessment?.dbi_diem || 42.5}/100`}
          change={latestAssessment?.dbi_muc || "Hình thành"}
          changeType="positive"
          description="Chỉ số chuyển đổi số doanh nghiệp chung"
          icon={<Award className="w-5 h-5 text-[#1769AA]" />}
          actionText="Xem phân tích 7 trụ cột"
          onAction={() => navigate('/buyer/results')}
        />

        <StatCard
          title="Mức LDMI Logistics"
          value={`${latestAssessment?.ldmi_diem || 38.0}/100`}
          change={latestAssessment?.ldmi_muc || "Số hóa"}
          changeType="neutral"
          description="Năng lực vận hành số logistics đặc thù"
          icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
          actionText="Xem chi tiết 8 nhóm năng lực"
          onAction={() => navigate('/buyer/results')}
        />

        <StatCard
          title="Điểm nghẽn cần tháo gỡ"
          value={latestAssessment?.top_khoang_trong.length || 3}
          change="3 điểm ưu tiên"
          changeType="negative"
          description="Điều phối xe thủ công, ePOD & Chạy rỗng"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          actionText="Xem chẩn đoán chi tiết"
          onAction={() => navigate('/buyer/gaps')}
        />

        <StatCard
          title="Yêu cầu kết nối & Báo giá"
          value={connections.length}
          change={connections.some(c => c.trang_thai === 'da_bao_gia') ? "Có báo giá mới" : "Đang trao đổi"}
          changeType={connections.some(c => c.trang_thai === 'da_bao_gia') ? "positive" : "neutral"}
          description="Kết nối với các nhà cung cấp giải pháp"
          icon={<Send className="w-5 h-5 text-emerald-600" />}
          actionText="Xem danh sách yêu cầu"
          onAction={() => navigate('/buyer/connections')}
        />
      </div>

      {/* Main Grid: Bottlenecks Summary & Implementation Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Top 3 Bottlenecks alert */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h3 className="font-extrabold text-base text-slate-900">
                3 Điểm nghẽn logistics nghiêm trọng nhất
              </h3>
            </div>
            <Link to="/buyer/gaps" className="text-xs font-semibold text-[#1769AA] hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="space-y-3">
            {latestAssessment?.top_khoang_trong.map((gap, idx) => (
              <div
                key={gap.ma}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{gap.ten}</h4>
                  </div>
                  <Badge variant="danger" size="sm">{gap.ma}</Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Hiện trạng:</strong> {gap.trieu_chung}
                </p>

                <div className="pt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-200/60">
                  <span><strong>Bước tiếp theo:</strong> {gap.buoc_tiep_theo}</span>
                  <Link
                    to={`/buyer/solutions?gap=${gap.ma}`}
                    className="font-semibold text-[#1769AA] hover:underline shrink-0"
                  >
                    Xem giải pháp &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <Link to="/buyer/solutions">
              <Button variant="primary" size="sm" className="w-full sm:w-auto">
                Khám phá các giải pháp khắc phục điểm nghẽn
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: Quick actions & Implementation Progress */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active project card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#1769AA]" />
                <span>Dự án triển khai đang theo dõi</span>
              </h3>
              <Badge variant="primary" size="sm">Đang thực hiện</Badge>
            </div>

            {projects.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800 leading-snug">
                  {projects[0].ten_du_an}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Tiến độ hoàn thành:</span>
                    <strong className="text-[#1769AA]">{projects[0].tien_do_phan_tram}%</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${projects[0].tien_do_phan_tram}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Tỷ lệ chứng từ sai:</span>
                    <strong className="text-emerald-700 text-sm">
                      {projects[0].chi_so_kpi[0]?.truoc_trien_khai}% &rarr; {projects[0].chi_so_kpi[0]?.hien_tai}%
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Thời gian đối soát:</span>
                    <strong className="text-blue-700 text-sm">
                      {projects[0].chi_so_kpi[1]?.truoc_trien_khai} ngày &rarr; {projects[0].chi_so_kpi[1]?.hien_tai} ngày
                    </strong>
                  </div>
                </div>

                <div className="pt-1">
                  <Link to="/buyer/projects">
                    <Button variant="outline" size="sm" className="w-full">
                      Xem chi tiết dự án & mốc KPI
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Chưa kích hoạt dự án theo dõi nào.</p>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 space-y-3">
            <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">
              Lối tắt dịch vụ
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/buyer/roi"
                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-colors flex items-center gap-2 font-medium text-slate-800"
              >
                <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mô phỏng ROI</span>
              </Link>
              <Link
                to="/buyer/reports"
                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-colors flex items-center gap-2 font-medium text-slate-800"
              >
                <Sparkles className="w-4 h-4 text-[#1769AA] shrink-0" />
                <span>Báo cáo 700k</span>
              </Link>
              <Link
                to="/buyer/consulting"
                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-colors flex items-center gap-2 font-medium text-slate-800"
              >
                <Users className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Tư vấn Chuyên gia</span>
              </Link>
              <Link
                to="/buyer/compare"
                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-colors flex items-center gap-2 font-medium text-slate-800"
              >
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>So sánh 3 giải pháp</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
