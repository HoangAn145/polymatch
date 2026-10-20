import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Send,
  Building2,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  FileText,
  XCircle,
  Plus
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { connectionService } from '../../services/connectionService';
import { ConnectionRequest } from '../../types';
import { useToast } from '../../components/ui/Toast';

export const SellerRequestsPage: React.FC = () => {
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const seller = dbService.getSellers().find(s => s.userId === currentUser?.id) || dbService.getSellers()[0];
  const [requests, setRequests] = useState<ConnectionRequest[]>(() => {
    return dbService.getConnections().filter(c => c.sellerId === seller?.id || c.sellerId === currentUser?.id);
  });

  const [selectedReqForQuote, setSelectedReqForQuote] = useState<ConnectionRequest | null>(null);

  // Quote form inputs
  const [totalPriceVnd, setTotalPriceVnd] = useState<number>(72000000);
  const [deliveryWeeks, setDeliveryWeeks] = useState<number>(4);
  const [quoteNotes, setQuoteNotes] = useState('Gói thuê bao 12 tháng hệ thống quản lý vận tải Cloud cho 45 xe, bao gồm app tài xế và đào tạo.');

  const reloadRequests = () => {
    setRequests(dbService.getConnections().filter(c => c.sellerId === seller?.id || c.sellerId === currentUser?.id));
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForQuote) return;

    try {
      const quote = connectionService.sendQuotation({
        connectionId: selectedReqForQuote.id,
        sellerId: seller.id,
        sellerCompany: seller.ten,
        buyerId: selectedReqForQuote.buyerId,
        buyerCompany: selectedReqForQuote.buyerCompany,
        solutionId: selectedReqForQuote.solutionId,
        solutionName: selectedReqForQuote.solutionName,
        tong_gia_tri: totalPriceVnd,
        thoi_gian_trien_khai_tuan: deliveryWeeks,
        noi_dung_bao_gia: quoteNotes,
        cac_hang_muc: [
          { ten: `Thuê bao phần mềm ${selectedReqForQuote.solutionName}`, so_luong: 1, don_gia: totalPriceVnd * 0.8 },
          { ten: 'Phí thiết lập hệ thống & chuyển giao', so_luong: 1, don_gia: totalPriceVnd * 0.2 }
        ]
      });

      setSelectedReqForQuote(null);
      reloadRequests();
      toast.success(
        "Đã gửi báo giá thành công!",
        `Báo giá ${(quote.tong_gia_tri / 1000000).toFixed(1)} triệu đồng đã được gửi đến ${quote.buyerCompany}.`
      );
    } catch {
      toast.error("Lỗi khi gửi báo giá", "Không thể gửi báo giá lúc này.");
    }
  };

  const handleUpdateStatus = (reqId: string, status: ConnectionRequest['trang_thai'], note?: string) => {
    dbService.updateConnection(reqId, { trang_thai: status, ghi_chu_seller: note });
    reloadRequests();
    toast.info("Đã cập nhật trạng thái yêu cầu", `Trạng thái mới: ${status}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Badge variant="primary">Kênh đón nhận Nhu cầu (Leads)</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Yêu cầu kết nối & Đơn hỏi báo giá từ Doanh nghiệp
          </h1>
          <p className="text-xs text-slate-500">
            Tiếp nhận thông tin khách hàng, phản hồi tiến độ và tạo bảng báo giá chính thức.
          </p>
        </div>
      </div>

      {/* Requests List */}
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map(req => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Badge variant={req.trang_thai === 'da_bao_gia' ? 'warning' : req.trang_thai === 'hoan_thanh' ? 'success' : 'primary'} size="sm">
                    {req.trang_thai.replace(/_/g, ' ')}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">#{req.id}</span>
                  <span className="text-xs text-slate-500">
                    Nhận lúc: {new Date(req.ngay_tao).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#1769AA]" />
                  <h3 className="font-bold text-base text-slate-900">{req.buyerCompany}</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <strong>Nội dung bài toán khách hàng:</strong> {req.nhu_cau_chi_tiet}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {req.buyerName}: <strong>{req.buyerPhone}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {req.buyerEmail}
                  </span>
                  <span>Ngân sách dự kiến: <strong className="text-emerald-700">{req.ngan_sach_du_kien}</strong></span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col items-center sm:items-stretch gap-2 shrink-0 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<FileText className="w-3.5 h-3.5" />}
                  onClick={() => setSelectedReqForQuote(req)}
                >
                  {req.bao_gia_id ? 'Cập nhật Báo giá' : 'Tạo & Gửi Báo giá'}
                </Button>

                {req.trang_thai === 'moi' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(req.id, 'dang_trao_doi', 'Đã tiếp nhận và đang liên hệ qua điện thoại')}
                  >
                    Tiếp nhận yêu cầu
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <p className="text-xs text-slate-500">Chưa có yêu cầu kết nối nào gửi tới bạn.</p>
        </div>
      )}

      {/* Quote Creation Modal */}
      {selectedReqForQuote && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReqForQuote(null)}
          title={`Lập báo giá thương mại: ${selectedReqForQuote.solutionName}`}
          subtitle={`Gửi cho: ${selectedReqForQuote.buyerCompany} (${selectedReqForQuote.buyerName})`}
          maxWidth="lg"
        >
          <form onSubmit={handleSendQuote} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tổng giá trị báo giá (VNĐ) *
              </label>
              <input
                type="number"
                required
                value={totalPriceVnd}
                onChange={e => setTotalPriceVnd(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-[#1769AA] focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Tương đương: <strong>{(totalPriceVnd / 1000000).toLocaleString('vi-VN')} triệu VNĐ</strong>. Mức hoa hồng đối soát theo VNYTL dự kiến: {totalPriceVnd > 100000000 ? '10%' : totalPriceVnd > 50000000 ? '8%' : '5%'}.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Thời gian triển khai dự kiến (tuần) *
              </label>
              <input
                type="number"
                required
                value={deliveryWeeks}
                onChange={e => setDeliveryWeeks(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nội dung chi tiết phạm vi cung cấp *
              </label>
              <textarea
                rows={4}
                required
                value={quoteNotes}
                onChange={e => setQuoteNotes(e.target.value)}
                placeholder="Mô tả phạm vi gói thuê bao, số lượng tài khoản, thiết bị đi kèm và hỗ trợ kỹ thuật..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setSelectedReqForQuote(null)}>
                Hủy bỏ
              </Button>
              <Button variant="primary" size="sm" type="submit" rightIcon={<Send className="w-3.5 h-3.5" />}>
                Gửi báo giá tới Buyer
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
