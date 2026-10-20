import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  ShieldCheck,
  Target,
  Compass,
  CheckCircle2,
  Users,
  Award,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="primary">Về dự án POLYMATCH</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Nền tảng đánh giá mức độ trưởng thành số & kết nối giải pháp logistics
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Được phát triển với sứ mệnh hỗ trợ doanh nghiệp vừa và nhỏ trong chuỗi cung ứng logistics Việt Nam chuyển đổi số thực chất, giảm chi phí vận hành và phát triển bền vững.
        </p>
      </div>

      {/* Slogan & Core Vision */}
      <div className="bg-gradient-to-r from-[#1769AA] to-[#104D80] rounded-2xl p-8 sm:p-10 text-white text-center space-y-4 shadow-lg">
        <div className="text-xs uppercase font-bold tracking-widest text-blue-200">
          Tuyên ngôn định vị
        </div>
        <div className="text-2xl sm:text-3xl font-black">
          “Đánh giá đúng – Kết nối trúng – Chuyển đổi nhanh”
        </div>
        <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
          Chuyển đổi số không phải là mua sắm thật nhiều phần mềm đắt đỏ, mà là giải quyết đúng bài toán đang gây nghẽn dòng chảy hàng hóa và lãng phí chi phí vận hành.
        </p>
      </div>

      {/* 3 Pillars of POLYMATCH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1769AA] flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">1. Đánh giá đúng</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kết hợp chỉ số chuyển đổi số doanh nghiệp chung (DBI theo QĐ 2158/QĐ-BTTTT) và chỉ số năng lực logistics đặc thù (LDMI). Giúp doanh nghiệp định vị chính xác vị trí trên bản đồ công nghệ.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">2. Kết nối trúng</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Thuật toán ghép nối 7 thành phần tính toán mức độ tương thích về ngân sách, quy mô và hạ tầng hiện tại. Cam kết nguyên tắc trung lập, không ưu tiên vị trí bằng quảng cáo.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">3. Chuyển đổi nhanh</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Đồng hành cùng doanh nghiệp bằng mạng lưới chuyên gia cố vấn độc lập, bộ chỉ số cơ sở đo lường trước/sau và quy trình quản trị mốc triển khai rõ ràng.
          </p>
        </div>
      </div>

      {/* Neutral Matching Principle Section */}
      <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#1769AA]" />
          <span>Nguyên tắc trung lập & Trách nhiệm xã hội</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          POLYMATCH được xây dựng theo định hướng một cổng thông tin và nền tảng kết nối độc lập. Chúng tôi tuân thủ nghiêm ngặt các quy định:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 pt-2">
          <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Thuật toán chấm điểm hoàn toàn tự động dựa trên công thức toán học minh bạch.</span>
          </div>
          <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Nhà cung cấp trả phí hoặc tài trợ chỉ được gắn nhãn riêng, không làm thay đổi điểm phù hợp.</span>
          </div>
          <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Không tự ý tiết lộ hoặc mua bán dữ liệu chi tiết của doanh nghiệp cho bên thứ ba.</span>
          </div>
          <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Đồng hành cùng các hiệp hội ngành hàng nhằm thúc đẩy phát triển chuỗi cung ứng xanh.</span>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <Link to="/quick-scan">
          <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Trải nghiệm Quick Scan ngay (2 phút)
          </Button>
        </Link>
      </div>
    </div>
  );
};
