import React, { useState } from 'react';
import {
  Send,
  Search,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { dbService } from '../../services/mockDatabase';
import { ConnectionRequest } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const AdminConnectionsPage: React.FC = () => {
  const [connections] = useState<ConnectionRequest[]>(() => dbService.getConnections());
  const [search, setSearch] = useState('');
  const [selectedConn, setSelectedConn] = useState<ConnectionRequest | null>(null);

  const filtered = connections.filter(c =>
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.buyerCompany.toLowerCase().includes(search.toLowerCase()) ||
    c.solutionName.toLowerCase().includes(search.toLowerCase()) ||
    c.sellerCompany.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Send className="w-6 h-6 text-[#1769AA]" />
          Giám sát yêu cầu kết nối sàn POLYMATCH
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Theo dõi luồng kết nối công nghệ giữa Doanh nghiệp logistics và Nhà cung cấp giải pháp
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã yêu cầu, doanh nghiệp, giải pháp..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1769AA]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Mã & Ngày gửi</th>
                <th className="py-3.5 px-4">Doanh nghiệp (Buyer)</th>
                <th className="py-3.5 px-4">Giải pháp & Nhà cung cấp</th>
                <th className="py-3.5 px-4">Ngân sách dự kiến</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#1769AA]">{c.id}</span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(c.ngay_tao).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{c.buyerCompany}</div>
                    <div className="text-[10px] text-slate-400">{c.buyerName} • {c.buyerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{c.solutionName}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{c.sellerCompany}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-700">
                      {c.ngan_sach_du_kien}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {c.trang_thai === 'moi' && (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium text-[11px]">
                        Mới gửi
                      </span>
                    )}
                    {c.trang_thai === 'da_tiep_nhan' && (
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-medium text-[11px]">
                        Đã tiếp nhận
                      </span>
                    )}
                    {c.trang_thai === 'da_bao_gia' && (
                      <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-medium text-[11px]">
                        Đã gửi báo giá
                      </span>
                    )}
                    {c.trang_thai === 'hoan_thanh' && (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium text-[11px]">
                        Ký kết thành công
                      </span>
                    )}
                    {c.trang_thai === 'da_huy' && (
                      <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium text-[11px]">
                        Đã hủy
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedConn(c)}
                      className="text-[#1769AA]"
                    >
                      Xem
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedConn && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedConn(null)}
          title={`Chi tiết kết nối: ${selectedConn.id}`}
        >
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-lg space-y-1.5">
              <div>
                <span className="text-slate-400 block text-[11px]">Nhu cầu doanh nghiệp:</span>
                <p className="font-medium text-slate-800">{selectedConn.nhu_cau_chi_tiet}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Ngân sách dự kiến:</span>
                <span className="font-bold text-[#1769AA]">{selectedConn.ngan_sach_du_kien}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Thời gian triển khai mong muốn:</span>
                <span>{selectedConn.thoi_gian_du_kien}</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedConn(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
