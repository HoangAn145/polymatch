import React, { useState } from 'react';
import { Settings, User, Bell, Lock, ShieldCheck, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { authService } from '../../services/authService';
import { useToast } from '../../components/ui/Toast';

export const BuyerSettingsPage: React.FC = () => {
  const toast = useToast();
  const currentUser = authService.getCurrentUser();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [emailNotify, setEmailNotify] = useState(true);
  const [quoteNotify, setQuoteNotify] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Đã cập nhật thông tin tài khoản", "Thông tin người dùng đã được lưu.");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.warning("Chưa nhập đủ mật khẩu", "Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.");
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    toast.success("Đã đổi mật khẩu thành công!", "Mật khẩu mới đã được cập nhật.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-xs">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <Badge variant="primary">Thiết lập hệ thống</Badge>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Cài đặt tài khoản & Kênh thông báo
        </h1>
        <p className="text-slate-500">
          Quản lý thông tin đăng nhập, bảo mật và cài đặt nhận thông báo báo giá từ nhà cung cấp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-[#1769AA]" />
            <span>Thông tin cá nhân</span>
          </h3>

          <form onSubmit={handleSaveInfo} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email đăng nhập</label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-100 text-slate-500 rounded-lg text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
              />
            </div>

            <div className="pt-2">
              <Button variant="primary" size="sm" type="submit">
                Lưu thông tin
              </Button>
            </div>
          </form>
        </div>

        {/* Password Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#1769AA]" />
            <span>Đổi mật khẩu</span>
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
              />
            </div>

            <div className="pt-2">
              <Button variant="outline" size="sm" type="submit">
                Cập nhật mật khẩu
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Notifications Settings */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#1769AA]" />
          <span>Kênh nhận thông báo</span>
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotify}
              onChange={e => setEmailNotify(e.target.checked)}
              className="h-4 w-4 rounded text-[#1769AA] focus:ring-[#1769AA]"
            />
            <div>
              <div className="font-bold text-slate-800">Thông báo qua Email</div>
              <div className="text-slate-500 text-[11px]">Nhận thông báo khi nhà cung cấp gửi báo giá hoặc chuyên gia xác nhận lịch tư vấn.</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={quoteNotify}
              onChange={e => setQuoteNotify(e.target.checked)}
              className="h-4 w-4 rounded text-[#1769AA] focus:ring-[#1769AA]"
            />
            <div>
              <div className="font-bold text-slate-800">Thông báo nhắc nhở mốc dự án</div>
              <div className="text-slate-500 text-[11px]">Nhận email nhắc việc trước 3 ngày đến hạn mốc triển khai (cài đặt, chạy thử nghiệm).</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
