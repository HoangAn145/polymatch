import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { navigate } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Khôi phục Mật khẩu</h2>
          <p className="text-xs text-slate-500">
            Nhập email hoặc số điện thoại đã đăng ký để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-800">
              Đã gửi hướng dẫn khôi phục!
            </div>
            <p className="text-xs text-slate-500">
              Vui lòng kiểm tra hộp thư đến của <strong>{email}</strong> và làm theo hướng dẫn để thiết lập lại mật khẩu.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
            >
              Quay lại trang Đăng nhập
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email doanh nghiệp đã đăng ký
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="ceo@doanhnghiep.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-600"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Gửi liên kết khôi phục</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Đăng nhập</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
