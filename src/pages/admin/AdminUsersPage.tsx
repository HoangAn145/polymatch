import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Lock,
  Unlock,
  Mail,
  Phone
} from 'lucide-react';
import { dbService } from '../../services/mockDatabase';
import { User, UserRole, AccountStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => dbService.getUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AccountStatus>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const toast = useToast();

  const handleToggleStatus = (user: User) => {
    const newStatus: AccountStatus = user.status === 'active' ? 'locked' : 'active';
    dbService.updateUser(user.id, { status: newStatus });
    setUsers(dbService.getUsers());
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...user, status: newStatus });
    }
    dbService.addAuditLog({
      adminId: 'usr-admin-01',
      adminName: 'Quản trị viên POLYMATCH',
      hanh_dong: newStatus === 'locked' ? 'KHOA_TAI_KHOAN' : 'MO_KHOA_TAI_KHOAN',
      doi_tuong: 'user',
      doi_tuong_id: user.id,
      mo_ta: `${newStatus === 'locked' ? 'Khóa' : 'Mở khóa'} tài khoản ${user.email} (${user.companyName})`
    });
    toast.success(
      newStatus === 'locked' ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản',
      `Tài khoản ${user.email} đã được chuyển sang trạng thái ${newStatus === 'locked' ? 'Bị khóa' : 'Hoạt động'}.`
    );
  };

  const filteredUsers = users.filter(u => {
    const matchSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.companyName.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone ? u.phone.includes(search) : false);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#1769AA]" />
            Quản lý người dùng hệ thống
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tổng cộng {users.length} tài khoản thành viên (Doanh nghiệp, Nhà cung cấp và Ban quản trị)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo email, tên, công ty, SĐT..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1769AA]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Vai trò:</span>
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="BUYER">Doanh nghiệp (Buyer)</option>
            <option value="SELLER">Nhà cung cấp (Seller)</option>
            <option value="ADMIN">Quản trị viên (Admin)</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="pending">Chờ xác thực</option>
            <option value="locked">Bị khóa</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Tài khoản & Email</th>
                <th className="py-3.5 px-4">Đơn vị / Doanh nghiệp</th>
                <th className="py-3.5 px-4">Vai trò</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Ngày đăng ký</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Không tìm thấy tài khoản người dùng phù hợp bộ lọc
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{u.fullName}</div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {u.email}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{u.companyName}</div>
                        {u.phone && (
                          <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            {u.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {u.role === 'BUYER' && (
                          <Badge variant="primary">Doanh nghiệp (Buyer)</Badge>
                        )}
                        {u.role === 'SELLER' && (
                          <Badge variant="success">Nhà cung cấp (Seller)</Badge>
                        )}
                        {u.role === 'ADMIN' && (
                          <Badge variant="warning">Quản trị viên (Admin)</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {u.status === 'active' && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Hoạt động
                          </span>
                        )}
                        {u.status === 'locked' && (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-full text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Bị khóa
                          </span>
                        )}
                        {u.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Chờ kích hoạt
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(u)}
                          className="text-[#1769AA]"
                        >
                          Chi tiết
                        </Button>
                        {u.role !== 'ADMIN' && (
                          <Button
                            variant={u.status === 'active' ? 'danger' : 'outline'}
                            size="sm"
                            onClick={() => handleToggleStatus(u)}
                          >
                            {u.status === 'active' ? (
                              <span className="flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Khóa
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Unlock className="w-3 h-3" /> Mở
                              </span>
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          title="Thông tin chi tiết tài khoản"
          subtitle={`ID: ${selectedUser.id}`}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
              <div>
                <span className="text-slate-400 block text-[11px]">Họ và tên:</span>
                <span className="font-bold text-slate-900">{selectedUser.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Vai trò:</span>
                <span className="font-bold text-slate-900">{selectedUser.role}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Email đăng nhập:</span>
                <span className="font-medium text-slate-900">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Số điện thoại:</span>
                <span className="font-medium text-slate-900">{selectedUser.phone || 'Chưa cập nhật'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Đơn vị / Doanh nghiệp:</span>
                <span className="font-bold text-[#1769AA]">{selectedUser.companyName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Trạng thái:</span>
                <span className="font-bold uppercase">{selectedUser.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Ngày tạo:</span>
                <span>{new Date(selectedUser.createdAt).toLocaleString('vi-VN')}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              {selectedUser.role !== 'ADMIN' && (
                <Button
                  variant={selectedUser.status === 'active' ? 'danger' : 'outline'}
                  size="sm"
                  onClick={() => handleToggleStatus(selectedUser)}
                >
                  {selectedUser.status === 'active' ? 'Khóa tài khoản này' : 'Mở khóa tài khoản này'}
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={() => setSelectedUser(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
