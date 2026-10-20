import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  CreditCard,
  CheckCircle2,
  Lock,
  Eye,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { connectionService } from '../../services/connectionService';
import { useToast } from '../../components/ui/Toast';

export const BuyerReportsPage: React.FC = () => {
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const enterprise = dbService.getEnterprises().find(e => e.userId === currentUser?.id) || dbService.getEnterprises()[0];
  const [orders, setOrders] = useState(() => {
    return dbService.getReportOrders().filter(o => o.buyerId === currentUser?.id);
  });
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePurchase = () => {
    setLoading(true);
    setTimeout(() => {
      const newOrder = connectionService.orderDeepDiveReport(
        currentUser?.id || enterprise.userId,
        enterprise.ten
      );
      setOrders(prev => [newOrder, ...prev]);
      setIsPurchaseModalOpen(false);
      setLoading(false);
      toast.success(
        "Đặt mua Báo cáo chuyên sâu thành công!",
        `Mã hóa đơn: ${newOrder.ma_hoa_don}. Bạn có thể xem trước hoặc tải bản PDF đầy đủ ngay bây giờ.`
      );
    }, 700);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Badge variant="primary">Dịch vụ Báo cáo Chuyên sâu</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Báo cáo Chẩn đoán Chuyên sâu & Bảng xếp hạng Tương thích
          </h1>
          <p className="text-xs text-slate-500">
            Tài liệu số hóa hoàn chỉnh phục vụ báo cáo hội đồng quản trị và lập ngân sách đầu tư công nghệ 12 tháng.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Sparkles className="w-4 h-4" />}
          onClick={() => setIsPurchaseModalOpen(true)}
        >
          Đặt mua báo cáo (700.000 VNĐ)
        </Button>
      </div>

      {/* Featured Service Card */}
      <div className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 p-6 sm:p-8 rounded-2xl border border-blue-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <Badge variant="primary" size="sm">Nội dung báo cáo chính thức (VNYTL 4.1.1)</Badge>
          <h3 className="font-extrabold text-lg text-slate-900">
            Nội dung bao gồm trong Báo cáo Chuyên sâu:
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1769AA] shrink-0 mt-0.5" />
              <span>Phân tích đối sánh (Benchmark) chỉ số DBI và LDMI với các doanh nghiệp cùng quy mô và phân khúc.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1769AA] shrink-0 mt-0.5" />
              <span>Bóc tách chi tiết nguyên nhân gốc rễ và ma trận rủi ro của 3 điểm nghẽn nghiêm trọng nhất.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1769AA] shrink-0 mt-0.5" />
              <span>Danh sách các giải pháp tương thích kèm bảng dự toán tổng chi phí sở hữu (TCO) 3 năm.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1769AA] shrink-0 mt-0.5" />
              <span>Lộ trình triển khai phân kỳ 3 bước giúp giảm thiểu rủi ro gián đoạn vận hành.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center space-y-3 shrink-0 w-full sm:w-64">
          <span className="text-xs text-slate-400 font-medium">Giá dịch vụ niêm yết:</span>
          <div className="text-3xl font-black text-[#1769AA]">
            700.000 <span className="text-xs font-normal text-slate-500">VNĐ</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Xuất hóa đơn GTGT điện tử</span>
          <Button
            variant="primary"
            size="md"
            className="w-full font-bold"
            onClick={() => setIsPurchaseModalOpen(true)}
          >
            Đặt mua ngay
          </Button>
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="text-xs font-semibold text-[#1769AA] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Xem trước bản mẫu
          </button>
        </div>
      </div>

      {/* Orders History */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
          Lịch sử đơn hàng Báo cáo chuyên sâu của bạn
        </h3>

        {orders.length > 0 ? (
          <div className="divide-y divide-slate-100 text-xs">
            {orders.map(order => (
              <div key={order.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900">{order.loai_bao_cao}</div>
                  <div className="text-slate-500 text-[11px]">
                    Hóa đơn: <span className="font-mono">{order.ma_hoa_don}</span> • Ngày đặt: {new Date(order.ngay_dat).toLocaleDateString('vi-VN')}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="success" size="sm">Đã thanh toán</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => setIsPreviewModalOpen(true)}
                  >
                    Xem báo cáo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">Bạn chưa đặt mua báo cáo chuyên sâu nào.</p>
        )}
      </div>

      {/* Purchase Modal Simulation */}
      <Modal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        title="Xác nhận đặt mua Báo cáo Chẩn đoán Chuyên sâu"
        subtitle="Mô phỏng thanh toán dịch vụ (Theo quy chuẩn VNYTL 2026)"
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsPurchaseModalOpen(false)}>
              Hủy bỏ
            </Button>
            <Button variant="primary" size="sm" loading={loading} onClick={handlePurchase}>
              Xác nhận thanh toán (700.000 VNĐ)
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex justify-between">
              <span>Doanh nghiệp thụ hưởng:</span>
              <strong>{enterprise.ten}</strong>
            </div>
            <div className="flex justify-between">
              <span>Mã số thuế:</span>
              <strong className="font-mono">{enterprise.ma_so_thue}</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-[#1769AA]">
              <span>Tổng số tiền thanh toán:</span>
              <span>700.000 VNĐ</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            * Môi trường thử nghiệm mô phỏng: Thao tác này sẽ ghi nhận đơn hàng vào cơ sở dữ liệu demo và tự động mở khóa báo cáo phân tích cho doanh nghiệp bạn.
          </p>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Bản xem trước: Báo cáo Chẩn đoán Chuyên sâu Logistics"
        subtitle={`Doanh nghiệp: ${enterprise.ten} • Mã số: INV-REP-7721`}
        maxWidth="2xl"
        footer={
          <Button variant="outline" size="sm" onClick={() => setIsPreviewModalOpen(false)}>
            Đóng bản xem trước
          </Button>
        }
      >
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 bg-slate-900 text-white rounded-xl text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-300">POLYMATCH BENCHMARK REPORT</span>
            <h4 className="text-base font-extrabold">BÁO CÁO ĐỊNH VỊ NĂNG LỰC SỐ VÀ LỘ TRÌNH TRIỂN KHAI</h4>
            <p className="text-xs text-slate-300">{enterprise.ten} (Ngành: {enterprise.nhanh})</p>
          </div>

          <div className="space-y-2">
            <strong className="block text-slate-900 text-sm">1. Ma trận đối sánh năng lực chuỗi cung ứng (Benchmark):</strong>
            <p className="text-slate-600">
              Điểm DBI của doanh nghiệp đạt 42.5/100, xếp ở nhóm 35% trên các doanh nghiệp cùng quy mô {enterprise.quy_mo} trong phân khúc vận tải đường bộ. Điểm nghẽn lớn nhất tập trung ở khả năng hiển thị thời gian thực (HT) và quản trị xe chạy rỗng chiều về (XA).
            </p>
          </div>

          <div className="space-y-2">
            <strong className="block text-slate-900 text-sm">2. Khuyến nghị giải pháp & Dự toán ngân sách 3 năm (TCO):</strong>
            <p className="text-slate-600">
              Doanh nghiệp nên ưu tiên triển khai phần mềm quản lý vận tải (TMS) cơ bản kết hợp ứng dụng tài xế ePOD trong Quý 4/2026. Tổng chi phí sở hữu ước tính khoảng 72 triệu VNĐ cho năm đầu tiên và 36 triệu VNĐ cho các năm tiếp theo, dự kiến hoàn vốn sau 5.2 tháng.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-medium">
            ✓ Báo cáo đầy đủ 18 trang bao gồm ma trận SWOT công nghệ, bảng phân tích đối thủ cạnh tranh ẩn danh và phụ lục đánh giá chỉ số theo khung ASCM SCOR-DS.
          </div>
        </div>
      </Modal>
    </div>
  );
};
