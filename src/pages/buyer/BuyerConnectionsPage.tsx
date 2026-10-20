import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Building2,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  XCircle,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { connectionService } from '../../services/connectionService';
import { ConnectionRequest, Quotation } from '../../types';
import { useToast } from '../../components/ui/Toast';

export const BuyerConnectionsPage: React.FC = () => {
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const [connections, setConnections] = useState<ConnectionRequest[]>(() => {
    return dbService.getConnections().filter(c => c.buyerId === currentUser?.id);
  });
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);

  const reloadConnections = () => {
    setConnections(dbService.getConnections().filter(c => c.buyerId === currentUser?.id));
  };

  const handleViewQuote = (baoGiaId?: string) => {
    if (!baoGiaId) return;
    const q = dbService.getQuotations().find(item => item.id === baoGiaId);
    if (q) {
      setSelectedQuote(q);
    } else {
      toast.warning("Chưa có báo giá", "Nhà cung cấp đang chuẩn bị bảng báo giá cho bạn.");
    }
  };

  const handleAcceptQuote = (quoteId: string) => {
    try {
      const contract = connectionService.acceptQuotation(quoteId);
      setSelectedQuote(null);
      reloadConnections();
      toast.success(
        "Đã chấp thuận báo giá & Khởi tạo Hợp đồng!",
        `Mã hợp đồng: ${contract.ma_hop_dong}. Nghĩa vụ hoa hồng đối soát: ${(contract.hoa_hong.so_tien / 1000000).toFixed(1)} triệu đồng.`
      );
    } catch (err: any) {
      toast.error("Lỗi khi chấp thuận", err.message);
    }
  };

  const handleCancelRequest = (connId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy yêu cầu kết nối này không?")) {
      dbService.updateConnection(connId, { trang_thai: 'da_huy' });
      reloadConnections();
      toast.info("Đã hủy yêu cầu", "Yêu cầu kết nối đã được đánh dấu hủy.");
    }
  };

  const getStatusBadge = (st: ConnectionRequest['trang_thai']) => {
    switch (st) {
      case 'moi':
        return <Badge variant="neutral" size="sm" dot>Mới gửi</Badge>;
      case 'da_tiep_nhan':
        return <Badge variant="primary" size="sm" dot>Đã tiếp nhận</Badge>;
      case 'dang_trao_doi':
        return <Badge variant="secondary" size="sm" dot>Đang trao đổi</Badge>;
      case 'da_bao_gia':
        return <Badge variant="warning" size="sm" dot>Đã có báo giá</Badge>;
      case 'hoan_thanh':
        return <Badge variant="success" size="sm" dot>Đã ký hợp đồng</Badge>;
      case 'da_huy':
        return <Badge variant="danger" size="sm">Đã hủy</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Badge variant="primary">Kênh thương mại trực tiếp</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Quản lý Yêu cầu kết nối & Báo giá
          </h1>
          <p className="text-xs text-slate-500">
            Theo dõi tiến trình trao đổi, nhận báo giá chính thức và ký hợp đồng với các nhà cung cấp giải pháp.
          </p>
        </div>

        <Link to="/buyer/solutions">
          <Button variant="primary" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
            Gửi yêu cầu mới
          </Button>
        </Link>
      </div>

      {/* Connections List */}
      {connections.length > 0 ? (
        <div className="space-y-4">
          {connections.map(conn => (
            <div
              key={conn.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {getStatusBadge(conn.trang_thai)}
                  <span className="text-xs font-mono text-slate-400">#{conn.id}</span>
                  <span className="text-xs text-slate-400">
                    Gửi ngày: {new Date(conn.ngay_tao).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  Giải pháp: <span className="text-[#1769AA]">{conn.solutionName}</span>
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  <strong>Nội dung yêu cầu:</strong> {conn.nhu_cau_chi_tiet}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>Nhà cung cấp: <strong className="text-slate-800">{conn.sellerCompany}</strong></span>
                  <span>Ngân sách: <strong className="text-slate-800">{conn.ngan_sach_du_kien}</strong></span>
                  <span>Tiến độ: <strong className="text-slate-800">{conn.thoi_gian_du_kien}</strong></span>
                </div>

                {conn.ghi_chu_seller && (
                  <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-slate-700">
                    <strong>Phản hồi từ Seller:</strong> {conn.ghi_chu_seller}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col items-center sm:items-stretch gap-2 shrink-0 w-full sm:w-auto">
                {conn.bao_gia_id ? (
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<FileText className="w-3.5 h-3.5" />}
                    onClick={() => handleViewQuote(conn.bao_gia_id)}
                  >
                    Xem báo giá chi tiết
                  </Button>
                ) : (
                  <span className="text-xs text-slate-400 font-medium px-3 py-1.5 bg-slate-50 rounded-lg border text-center">
                    Đang chờ Seller báo giá
                  </span>
                )}

                {conn.trang_thai !== 'hoan_thanh' && conn.trang_thai !== 'da_huy' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs"
                    onClick={() => handleCancelRequest(conn.id)}
                  >
                    Hủy yêu cầu này
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1769AA] flex items-center justify-center mx-auto">
            <Send className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-800">Chưa có yêu cầu kết nối nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Hãy khám phá danh mục giải pháp đề xuất theo điểm nghẽn của bạn và gửi yêu cầu để nhận báo giá chính thức.
          </p>
          <Link to="/buyer/solutions">
            <Button variant="primary" size="sm">
              Khám phá giải pháp đề xuất &rarr;
            </Button>
          </Link>
        </div>
      )}

      {/* Quotation Detail Modal */}
      {selectedQuote && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedQuote(null)}
          title={`Báo giá chính thức: ${selectedQuote.solutionName}`}
          subtitle={`Gửi bởi: ${selectedQuote.sellerCompany} • Hiệu lực đến: ${new Date(selectedQuote.han_hieu_luc).toLocaleDateString('vi-VN')}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="text-xs">
                Tổng giá trị: <strong className="text-base text-[#1769AA]">{(selectedQuote.tong_gia_tri / 1000000).toFixed(1)} triệu VNĐ</strong>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedQuote(null)}>
                  Đóng
                </Button>
                {selectedQuote.trang_thai === 'cho_phan_hoi' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAcceptQuote(selectedQuote.id)}
                  >
                    Chấp thuận & Ký hợp đồng
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Nội dung đề xuất:</span>
              <p className="text-slate-600 leading-relaxed">{selectedQuote.noi_dung_bao_gia}</p>
            </div>

            <div>
              <span className="font-bold text-slate-800 block mb-2">Chi tiết các hạng mục chi phí:</span>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px]">
                    <tr>
                      <th className="p-2.5">Hạng mục</th>
                      <th className="p-2.5 text-center">SL</th>
                      <th className="p-2.5 text-right">Đơn giá</th>
                      <th className="p-2.5 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {selectedQuote.cac_hang_muc.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium">{item.ten}</td>
                        <td className="p-2.5 text-center">{item.so_luong}</td>
                        <td className="p-2.5 text-right font-mono">{(item.don_gia / 1000000).toFixed(1)} tr</td>
                        <td className="p-2.5 text-right font-bold font-mono">{((item.so_luong * item.don_gia) / 1000000).toFixed(1)} tr</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-[#1769AA]">Cam kết thực hiện:</div>
              <p>• Thời gian triển khai dự kiến: {selectedQuote.thoi_gian_trien_khai_tuan} tuần kể từ ngày ký hợp đồng.</p>
              <p>• Khi bạn bấm <strong>Chấp thuận & Ký hợp đồng</strong>, hệ thống sẽ tự động khởi tạo hợp đồng điện tử và chuyển trạng thái sang dự án đang triển khai.</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
