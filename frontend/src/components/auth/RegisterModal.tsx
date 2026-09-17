import React, { useState } from 'react';
import { registerUser } from '../../services/apiService';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'BUYER' | 'VENDOR';
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, defaultRole = 'BUYER' }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự!');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      const res = await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      if (res.success) {
        setSuccess('Đăng ký tài khoản thành công!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(res.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError('Không thể kết nối đến Backend Java!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
        {/* Nút đóng Modal */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Tạo tài khoản POLYMATCH</h2>

        {error && <div className="p-3 mb-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}
        {success && <div className="p-3 mb-3 bg-green-100 text-green-600 rounded-lg text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Vai trò đăng ký</label>
            <select 
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value as 'BUYER' | 'VENDOR'})}
              className="w-full border px-3 py-2 rounded-lg bg-slate-50 border-slate-300 focus:ring-2 focus:ring-teal-500"
            >
              <option value="BUYER">Doanh nghiệp Mua (Buyer)</option>
              <option value="VENDOR">Nhà cung cấp Công nghệ (Vendor)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Họ và tên</label>
            <input 
              type="text" required
              placeholder="Nguyễn Văn A"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 border-slate-300"
              onChange={e => setFormData({...formData, fullName: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Địa chỉ Email</label>
            <input 
              type="email" required
              placeholder="name@company.com"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 border-slate-300"
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Mật khẩu</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} required
                placeholder="••••••••"
                className="w-full border px-3 py-2 rounded-lg pr-10 focus:ring-2 focus:ring-teal-500 border-slate-300"
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-xs text-gray-500 font-medium"
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Xác nhận mật khẩu</label>
            <input 
              type="password" required
              placeholder="••••••••"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 border-slate-300"
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-teal-600 text-white py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition shadow-md mt-2"
          >
            Đăng ký tài khoản
          </button>
        </form>
      </div>
    </div>
  );
};