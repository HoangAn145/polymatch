import React, { useState } from 'react';
import { Settings, User, Lock, Bell } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { authService } from '../../services/authService';
import { useToast } from '../../components/ui/Toast';

export const SellerSettingsPage: React.FC = () => {
  const toast = useToast();
  const currentUser = authService.getCurrentUser();

  const [leadNotify, setLeadNotify] = useState(true);
  const [dealNotify, setDealNotify] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Đã lưu thiết lập tài khoản", "Cài đặt thông báo đã được cập nhật.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-xs">
      <div className="border-b border-slate-200 pb-4">
        <Badge variant="primary">Thiết lập tài khoản Seller</Badge>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Cài đặt & Kênh đón nhận Nhu cầu Khách hàng
        </h1>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
          Kênh nhận thông báo Lead mới từ Doanh nghiệp
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={leadNotify}
              onChange={e => setLeadNotify(e.target.checked)}
              className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <div className="font-bold text-slate-800">Thông báo Email khi có Doanh nghiệp yêu cầu báo giá</div>
              <div className="text-slate-500 text-[11px]">Hệ thống sẽ gửi ngay thông tin bài toán và liên hệ của Buyer vào email {currentUser?.email}.</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={dealNotify}
              onChange={e => setDealNotify(e.target.checked)}
              className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <div className="font-bold text-slate-800">Thông báo khi Buyer chấp thuận báo giá & ký Hợp đồng</div>
              <div className="text-slate-500 text-[11px]">Nhận cảnh báo để tiến hành triển khai giải pháp và đối soát hoa hồng.</div>
            </div>
          </label>
        </div>

        <div className="pt-2">
          <Button variant="primary" size="sm" onClick={handleSave}>
            Lưu cài đặt
          </Button>
        </div>
      </div>
    </div>
  );
};
