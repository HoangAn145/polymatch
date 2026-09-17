import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShieldCheck, 
  Building2, 
  Store, 
  UserCheck, 
  Lock, 
  Unlock,
  ExternalLink,
  FileCheck2
} from 'lucide-react';
import { UserRole } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const { navigate, pendingVendors } = useApp();
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserModal, setSelectedUserModal] = useState<any | null>(null);

  // Mock enterprise users list
  const [usersList, setUsersList] = useState([
    {
      id: 'USER-001',
      fullName: 'Nguyễn Văn An',
      email: 'an.nguyen@vinasmart.vn',
      phone: '0901234567',
      role: 'BUYER' as UserRole,
      company: {
        companyName: 'Công ty Cổ phần VinaSmart Logistics',
        mst: '0108991234',
        industry: 'Vận tải & Kho bãi (Logistics)',
        employeeCount: 65,
        size: 'SME',
        province: 'Hà Nội',
        kycStatus: 'approved'
      },
      createdAt: '15/01/2026',
      isLocked: false
    },
    {
      id: 'USER-002',
      fullName: 'Trần Thị Mai',
      email: 'mai.tran@fpt-is.com.vn',
      phone: '0912345678',
      role: 'VENDOR' as UserRole,
      company: {
        companyName: 'Công ty TNHH Hệ thống Thông tin FPT (FPT IS)',
        mst: '0101238910',
        industry: 'Công nghệ thông tin & Viễn thông',
        employeeCount: 2500,
        size: 'LARGE',
        province: 'Hà Nội',
        kycStatus: 'approved'
      },
      createdAt: '10/01/2026',
      isLocked: false
    },
    {
      id: 'USER-003',
      fullName: 'Lê Hoàng Long',
      email: 'long.le@mekongtech.vn',
      phone: '0988776655',
      role: 'VENDOR' as UserRole,
      company: {
        companyName: 'Công ty TNHH Công nghệ Số Mekong Tech',
        mst: '0315889922',
        industry: 'Công nghệ thông tin',
        employeeCount: 45,
        size: 'SME',
        province: 'TP. Hồ Chí Minh',
        kycStatus: 'pending'
      },
      createdAt: '08/02/2026',
      isLocked: false
    },
    {
      id: 'USER-004',
      fullName: 'Phạm Quốc Cường',
      email: 'cuong.pham@vietmaymfg.vn',
      phone: '0977112233',
      role: 'BUYER' as UserRole,
      company: {
        companyName: 'Công ty May mặc Xuất khẩu Việt Long',
        mst: '0309876543',
        industry: 'Dệt may & Da giày',
        employeeCount: 320,
        size: 'LARGE',
        province: 'Bình Dương',
        kycStatus: 'approved'
      },
      createdAt: '22/02/2026',
      isLocked: false
    },
    {
      id: 'USER-005',
      fullName: 'Trần Ban Quản Trị',
      email: 'admin.dbi@mic.gov.vn',
      phone: '02439998888',
      role: 'ADMIN' as UserRole,
      company: {
        companyName: 'Cục Chuyển đổi số Quốc gia - Bộ TT&TT',
        mst: '0100000001',
        industry: 'Cơ quan Quản lý Nhà nước',
        employeeCount: 120,
        size: 'LARGE',
        province: 'Hà Nội',
        kycStatus: 'approved'
      },
      createdAt: '01/01/2026',
      isLocked: false
    }
  ]);

  const toggleLock = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isLocked: !u.isLocked } : u));
  };

  const filtered = usersList.filter(u => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const txt = (u.fullName + u.email + u.company.companyName + u.company.mst).toLowerCase();
      if (!txt.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-purple-700 transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Bảng điều khiển Admin</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            <span>Quản lý Tài khoản Doanh nghiệp & Phân quyền Hệ thống</span>
          </h1>
          <p className="text-xs text-slate-500">
            Danh bạ các doanh nghiệp tham gia khảo sát DBI và các đơn vị cung cấp giải pháp công nghệ đã xác thực MST.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Tổng số tài khoản</div>
          <div className="text-2xl font-extrabold text-slate-900">{usersList.length}</div>
          <div className="text-[11px] text-teal-600 font-semibold">100% tài khoản đã định danh</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Doanh nghiệp Mua (Buyer)</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {usersList.filter(u => u.role === 'BUYER').length}
          </div>
          <div className="text-[11px] text-teal-600 font-semibold">Khảo sát & nhận đề xuất DBI</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Nhà cung cấp (Vendor)</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {usersList.filter(u => u.role === 'VENDOR').length}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold">Đối soát GPKD & SLA 24h</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Quản trị viên (Admin)</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {usersList.filter(u => u.role === 'ADMIN').length}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold">Bộ TT&TT & Cục Chuyển đổi số</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              roleFilter === 'ALL' ? 'bg-purple-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả vai trò ({usersList.length})
          </button>
          <button
            onClick={() => setRoleFilter('BUYER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              roleFilter === 'BUYER' ? 'bg-teal-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Doanh nghiệp Mua (Buyer)
          </button>
          <button
            onClick={() => setRoleFilter('VENDOR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              roleFilter === 'VENDOR' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Nhà cung cấp (Vendor)
          </button>
          <button
            onClick={() => setRoleFilter('ADMIN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              roleFilter === 'ADMIN' ? 'bg-purple-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Quản trị viên (Admin)
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo MST, Tên công ty, Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3">Doanh nghiệp & MST</th>
              <th className="p-3">Người đại diện</th>
              <th className="p-3">Vai trò</th>
              <th className="p-3">Quy mô & Ngành</th>
              <th className="p-3 text-center">Trạng thái KYC</th>
              <th className="p-3 text-center">Tài khoản</th>
              <th className="p-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="p-3">
                  <div className="font-extrabold text-slate-900">{user.company.companyName}</div>
                  <div className="text-[11px] text-slate-500 font-mono">MST: {user.company.mst} • Tỉnh: {user.company.province}</div>
                </td>
                <td className="p-3">
                  <div className="font-semibold text-slate-800">{user.fullName}</div>
                  <div className="text-[11px] text-slate-500">{user.email} • {user.phone}</div>
                </td>
                <td className="p-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                    user.role === 'BUYER' ? 'bg-teal-100 text-teal-800' :
                    user.role === 'VENDOR' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {user.role === 'BUYER' ? 'BUYER' : user.role === 'VENDOR' ? 'VENDOR' : 'ADMIN'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="font-medium text-slate-800">{user.company.industry}</div>
                  <div className="text-[11px] text-slate-500">{user.company.size} ({user.company.employeeCount} nhân sự)</div>
                </td>
                <td className="p-3 text-center">
                  {user.company.kycStatus === 'approved' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã xác thực</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Chờ duyệt KYC</span>
                    </span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {user.isLocked ? (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Đã khóa
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Hoạt động
                    </span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleLock(user.id)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      title={user.isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                    >
                      {user.isLocked ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-slate-500" />}
                    </button>
                    <button
                      onClick={() => setSelectedUserModal(user)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
                    >
                      Chi tiết
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {selectedUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-purple-600" />
                <span>Hồ sơ Doanh nghiệp Chi tiết</span>
              </h3>
              <button 
                onClick={() => setSelectedUserModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-[11px] text-slate-400 font-bold uppercase">Tên Doanh nghiệp</div>
                <div className="text-sm font-bold text-slate-900">{selectedUserModal.company.companyName}</div>
                <div className="text-slate-500">Mã số thuế: <strong>{selectedUserModal.company.mst}</strong></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Người đại diện</span>
                  <span className="font-bold text-slate-800">{selectedUserModal.fullName}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Số điện thoại</span>
                  <span className="font-bold text-slate-800">{selectedUserModal.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Quy mô</span>
                  <span className="font-bold text-slate-800">{selectedUserModal.company.size} ({selectedUserModal.company.employeeCount} nhân sự)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Địa bàn</span>
                  <span className="font-bold text-slate-800">{selectedUserModal.company.province}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Xác thực dữ liệu Doanh nghiệp</span>
                </div>
                <p className="text-[11px] opacity-80 mt-0.5">
                  Thông tin MST đã khớp nối hợp lệ với Cổng Thông tin Quốc gia về Đăng ký Doanh nghiệp.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUserModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
