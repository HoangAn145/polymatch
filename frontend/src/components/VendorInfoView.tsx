import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  Clock, 
  ArrowRight, 
  Users, 
  FileText,
  Lock,
  RefreshCcw,
  Sparkles
} from 'lucide-react';

interface VendorInfoViewProps {
  onRegisterVendor: () => void;
}

export const VendorInfoView: React.FC<VendorInfoViewProps> = ({
  onRegisterVendor,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider font-mono">
          M01.03 · DÀNH CHO NHÀ CUNG CẤP CÔNG NGHỆ LOGISTICS
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Tham gia Mạng lưới Nhà cung cấp đã Xác thực
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Tiếp cận trực tiếp các Doanh nghiệp Logistics tại Việt Nam có nhu cầu số hóa thực tế, đã qua chẩn đoán DBI &amp; LDMI và xác định rõ ngân sách.
        </p>

        <div className="pt-2">
          <button
            onClick={onRegisterVendor}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            Đăng ký Nhà cung cấp ngay
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* COMPARISON TABLE: CHƯA ĐĂNG KÝ (THAM KHẢO) VS ĐÃ XÁC THỰC (M01.03) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 bg-slate-50 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">
            Bảng so sánh Quyền lợi Nhà cung cấp trên POLYMATCH
          </h2>
          <p className="text-xs text-slate-500">
            Quy định chặt chẽ theo R11: Chỉ nhà cung cấp đã xác thực mới được tham gia ghép nối và nhận hồ sơ nhu cầu
          </p>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 font-bold">
                <th className="p-4 w-1/3">Tính năng &amp; Quyền lợi</th>
                <th className="p-4 w-1/3 text-slate-500">Chưa xác thực (Tham khảo R11)</th>
                <th className="p-4 w-1/3 text-emerald-800 bg-emerald-50/50">Đã xác thực MST (Đối tác)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-4 font-semibold">Xuất hiện trong Danh mục giải pháp</td>
                <td className="p-4 text-slate-500">Có (Mục tham khảo độc lập)</td>
                <td className="p-4 text-emerald-700 font-bold bg-emerald-50/30">Có (Ưu tiên danh mục chính)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Hiển thị trong kết quả ghép nối của Người mua</td>
                <td className="p-4 text-rose-500 flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> Bị chặn (R11)
                </td>
                <td className="p-4 text-emerald-700 font-bold bg-emerald-50/30 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tự động ghép theo 7 thành phần
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Nút liên hệ &amp; Tạo yêu cầu báo giá (RFQ)</td>
                <td className="p-4 text-slate-400">Không có (Chỉ gửi qua Concierge)</td>
                <td className="p-4 text-emerald-700 font-bold bg-emerald-50/30">Khách hàng gửi RFQ trực tiếp</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Nhận Hồ sơ nhu cầu ẩn danh khớp dịch vụ</td>
                <td className="p-4 text-slate-400">Không</td>
                <td className="p-4 text-emerald-700 font-bold bg-emerald-50/30">Nhận thông báo qua Email &amp; Zalo</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Mở thông tin liên hệ đầy đủ bằng tín chỉ</td>
                <td className="p-4 text-slate-400">Không áp dụng</td>
                <td className="p-4 text-emerald-700 font-bold bg-emerald-50/30">Mở với trần tối đa 5 NCC (R15)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Chính sách bảo vệ hoàn tín chỉ (R17)</td>
                <td className="p-4 text-slate-400">—</td>
                <td className="p-4 text-emerald-700 font-bold bg-emerald-50/30">Tự động hoàn nếu sai SĐT / Email</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PRICING & TIERS (R12, M20.01) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tier 1: Opening Fee by Budget Tier */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-700" />
            <h3 className="text-base font-bold text-slate-900">
              Biểu phí mở Hồ sơ nhu cầu (Bậc phí R12)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Mô hình thanh toán tại thời điểm trao đổi thông tin liên hệ. Không thu bất kỳ khoản hoa hồng nào theo giá trị hợp đồng (R21).
          </p>

          <div className="space-y-2 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <strong>Bậc 1: Ngân sách &lt; 20 triệu / năm</strong>
                <div className="text-[11px] text-slate-500">Dành cho phần mềm siêu nhỏ / thiết bị lẻ</div>
              </div>
              <span className="font-mono font-bold text-slate-900">100.000 VNĐ / lượt</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <strong>Bậc 2: Ngân sách 20 – 100 triệu / năm</strong>
                <div className="text-[11px] text-slate-500">Phần mềm TMS, WMS chuẩn cho SME</div>
              </div>
              <span className="font-mono font-bold text-slate-900">200.000 VNĐ / lượt</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <strong>Bậc 3: Ngân sách &gt; 100 triệu / năm</strong>
                <div className="text-[11px] text-slate-500">Dự án tích hợp WMS-TMS-ERP quy mô lớn</div>
              </div>
              <span className="font-mono font-bold text-slate-900">300.000 VNĐ / lượt</span>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50 rounded-lg text-[11px] text-emerald-900 border border-emerald-200">
            ★ <strong>Giai đoạn Pilot (Năm 1):</strong> Nền tảng tạm thời tắt thu phí toàn hệ thống (`bieu_phi.dang_bat = false`). Nhà cung cấp được mở hồ sơ hoàn toàn miễn phí (0đ)!
          </div>
        </div>

        {/* Tier 2: Subscription Plans */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              Gói Hội viên Nhà cung cấp (M20.01)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Lựa chọn gói thuê bao phù hợp với chiến lược phát triển kinh doanh
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3.5 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-900">Gói Cơ bản (Miễn phí)</span>
                <span className="text-emerald-700">0 VNĐ</span>
              </div>
              <p className="text-slate-600">Đăng ký thông tin, khai phạm vi phục vụ và nhận hồ sơ nhu cầu theo quy trình thông thường.</p>
            </div>

            <div className="p-3.5 border border-amber-300 bg-amber-50/50 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-amber-950">Gói Chuyên nghiệp</span>
                <span className="text-amber-700 font-mono">2.400.000 VNĐ / năm</span>
              </div>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                <li>✓ <strong>Nhận thông báo hồ sơ sớm hơn 24 giờ</strong> so với gói cơ bản (M20.02)</li>
                <li>✓ Báo cáo phân tích nhu cầu công nghệ theo phân khúc hằng quý (M21.02)</li>
                <li>✓ Ưu tiên hiển thị bài viết chia sẻ chuyên môn trên Logistics Insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 text-center space-y-3">
        <h3 className="text-xl font-bold">
          Sẵn sàng mở rộng tệp khách hàng logistics chất lượng cao?
        </h3>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Quy trình đăng ký nhanh chóng trong 2 phút với kiểm tra mã số thuế tự động (R25). Ban quản trị cam kết xét duyệt hồ sơ trong vòng 24 giờ.
        </p>
        <button
          onClick={onRegisterVendor}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 mt-2"
        >
          Đăng ký đối tác ngay
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
