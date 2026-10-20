import React from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
  Building2,
  BadgePercent,
  Clock,
  Users,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const PricingPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="primary" size="md">Bảng giá dịch vụ công khai</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Cơ chế thu phí & Biểu giá dịch vụ POLYMATCH
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Đồng bộ theo khung báo cáo đề án VNYTL 2026. Doanh nghiệp tham gia tự đánh giá cơ bản hoàn toàn miễn phí. Các dịch vụ có thu phí được niêm yết rõ ràng, minh bạch và không phát sinh phí ẩn.
        </p>
      </div>

      {/* Main Pricing Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Khảo sát & Đánh giá cơ bản */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between space-y-5 shadow-xs">
          <div className="space-y-3">
            <Badge variant="success" size="sm">Dành cho Doanh nghiệp</Badge>
            <h3 className="font-bold text-lg text-slate-900">Đánh giá cơ bản & Gợi ý</h3>
            <div className="text-3xl font-black text-emerald-700">
              MIỄN PHÍ
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dành cho mọi doanh nghiệp logistics trong chuỗi cung ứng muốn tự rà soát hiện trạng số hóa.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">✓ Làm bài khảo sát DBI và LDMI</li>
              <li className="flex items-center gap-2">✓ Xem điểm số tổng quan & biểu đồ radar</li>
              <li className="flex items-center gap-2">✓ Nhận diện 3 điểm nghẽn nghiêm trọng nhất</li>
              <li className="flex items-center gap-2">✓ Danh sách giải pháp công nghệ đề xuất</li>
            </ul>
          </div>
          <Link to="/quick-scan">
            <Button variant="outline" size="sm" className="w-full">
              Thực hiện đánh giá ngay
            </Button>
          </Link>
        </div>

        {/* Card 2: Báo cáo chuyên sâu */}
        <div className="bg-white rounded-2xl border border-blue-200 p-6 flex flex-col justify-between space-y-5 shadow-xs bg-gradient-to-b from-blue-50/40 to-white">
          <div className="space-y-3">
            <Badge variant="primary" size="sm">Dành cho Doanh nghiệp</Badge>
            <h3 className="font-bold text-lg text-slate-900">Báo cáo chẩn đoán chuyên sâu</h3>
            <div className="text-3xl font-black text-[#1769AA]">
              700.000 <span className="text-sm font-normal text-slate-500">VNĐ / lần</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tài liệu chẩn đoán chi tiết dạng PDF gồm ma trận phân tích nguyên nhân gốc rễ và bảng so sánh TCO.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">✓ Phân tích chi tiết từng tiêu chí trụ cột</li>
              <li className="flex items-center gap-2">✓ Ma trận đối sánh với các doanh nghiệp cùng quy mô</li>
              <li className="flex items-center gap-2">✓ Bảng danh sách giải pháp & chi phí chi tiết</li>
              <li className="flex items-center gap-2">✓ Xuất file PDF chính thức trình hội đồng quản trị</li>
            </ul>
          </div>
          <Link to="/buyer/reports">
            <Button variant="primary" size="sm" className="w-full">
              Xem mẫu báo cáo chuyên sâu
            </Button>
          </Link>
        </div>

        {/* Card 3: Phí nhà cung cấp */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between space-y-5 shadow-xs">
          <div className="space-y-3">
            <Badge variant="warning" size="sm">Dành cho Nhà cung cấp</Badge>
            <h3 className="font-bold text-lg text-slate-900">Phí tham gia nền tảng</h3>
            <div className="text-3xl font-black text-slate-900">
              6.000.000 <span className="text-sm font-normal text-slate-500">VNĐ / năm</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Quyền lợi niêm yết giải pháp chính thức và tiếp nhận thông tin yêu cầu kết nối từ các doanh nghiệp.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">✓ Xác minh hồ sơ và gắn nhãn Đối tác đã thẩm định</li>
              <li className="flex items-center gap-2">✓ Đăng tải tối đa 5 hồ sơ giải pháp công nghệ</li>
              <li className="flex items-center gap-2">✓ Nhận thông báo nhu cầu kết nối phù hợp ngay lập tức</li>
              <li className="flex items-center gap-2">✓ Quyền gửi báo giá chính thức cho khách hàng</li>
            </ul>
          </div>
          <Link to="/register/seller">
            <Button variant="outline" size="sm" className="w-full">
              Đăng ký Nhà cung cấp
            </Button>
          </Link>
        </div>

        {/* Card 4: Hoa hồng giao dịch */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between space-y-5 shadow-xs">
          <div className="space-y-3">
            <Badge variant="secondary" size="sm">Thu từ Nhà cung cấp</Badge>
            <h3 className="font-bold text-lg text-slate-900">Hoa hồng hợp đồng thành công</h3>
            <div className="text-3xl font-black text-slate-900">
              5% – 10% <span className="text-sm font-normal text-slate-500">giá trị</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Chỉ phát sinh khi hai bên ký kết hợp đồng thương mại thành công từ nguồn kết nối của nền tảng.
            </p>
            <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <div className="flex justify-between p-1.5 rounded bg-slate-50">
                <span>Hợp đồng ≤ 50 triệu:</span>
                <strong className="text-emerald-700">5%</strong>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-slate-50">
                <span>Hợp đồng 50 – 100 triệu:</span>
                <strong className="text-blue-700">8%</strong>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-slate-50">
                <span>Hợp đồng &gt; 100 triệu:</span>
                <strong className="text-indigo-700">10%</strong>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center italic">
            * Đối soát theo điều khoản thỏa thuận và chứng từ thanh toán.
          </div>
        </div>

        {/* Card 5: Tư vấn chuyên gia */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between space-y-5 shadow-xs">
          <div className="space-y-3">
            <Badge variant="primary" size="sm">Dịch vụ Cố vấn</Badge>
            <h3 className="font-bold text-lg text-slate-900">Tư vấn chuyên gia (Basic / Pro)</h3>
            <div className="text-3xl font-black text-[#1769AA]">
              3.0 – 6.5 <span className="text-sm font-normal text-slate-500">triệu VNĐ</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Phiên làm việc 1-1 trực tiếp cùng chuyên gia đầu ngành chuỗi cung ứng.
            </p>
            <div className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <div>
                <strong className="text-slate-900">Gói Basic (3 triệu):</strong> 3 buổi (60-90p) bóc tách điểm nghẽn, thẩm định giải pháp và tiêu chí nghiệm thu.
              </div>
              <div>
                <strong className="text-slate-900">Gói Pro (6.5 triệu):</strong> 5 buổi (60-90p) đồng hành đến khi chạy thử nghiệm và nghiệm thu chỉ số KPI.
              </div>
            </div>
          </div>
          <Link to="/consulting">
            <Button variant="outline" size="sm" className="w-full">
              Khám phá đội ngũ chuyên gia
            </Button>
          </Link>
        </div>

        {/* Card 6: Theo dõi triển khai */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between space-y-5 shadow-xs">
          <div className="space-y-3">
            <Badge variant="secondary" size="sm">Đồng hành Dự án</Badge>
            <h3 className="font-bold text-lg text-slate-900">Theo dõi triển khai & KPI</h3>
            <div className="text-3xl font-black text-slate-900">
              3.0 – 6.5 <span className="text-sm font-normal text-slate-500">triệu VNĐ</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hỗ trợ quản trị các mốc dự án, lập dashboard theo dõi chỉ số trước và sau vận hành.
            </p>
            <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <div className="flex justify-between p-1.5 rounded bg-slate-50">
                <span>Gói 3 tháng:</span>
                <strong>3.000.000 VNĐ</strong>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-slate-50">
                <span>Gói 8 tháng (7+1):</span>
                <strong>5.000.000 VNĐ</strong>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-slate-50">
                <span>Gói 12 tháng (9+3):</span>
                <strong>6.500.000 VNĐ</strong>
              </div>
            </div>
          </div>
          <Link to="/buyer/projects">
            <Button variant="outline" size="sm" className="w-full">
              Xem quy trình quản trị KPI
            </Button>
          </Link>
        </div>
      </div>

      {/* Note about Model Difference from Legacy */}
      <div className="bg-blue-50/70 border border-blue-200 p-6 rounded-2xl text-xs text-slate-700 space-y-2">
        <h4 className="font-bold text-sm text-[#1769AA] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#1769AA]" />
          <span>Cam kết minh bạch về mô hình doanh thu theo VNYTL 2026</span>
        </h4>
        <p className="leading-relaxed">
          Nền tảng POLYMATCH hoạt động theo nguyên tắc dịch vụ giá trị gia tăng và hoa hồng hợp đồng thành công. Nền tảng <strong>không</strong> áp dụng cơ chế bán thông tin liên hệ (lead) bằng ví tín chỉ, không giới hạn số lượt mở hồ sơ mua bán lead như các mô hình cũ. Mọi giao dịch đối soát hoa hồng đều dựa trên hợp đồng thực tế đã ký kết giữa Buyer và Seller.
        </p>
      </div>
    </div>
  );
};
