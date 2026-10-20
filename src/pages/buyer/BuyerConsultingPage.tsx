import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Clock,
  Video,
  FileCheck2,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { ConsultingBooking } from '../../types';
import { useToast } from '../../components/ui/Toast';

export const BuyerConsultingPage: React.FC = () => {
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const [consultings, setConsultings] = useState(() => {
    return dbService.getConsultings().filter(c => c.buyerId === currentUser?.id);
  });
  const [selectedBooking, setSelectedBooking] = useState<ConsultingBooking | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Badge variant="primary">Lịch tư vấn chuyên gia 1-1</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Các phiên tư vấn cùng Chuyên gia Cố vấn độc lập
          </h1>
          <p className="text-xs text-slate-500">
            Theo dõi lịch họp trực tuyến, chuyên gia phụ trách, số buổi đã hoàn thành và tài liệu bàn giao.
          </p>
        </div>

        <Link to="/consulting">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Đặt lịch tư vấn mới
          </Button>
        </Link>
      </div>

      {/* Bookings List */}
      {consultings.length > 0 ? (
        <div className="space-y-4">
          {consultings.map(b => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Badge variant={b.goi_dich_vu === 'Pro' ? 'primary' : 'secondary'} size="sm">
                    Gói {b.goi_dich_vu} ({(b.gia_goi / 1000000).toFixed(1)} triệu)
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">#{b.id}</span>
                  <span className="text-xs text-slate-500">
                    Trạng thái: <strong className="text-[#1769AA]">{b.trang_thai === 'da_phan_cong' ? 'Đã phân công chuyên gia' : 'Đang xử lý'}</strong>
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  Chuyên gia phụ trách: <span className="text-[#1769AA]">{b.chuyen_gia_ten || "Ban Quản trị đang phân công"}</span>
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  <strong>Mục tiêu buổi làm việc:</strong> {b.muc_tieu_tu_van}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Ngày hẹn: <strong>{b.ngay_mong_muon}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Khung giờ: <strong>{b.khung_gio}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Tiến độ: <strong>{b.so_buoi_hoan_thanh} / {b.tong_so_buoi} buổi hoàn tất</strong>
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex sm:flex-col items-center sm:items-stretch gap-2 shrink-0 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Video className="w-3.5 h-3.5" />}
                  onClick={() => {
                    toast.info(
                      "Mở phòng họp trực tuyến",
                      "Đường dẫn phòng họp Google Meet giả lập: meet.google.com/polymatch-consulting"
                    );
                  }}
                >
                  Vào phòng họp Meet
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBooking(b)}
                >
                  Xem biên bản buổi làm việc
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1769AA] flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-800">Chưa có lịch tư vấn nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Doanh nghiệp có thể đặt lịch làm việc 1-1 trực tiếp cùng chuyên gia chuỗi cung ứng độc lập để thẩm định báo giá và lựa chọn giải pháp.
          </p>
          <Link to="/consulting">
            <Button variant="primary" size="sm">
              Đăng ký lịch tư vấn (Basic/Pro) &rarr;
            </Button>
          </Link>
        </div>
      )}

      {/* Booking detail modal */}
      {selectedBooking && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBooking(null)}
          title={`Chi tiết phiên tư vấn: Gói ${selectedBooking.goi_dich_vu}`}
          subtitle={`Chuyên gia: ${selectedBooking.chuyen_gia_ten || 'Chưa phân công'}`}
          maxWidth="lg"
          footer={
            <Button variant="outline" size="sm" onClick={() => setSelectedBooking(null)}>
              Đóng
            </Button>
          }
        >
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between">
                <span>Số buổi đã hoàn thành:</span>
                <strong>{selectedBooking.so_buoi_hoan_thanh} / {selectedBooking.tong_so_buoi} buổi</strong>
              </div>
              <div className="flex justify-between">
                <span>Hình thức:</span>
                <strong>Google Meet (Trực tuyến 60 - 90 phút)</strong>
              </div>
              <div className="flex justify-between">
                <span>Chuyên môn trọng tâm:</span>
                <strong className="text-[#1769AA]">Tối ưu Vận tải & Bóc tách điểm nghẽn TMS</strong>
              </div>
            </div>

            <div>
              <strong className="block text-slate-900 mb-1">Ghi chú & Biên bản từ Chuyên gia:</strong>
              <p className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-slate-700 leading-relaxed">
                {selectedBooking.ket_qua_bien_ban || "Chuyên gia đã tiếp nhận hồ sơ chẩn đoán DBI/LDMI của doanh nghiệp. Phiên đầu tiên sẽ tập trung rà soát danh mục 45 phương tiện và tiêu chí lựa chọn phần mềm TMS."}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
