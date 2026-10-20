import React from 'react';
import { BarChart3, TrendingUp, Users, Send, Eye, CheckCircle2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';

export const SellerAnalyticsPage: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const seller = dbService.getSellers().find(s => s.userId === currentUser?.id) || dbService.getSellers()[0];
  const solutions = dbService.getSolutions().filter(s => s.nha_cung_cap_id === seller?.id);
  const requests = dbService.getConnections().filter(c => c.sellerId === seller?.id || c.sellerId === currentUser?.id);
  const quotations = dbService.getQuotations().filter(q => q.sellerId === seller?.id || q.sellerId === currentUser?.id);
  const contracts = dbService.getContracts().filter(ctr => ctr.sellerId === seller?.id || ctr.sellerId === currentUser?.id);

  const monthlyData = [
    { month: 'T5/26', views: 85, leads: 2, quotes: 1, deals: 0 },
    { month: 'T6/26', views: 120, leads: 4, quotes: 3, deals: 1 },
    { month: 'T7/26', views: 195, leads: 7, quotes: 5, deals: 2 },
    { month: 'T8/26', views: 240, leads: 9, quotes: 6, deals: 2 },
    { month: 'T9/26', views: 310, leads: 12, quotes: 8, deals: 3 },
    { month: 'T10/26', views: 420, leads: requests.length || 15, quotes: quotations.length || 10, deals: contracts.length || 4 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 space-y-1">
        <Badge variant="primary">Hiệu quả phễu tiếp cận (Leads Funnel)</Badge>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Thống kê Hiệu quả Kết nối & Tỷ lệ Chuyển đổi
        </h1>
        <p className="text-xs text-slate-500">
          Theo dõi số lượt xem giải pháp trên catalog, số yêu cầu báo giá nhận được và hợp đồng ký kết.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Lượt xem giải pháp"
          value="1,370"
          change="+35% tháng này"
          changeType="positive"
          icon={<Eye className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Yêu cầu kết nối (Leads)"
          value={requests.length || 15}
          change="+4 leads mới"
          changeType="positive"
          icon={<Send className="w-5 h-5 text-indigo-600" />}
        />
        <StatCard
          title="Báo giá đã phát hành"
          value={quotations.length || 10}
          change="Tỷ lệ phản hồi 68%"
          changeType="neutral"
          icon={<BarChart3 className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Hợp đồng thương mại"
          value={contracts.length || 4}
          change="Tỷ lệ chốt 26%"
          changeType="positive"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* Monthly Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-900">
            Biểu đồ diễn biến Lượt xem vs Yêu cầu kết nối (6 tháng gần nhất)
          </h3>
          <Badge variant="secondary" size="sm">Dữ liệu minh họa Demo</Badge>
        </div>

        <div className="h-72 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="views" fill="#1769AA" name="Lượt xem" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leads" fill="#10B981" name="Yêu cầu kết nối" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
