import React from 'react';
import { Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { navigate, currentUser } = useApp();

  const handleProtectedNav = (path: string, noticeText: string) => {
    if (currentUser.role === 'GUEST') {
      sessionStorage.setItem('dbi_login_notice', noticeText);
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Portal Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-white font-black text-lg cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center text-sm font-extrabold shrink-0">
                DBI
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight leading-none text-white">
                  POLY<span className="text-teal-400">MATCH</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal mt-0.5 leading-none">
                  Nền tảng DBI & B2B Match
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: 6 Trụ cột DBI */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">6 Trụ cột Đánh giá</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-teal-400 cursor-pointer" onClick={() => handleProtectedNav('/assessment/intro', 'Vui lòng đăng nhập để tham gia khảo sát đánh giá DBI.')}>1. Trải nghiệm khách hàng</li>
              <li className="hover:text-teal-400 cursor-pointer" onClick={() => handleProtectedNav('/assessment/intro', 'Vui lòng đăng nhập để tham gia khảo sát đánh giá DBI.')}>2. Chiến lược Chuyển đổi số</li>
              <li className="hover:text-teal-400 cursor-pointer" onClick={() => handleProtectedNav('/assessment/intro', 'Vui lòng đăng nhập để tham gia khảo sát đánh giá DBI.')}>3. Hạ tầng & Công nghệ số</li>
              <li className="hover:text-teal-400 cursor-pointer" onClick={() => handleProtectedNav('/assessment/intro', 'Vui lòng đăng nhập để tham gia khảo sát đánh giá DBI.')}>4. Vận hành & Quy trình số</li>
              <li className="hover:text-teal-400 cursor-pointer" onClick={() => handleProtectedNav('/assessment/intro', 'Vui lòng đăng nhập để tham gia khảo sát đánh giá DBI.')}>5. Dữ liệu & An toàn thông tin</li>
              <li className="hover:text-teal-400 cursor-pointer" onClick={() => handleProtectedNav('/assessment/intro', 'Vui lòng đăng nhập để tham gia khảo sát đánh giá DBI.')}>6. Con người & Văn hóa số</li>
            </ul>
          </div>

          {/* Col 3: Sàn Công nghệ B2B */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Sàn Công nghệ B2B</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-teal-400 cursor-pointer" onClick={() => handleProtectedNav('/assessment/active/recommendations', 'Vui lòng đăng nhập để xem giải pháp số hóa trên sàn B2B.')}>Giải pháp ERP & Kế toán số</li>
              <li className="hover:text-teal-400 cursor-pointer" onClick={() => handleProtectedNav('/assessment/active/recommendations', 'Vui lòng đăng nhập để xem giải pháp số hóa trên sàn B2B.')}>CRM & Chăm sóc khách hàng tự động</li>
              <li className="hover:text-teal-400 cursor-pointer" onClick={() => handleProtectedNav('/assessment/active/recommendations', 'Vui lòng đăng nhập để xem giải pháp số hóa trên sàn B2B.')}>Quản lý Kho WMS & Barcode</li>
              <li className="hover:text-teal-400 cursor-pointer" onClick={() => handleProtectedNav('/assessment/active/recommendations', 'Vui lòng đăng nhập để xem giải pháp số hóa trên sàn B2B.')}>An toàn thông tin & Chống Ransomware</li>
              <li className="hover:text-teal-400 cursor-pointer" onClick={() => handleProtectedNav('/tech/compare', 'Vui lòng đăng nhập để sử dụng tính năng So sánh Giải pháp Công nghệ.')}>So sánh giải pháp công nghệ</li>
              <li className="hover:text-teal-400 cursor-pointer" onClick={() => navigate('/register/role')}>Đăng ký làm Nhà cung cấp (Vendor)</li>
            </ul>
          </div>

          {/* Col 4: Liên hệ & Hỗ trợ */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Bộ phận Hỗ trợ Doanh nghiệp</h4>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <span>hotro@dbi-portal.gov.vn</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-end items-center gap-4 text-[11px] text-slate-500">
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Chính sách Bảo mật Dữ liệu</span>
            <span className="hover:text-slate-400 cursor-pointer">Quy chế Hoạt động Sàn B2B</span>
            <span className="hover:text-slate-400 cursor-pointer">Tiêu chuẩn Kỹ thuật Khung DBI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
