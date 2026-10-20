import React from 'react';
import { FileCheck2, Building2, Calendar, DollarSign, Download, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';

export const SellerContractsPage: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const seller = dbService.getSellers().find(s => s.userId === currentUser?.id) || dbService.getSellers()[0];
  const contracts = dbService.getContracts().filter(ctr => ctr.sellerId === seller?.id || ctr.sellerId === currentUser?.id);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Badge variant="primary">Hợp đồng giao dịch</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Hợp đồng Thương mại phát sinh từ Kết nối Nền tảng
          </h1>
          <p className="text-xs text-slate-500">
            Cơ sở pháp lý ghi nhận giao dịch thành công và đối soát nghĩa vụ hoa hồng theo thỏa thuận VNYTL.
          </p>
        </div>
      </div>

      {contracts.length > 0 ? (
        <div className="space-y-4">
          {contracts.map(ctr => (
            <div
              key={ctr.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1 min-w-0 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">Hợp đồng hiệu lực</Badge>
                  <span className="font-mono font-bold text-slate-700">{ctr.ma_hop_dong}</span>
                  <span className="text-slate-400">Ngày ký: {ctr.ngay_ky}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900">
                  Khách hàng: <span className="text-[#1769AA]">{ctr.buyerCompany}</span>
                </h3>

                <p className="text-slate-600">
                  Giải pháp cung ứng: <strong>{ctr.solutionName}</strong>
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-slate-400 block font-medium">Giá trị hợp đồng:</span>
                    <strong className="text-slate-900 text-sm">{(ctr.gia_tri_hop_dong / 1000000).toLocaleString('vi-VN')} triệu VNĐ</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Tỷ lệ hoa hồng VNYTL:</span>
                    <strong className="text-blue-700">{ctr.hoa_hong.ty_le * 100}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Số tiền hoa hồng:</span>
                    <strong className="text-emerald-700 text-sm">{(ctr.hoa_hong.so_tien / 1000000).toLocaleString('vi-VN')} triệu VNĐ</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Trạng thái đối soát:</span>
                    <Badge variant={ctr.hoa_hong.trang_thai === 'da_doi_soat' ? 'success' : 'warning'} size="sm">
                      {ctr.hoa_hong.trang_thai === 'da_doi_soat' ? 'Đã đối soát' : 'Chưa đối soát'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <p className="text-xs text-slate-500">Chưa có hợp đồng nào được ký kết.</p>
        </div>
      )}
    </div>
  );
};
