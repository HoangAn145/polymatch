import React from 'react';
import {
  BadgePercent,
  CreditCard,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { dbService } from '../../services/mockDatabase';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';

export const AdminTransactionsPage: React.FC = () => {
  const contracts = dbService.getContracts();
  const sellers = dbService.getSellers();
  const consultings = dbService.getConsultings();
  const reportOrders = dbService.getReportOrders();

  const commissionTotal = contracts.reduce((sum, c) => sum + c.hoa_hong.so_tien, 0);
  const subscriptionTotal = sellers.filter(s => s.goi_tham_gia.trang_thai_phi === 'da_thanh_toan').length * 6000000;
  const consultingTotal = consultings.reduce((sum, c) => sum + c.gia_goi, 0);
  const reportsTotal = reportOrders.reduce((sum, r) => sum + r.gia, 0);
  const totalRevenue = commissionTotal + subscriptionTotal + consultingTotal + reportsTotal;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BadgePercent className="w-6 h-6 text-[#1769AA]" />
          Đối soát giao dịch & Doanh thu sàn
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Hạch toán 4 nguồn thu: Hoa hồng giao dịch thành công (3-5%), Phí tham gia Seller (6tr/năm), Tư vấn chuyên gia & Báo cáo
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng doanh thu sàn"
          value={`${(totalRevenue / 1000000).toLocaleString('vi-VN')} triệu`}
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          change="+24% so tháng trước"
          changeType="positive"
        />
        <StatCard
          title="Hoa hồng giao dịch (3-5%)"
          value={`${(commissionTotal / 1000000).toLocaleString('vi-VN')} triệu`}
          icon={<BadgePercent className="w-5 h-5 text-blue-600" />}
          description="Từ các hợp đồng ký kết thành công"
        />
        <StatCard
          title="Phí duy trì Seller (6tr/năm)"
          value={`${(subscriptionTotal / 1000000).toLocaleString('vi-VN')} triệu`}
          icon={<CreditCard className="w-5 h-5 text-purple-600" />}
          description="Từ các nhà cung cấp đã kích hoạt"
        />
        <StatCard
          title="Tư vấn & Báo cáo chuyên sâu"
          value={`${((consultingTotal + reportsTotal) / 1000000).toLocaleString('vi-VN')} triệu`}
          icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
          description="Gói cố vấn và đơn đặt mua báo cáo"
        />
      </div>

      {/* Contracts Commission Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Hoa hồng hợp đồng thành công</h2>
            <p className="text-xs text-slate-500">Quy tắc tính: &lt;500tr (5%), 500tr-2tỷ (4%), &gt;2tỷ (3%)</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Số hợp đồng</th>
                <th className="py-3 px-4">Doanh nghiệp & Seller</th>
                <th className="py-3 px-4">Giá trị hợp đồng</th>
                <th className="py-3 px-4">Tỷ lệ hoa hồng</th>
                <th className="py-3 px-4">Số tiền hoa hồng</th>
                <th className="py-3 px-4">Trạng thái đối soát</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contracts.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-[#1769AA]">{c.ma_hop_dong}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{c.solutionName}</div>
                    <div className="text-[10px] text-slate-400">
                      Buyer: {c.buyerCompany} • Seller: {c.sellerCompany}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {c.gia_tri_hop_dong.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="primary">{Math.round(c.hoa_hong.ty_le * 100)}%</Badge>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-700">
                    {c.hoa_hong.so_tien.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-3 px-4">
                    {c.hoa_hong.trang_thai === 'da_thanh_toan' ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                        Chờ đối soát
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
