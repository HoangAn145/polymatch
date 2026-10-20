import React from 'react';
import { BadgePercent, ShieldCheck, DollarSign, Calendar, FileCheck2, Info } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';

export const SellerCommissionPage: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const seller = dbService.getSellers().find(s => s.userId === currentUser?.id) || dbService.getSellers()[0];
  const contracts = dbService.getContracts().filter(ctr => ctr.sellerId === seller?.id || ctr.sellerId === currentUser?.id);

  const totalCommission = contracts.reduce((sum, c) => sum + c.hoa_hong.so_tien, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 space-y-1">
        <Badge variant="primary">Quy chế đối soát VNYTL 4.1.2</Badge>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Nghĩa vụ Phí Hoa hồng Hợp đồng & Đối soát Giao dịch
        </h1>
        <p className="text-xs text-slate-500">
          Hoa hồng đối soát minh bạch theo bậc giá trị hợp đồng được ký kết từ nguồn kết nối hợp lệ của POLYMATCH.
        </p>
      </div>

      {/* Tiers Explanation Card */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
        <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">
          Biểu phí hoa hồng hợp đồng theo khung VNYTL 2026:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-medium">Bậc 1 (≤ 50 triệu):</span>
            <div className="text-lg font-black text-emerald-700 mt-0.5">5%</div>
            <span className="text-[11px] text-slate-500">Áp dụng hợp đồng dưới 50 triệu</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-medium">Bậc 2 (50 – 100 triệu):</span>
            <div className="text-lg font-black text-blue-700 mt-0.5">8%</div>
            <span className="text-[11px] text-slate-500">Áp dụng hợp đồng từ 50 đến 100 triệu</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-medium">Bậc 3 (&gt; 100 triệu):</span>
            <div className="text-lg font-black text-indigo-700 mt-0.5">10%</div>
            <span className="text-[11px] text-slate-500">Áp dụng hợp đồng trên 100 triệu</span>
          </div>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 font-medium">Tổng nghĩa vụ hoa hồng phát sinh:</span>
          <div className="text-3xl font-black text-[#1769AA] mt-1">
            {(totalCommission / 1000000).toLocaleString('vi-VN')} <span className="text-base font-normal text-slate-400">triệu VNĐ</span>
          </div>
        </div>

        <div className="text-xs text-slate-500 max-w-sm text-right sm:border-l sm:border-slate-100 sm:pl-6">
          Kỳ đối soát định kỳ vào ngày 25 hàng tháng. Chứng từ đối soát gồm biên bản nghiệm thu và hóa đơn tài chính của hai bên.
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="p-4">Mã hợp đồng</th>
              <th className="p-4">Doanh nghiệp (Buyer)</th>
              <th className="p-4">Giá trị hợp đồng</th>
              <th className="p-4">Tỷ lệ áp dụng</th>
              <th className="p-4">Hoa hồng dự kiến</th>
              <th className="p-4">Tình trạng đối soát</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {contracts.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/70">
                <td className="p-4 font-mono font-bold">{c.ma_hop_dong}</td>
                <td className="p-4 font-semibold text-slate-900">{c.buyerCompany}</td>
                <td className="p-4 font-mono font-bold">{(c.gia_tri_hop_dong / 1000000).toFixed(1)} tr</td>
                <td className="p-4 font-bold text-blue-700">{c.hoa_hong.ty_le * 100}%</td>
                <td className="p-4 font-mono font-bold text-emerald-700">{(c.hoa_hong.so_tien / 1000000).toFixed(2)} tr</td>
                <td className="p-4">
                  <Badge variant={c.hoa_hong.trang_thai === 'da_doi_soat' ? 'success' : 'warning'} size="sm">
                    {c.hoa_hong.trang_thai === 'da_doi_soat' ? 'Đã đối soát' : 'Chờ đối soát kỳ này'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
