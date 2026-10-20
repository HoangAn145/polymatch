import React, { useState } from 'react';
import {
  CalendarDays,
  Search,
  CheckCircle2,
  Clock,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { dbService } from '../../services/mockDatabase';
import { ConsultingBooking } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

export const AdminConsultingPage: React.FC = () => {
  const [consultings, setConsultings] = useState<ConsultingBooking[]>(() => dbService.getConsultings());
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<ConsultingBooking | null>(null);
  const [meetingUrlInput, setMeetingUrlInput] = useState('');
  const toast = useToast();
  const experts = dbService.getExperts();

  const handleUpdateStatus = (
    bookingId: string,
    status: 'cho_admin_duyet' | 'da_phan_cong' | 'dang_dien_ra' | 'hoan_thanh' | 'da_huy'
  ) => {
    dbService.updateConsulting(bookingId, {
      trang_thai: status,
      ...(status === 'hoan_thanh' ? { so_buoi_hoan_thanh: 3 } : {})
    });
    setConsultings(dbService.getConsultings());
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({
        ...selectedBooking,
        trang_thai: status,
        ...(status === 'hoan_thanh' ? { so_buoi_hoan_thanh: 3 } : {})
      });
    }
    toast.success("Đã cập nhật phiên tư vấn", `Trạng thái mới: ${status}`);
  };

  const handleAssignExpert = (bookingId: string, expertId: string) => {
    const expert = experts.find(e => e.id === expertId);
    if (!expert) return;

    dbService.updateConsulting(bookingId, {
      chuyen_gia_id: expert.id,
      chuyen_gia_ten: expert.ho_ten,
      trang_thai: 'da_phan_cong'
    });
    setConsultings(dbService.getConsultings());
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking({
        ...selectedBooking,
        chuyen_gia_id: expert.id,
        chuyen_gia_ten: expert.ho_ten,
        trang_thai: 'da_phan_cong'
      });
    }
    toast.success("Đã phân công chuyên gia", `Chuyên gia ${expert.ho_ten} đã được chỉ định cho phiên tư vấn này.`);
  };

  const filtered = consultings.filter(c =>
    c.buyerCompany.toLowerCase().includes(search.toLowerCase()) ||
    c.buyerContactName.toLowerCase().includes(search.toLowerCase()) ||
    (c.chuyen_gia_ten ? c.chuyen_gia_ten.toLowerCase().includes(search.toLowerCase()) : false)
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-[#1769AA]" />
            Điều phối & Quản lý lịch tư vấn
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kết nối phiên làm việc giữa Chuyên gia cố vấn và Doanh nghiệp logistics
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo doanh nghiệp, chuyên gia..."
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
                <th className="py-3.5 px-4">Doanh nghiệp đặt lịch</th>
                <th className="py-3.5 px-4">Chuyên gia phụ trách</th>
                <th className="py-3.5 px-4">Gói dịch vụ</th>
                <th className="py-3.5 px-4">Lịch hẹn mong muốn</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Chưa có lịch tư vấn nào
                  </td>
                </tr>
              ) : (
                filtered.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{b.buyerCompany}</div>
                      <div className="text-slate-400 text-[11px]">{b.buyerContactName} • {b.buyerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {b.chuyen_gia_ten ? (
                        <div className="font-medium text-slate-800">{b.chuyen_gia_ten}</div>
                      ) : (
                        <span className="text-amber-700 italic text-[11px]">Chưa chỉ định</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="primary">
                        {b.goi_dich_vu === 'Basic' ? 'Gói Cơ bản (3 buổi)' : 'Gói Chuyên sâu (5 buổi)'}
                      </Badge>
                      <div className="text-[11px] font-bold text-slate-700 mt-0.5">
                        {b.gia_goi.toLocaleString('vi-VN')} đ
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{b.ngay_mong_muon}</div>
                      <div className="text-[10px] text-slate-400">Khung giờ: {b.khung_gio}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {b.trang_thai === 'cho_admin_duyet' && (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full text-[11px]">
                          <Clock className="w-3 h-3" /> Chờ phân công
                        </span>
                      )}
                      {b.trang_thai === 'da_phan_cong' && (
                        <span className="inline-flex items-center gap-1 text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-full text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Đã phân công
                        </span>
                      )}
                      {b.trang_thai === 'hoan_thanh' && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Hoàn thành
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedBooking(b)}
                        className="text-[#1769AA]"
                      >
                        Quản lý
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBooking(null)}
          title={`Phiên tư vấn: ${selectedBooking.buyerCompany}`}
          subtitle={`Gói: ${selectedBooking.goi_dich_vu === 'Basic' ? 'Cơ bản (3 buổi)' : 'Chuyên sâu (5 buổi)'}`}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-lg space-y-2">
              <div>
                <span className="text-slate-400 block text-[11px]">Mục tiêu tư vấn của doanh nghiệp:</span>
                <p className="font-medium text-slate-800">{selectedBooking.muc_tieu_tu_van}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400 block text-[11px]">Người đại diện:</span>
                  <span className="font-semibold text-slate-900">{selectedBooking.buyerContactName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Liên hệ:</span>
                  <span className="font-semibold text-slate-900">{selectedBooking.buyerPhone}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Chỉ định chuyên gia phụ trách:
              </label>
              <select
                value={selectedBooking.chuyen_gia_id || ''}
                onChange={e => handleAssignExpert(selectedBooking.id, e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="">-- Chọn chuyên gia phù hợp --</option>
                {experts.map(exp => (
                  <option key={exp.id} value={exp.id}>
                    {exp.ho_ten} - {exp.chuc_danh}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'da_phan_cong')}
                >
                  Xác nhận lịch
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'hoan_thanh')}
                >
                  Đánh dấu hoàn thành
                </Button>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setSelectedBooking(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
