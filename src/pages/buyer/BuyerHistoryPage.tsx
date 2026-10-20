import React from 'react';
import { Link } from 'react-router-dom';
import { History, Award, TrendingUp, Calendar, ArrowRight, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';

export const BuyerHistoryPage: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const assessments = dbService.getAssessments().filter(a => a.userId === currentUser?.id);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <Badge variant="primary">Lịch sử đánh giá & Tiến bộ</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Nhật ký các lần Đánh giá Mức độ Trưởng thành số
          </h1>
          <p className="text-xs text-slate-500">
            Theo dõi sự thay đổi của điểm DBI và LDMI qua các quý vận hành.
          </p>
        </div>

        <Link to="/buyer/assessment">
          <Button variant="primary" size="sm">
            Thực hiện đánh giá mới
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {assessments.map(asm => (
          <div
            key={asm.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">Lần đánh giá thứ {asm.lan_thu}</Badge>
                <span className="text-xs text-slate-400 font-mono">#{asm.id}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(asm.ngay_tao).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-1">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Điểm DBI:</span>
                  <div className="text-xl font-black text-[#1769AA]">
                    {asm.dbi_diem}/100 <span className="text-xs font-semibold text-slate-600">({asm.dbi_muc})</span>
                  </div>
                </div>

                <div className="border-l border-slate-200 pl-6">
                  <span className="text-xs text-slate-400 block font-medium">Điểm LDMI Logistics:</span>
                  <div className="text-xl font-black text-indigo-700">
                    {asm.ldmi_diem}/100 <span className="text-xs font-semibold text-slate-600">({asm.ldmi_muc})</span>
                  </div>
                </div>

                <div className="border-l border-slate-200 pl-6 hidden sm:block">
                  <span className="text-xs text-slate-400 block font-medium">Điểm nghẽn nhận diện:</span>
                  <div className="text-sm font-bold text-slate-800">
                    {asm.top_khoang_trong.map(k => k.ma).join(', ')}
                  </div>
                </div>
              </div>
            </div>

            <Link to="/buyer/results">
              <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                Xem chi tiết báo cáo &rarr;
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
