import React, { useState } from 'react';
import { storage, AuditLog, UserProfile, RfqRecord } from '../lib/storage';
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Layers, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Mail, 
  CreditCard, 
  FileText,
  Clock,
  Sparkles,
  Link2,
  TrendingUp,
  Building2
} from 'lucide-react';

interface AdminPortalProps {
  currentUser: UserProfile;
  onRefresh: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'kpis' | 'vendors' | 'concierge' | 'config' | 'audit'>('kpis');
  const [feeActive, setFeeActive] = useState<boolean>(storage.isFeeActive());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(storage.getAuditLogs());

  // Manual top-up
  const [topupVendorId, setTopupVendorId] = useState('usr-vendor-01');
  const [topupAmount, setTopupAmount] = useState('2.0');
  const [topupNote, setTopupNote] = useState('Nạp tiền mặt chuyển khoản ngân hàng Techcombank');

  // Concierge Invite Generator
  const [inviteRfqId, setInviteRfqId] = useState<string>('rfq-01');
  const [inviteVendorName, setInviteVendorName] = useState('Sota Solutions');
  const [inviteVendorEmail, setInviteVendorEmail] = useState('contact@sota-solutions.com');
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);

  const rfqs = storage.getRfqs();
  const vendorApps = storage.getVendorApplications();

  const handleToggleFee = (val: boolean) => {
    storage.setFeeActive(val, currentUser.email);
    setFeeActive(val);
    setAuditLogs(storage.getAuditLogs());
    onRefresh();
  };

  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topupAmount);
    if (isNaN(amount) || amount <= 0) return;

    storage.topupCredits(topupVendorId, amount, topupNote);
    alert(`Đã cộng ${amount} triệu tín chỉ vào ví nhà cung cấp ${topupVendorId}!`);
    setAuditLogs(storage.getAuditLogs());
    onRefresh();
  };

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const inviteCode = `INV-${Date.now().toString(36).toUpperCase()}`;
    const link = `https://polymatch.vn/register?role=vendor&rfq=${inviteRfqId}&code=${inviteCode}`;
    setGeneratedInviteLink(link);
    storage.addAuditLog(currentUser.email, 'CONCIERGE_INVITE', `Gửi thư mời Concierge tới ${inviteVendorName} (${inviteVendorEmail}) cho hồ sơ ${inviteRfqId} mã ${inviteCode}`);
    setAuditLogs(storage.getAuditLogs());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider font-mono">
            POLYMATCH ADMIN CONSOLE · PHÂN QUYỀN TOÀN QUYỀN
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Bảng điều hành Hệ thống & Chỉ tiêu Pilot (M31.01)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản trị quy tắc nghiệp vụ R01–R27 · Duyệt nhà cung cấp SLA 24h · Hàng đợi Concierge
          </p>
        </div>

        {/* Global Fee Switch Status (M19.05, R18) */}
        <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-xs">
            <span className="text-slate-500 block text-[11px]">Công tắc thu phí toàn hệ thống (R18):</span>
            <strong className={feeActive ? 'text-emerald-700' : 'text-amber-700'}>
              {feeActive ? 'ĐANG BẬT THU PHÍ' : 'ĐANG TẮT (NĂM 1 PILOT MIỄN PHÍ)'}
            </strong>
          </div>
          <button
            onClick={() => handleToggleFee(!feeActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              feeActive ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {feeActive ? 'Chuyển về Tắt' : 'Bật thu phí'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 text-xs font-bold">
        {[
          { id: 'kpis', label: 'Bảng chỉ số Pilot (M31.01)', icon: BarChart3 },
          { id: 'vendors', label: 'Hàng đợi duyệt NCC (M28.01)', icon: ShieldCheck },
          { id: 'concierge', label: 'Hàng đợi Concierge (M27.01)', icon: Users },
          { id: 'config', label: 'Cấu hình & Nạp ví (M19.02)', icon: Settings },
          { id: 'audit', label: 'Nhật ký Audit Logs (M32.01)', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === tab.id
                  ? 'border-rose-600 text-rose-700 bg-rose-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PILOT KPIS (M31.01) */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold block">Tỷ lệ hoàn thành Quick Scan:</span>
              <div className="text-2xl font-bold font-mono text-slate-900">88.4%</div>
              <p className="text-[10px] text-emerald-600">Đạt chỉ tiêu Pilot (ngưỡng &gt; 70%)</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold block">Chuyển sang Đánh giá đầy đủ:</span>
              <div className="text-2xl font-bold font-mono text-blue-700">32.6%</div>
              <p className="text-[10px] text-blue-600">Chỉ tiêu Pilot (&gt; 25%)</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold block">Tạo yêu cầu báo giá (RFQs):</span>
              <div className="text-2xl font-bold font-mono text-emerald-700">{rfqs.length} hồ sơ</div>
              <p className="text-[10px] text-slate-500">Trung bình 1.8 RFQ / doanh nghiệp</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold block">Thời gian sinh gợi ý (R23):</span>
              <div className="text-2xl font-bold font-mono text-purple-700">&lt; 300 ms</div>
              <p className="text-[10px] text-purple-600">Chỉ tiêu &lt; 1.5 giây đạt 100%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Phân bố mức trưởng thành LDMI theo Pilot (M31.02)
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Mức 1: Thủ công</span>
                    <span className="font-mono font-bold">42%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-slate-500 h-2 rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Mức 2: Số hóa</span>
                    <span className="font-mono font-bold">38%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Mức 3: Tích hợp</span>
                    <span className="font-mono font-bold">14%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '14%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Mức 4: Hiển thị &amp; Mức 5: Thông minh</span>
                    <span className="font-mono font-bold">6%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '6%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Top 3 Khoảng trống xuất hiện nhiều nhất (M31.03)
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900">G-VT-02: Lập tuyến chưa tối ưu</strong>
                    <div className="text-[11px] text-slate-500">Chi phí dầu cao, không tính ràng buộc giờ giao</div>
                  </div>
                  <span className="text-sm font-bold font-mono text-rose-600">68%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900">G-KB-01: Tồn kho không chính xác</strong>
                    <div className="text-[11px] text-slate-500">Kiểm kê lệch, không quản lý theo vị trí kệ</div>
                  </div>
                  <span className="text-sm font-bold font-mono text-rose-600">54%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900">G-XA-01: Chạy rỗng chiều về cao</strong>
                    <div className="text-[11px] text-slate-500">Không đo được tỷ lệ km chạy rỗng</div>
                  </div>
                  <span className="text-sm font-bold font-mono text-rose-600">47%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VENDOR VERIFICATION QUEUE (M28.01) */}
      {activeTab === 'vendors' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Hàng đợi kiểm duyệt Nhà cung cấp công nghệ (Cam kết SLA 24h)
              </h3>
              <p className="text-xs text-slate-500">
                Kiểm tra đối chiếu mã số thuế qua esgoo/xinvoice và giấy phép kinh doanh
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 px-2 py-1 rounded">
              SLA &lt; 24 GIỜ
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Active Mock Vendor Application */}
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="text-sm text-slate-900">Công ty TNHH Sota Solutions</strong>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                    MST: 0316956049 (Hợp lệ R25)
                  </span>
                </div>
                <p className="text-slate-600">
                  Sản phẩm đăng ký: <strong>Sota FMS (Quản lý giao nhận)</strong> · Nhánh phục vụ: FF, 3PL
                </p>
                <div className="text-[11px] text-slate-400">
                  Nộp cách đây 2 giờ · Trạng thái tra cứu: <span className="text-emerald-700 font-medium">Đang hoạt động trên Cổng thông tin Quốc gia</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert('Đã duyệt nhà cung cấp Sota Solutions thành công (M28.01)!')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  ✓ Duyệt hợp tác
                </button>
                <button
                  type="button"
                  onClick={() => alert('Đã gửi yêu cầu bổ sung giấy phép ĐKKD!')}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Yêu cầu bổ sung
                </button>
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="text-sm text-slate-900">Công ty TNHH Giải pháp Logistics Smartlog</strong>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                    MST: 0312144913 (Đã duyệt)
                  </span>
                </div>
                <p className="text-slate-600">
                  Sản phẩm: Smartlog STM, SWM, Control Tower · Nhánh phục vụ: VT, KB, 3PL
                </p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
                Đang hoạt động
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONCIERGE QUEUE (M27.01) */}
      {activeTab === 'concierge' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Hàng đợi Concierge – Kết nối Nhu cầu chưa có Nhà cung cấp khớp (M27.01)
              </h3>
              <p className="text-xs text-slate-500">
                Gửi lời mời đích danh cho các đối tác tham khảo (NEW-01 đến NEW-10) kèm mã theo dõi chuyển đổi
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
              CONCIERGE
            </span>
          </div>

          <form onSubmit={handleGenerateInvite} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 text-sm">
              Tạo thư mời tham gia POLYMATCH kèm nhu cầu cụ thể:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Chọn Hồ sơ nhu cầu</label>
                <select
                  value={inviteRfqId}
                  onChange={(e) => setInviteRfqId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {rfqs.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id} - {r.solutionName} ({r.branch})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Tên nhà cung cấp tiềm năng</label>
                <input
                  type="text"
                  required
                  value={inviteVendorName}
                  onChange={(e) => setInviteVendorName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email gửi thư mời</label>
                <input
                  type="email"
                  required
                  value={inviteVendorEmail}
                  onChange={(e) => setInviteVendorEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg flex items-center gap-1.5"
              >
                <Link2 className="w-3.5 h-3.5" />
                Sinh link mời có mã theo dõi chuyển đổi (M27.03)
              </button>
            </div>

            {generatedInviteLink && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Đã tạo lời mời Concierge thành công!
                </div>
                <div className="font-mono text-[11px] bg-white p-2 rounded border border-emerald-200 select-all overflow-x-auto">
                  {generatedInviteLink}
                </div>
                <p className="text-[11px] text-slate-500">
                  Khi nhà cung cấp đăng ký qua link này, họ sẽ được tự động liên kết với hồ sơ {inviteRfqId} và ghi nguồn đăng ký là moi_concierge (M16.06).
                </p>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 4: CONFIGURATION & TOP-UP (M19.02, M19.05) */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manual Wallet Credit Top-up (M19.02) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Cộng tín chỉ thủ công (Giai đoạn đầu chuyển khoản M19.02)
              </h3>
              <p className="text-xs text-slate-500">
                Ghi nhật ký audit_logs mọi giao dịch nạp tiền của nhà cung cấp
              </p>
            </div>

            <form onSubmit={handleTopup} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Mã nhà cung cấp (Vendor ID)</label>
                <input
                  type="text"
                  required
                  value={topupVendorId}
                  onChange={(e) => setTopupVendorId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Số tín chỉ cộng (Triệu VNĐ)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Lý do &amp; Ghi chú chứng từ ngân hàng</label>
                <input
                  type="text"
                  required
                  value={topupNote}
                  onChange={(e) => setTopupNote(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
              >
                Xác nhận cộng tín chỉ vào ví
              </button>
            </form>
          </div>

          {/* Pricing Config Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Biểu phí mở hồ sơ theo Bậc (R12)
              </h3>
              <p className="text-slate-500">Các tham số lấy trực tiếp từ bảng cấu hình</p>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <strong>Bậc 1: Ngân sách &lt; 20 triệu / năm</strong>
                  <div className="text-[11px] text-slate-500">Phí mở hồ sơ nhu cầu</div>
                </div>
                <span className="font-mono font-bold text-slate-900">0.10 triệu VNĐ</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <strong>Bậc 2: Ngân sách 20 – 100 triệu / năm</strong>
                  <div className="text-[11px] text-slate-500">Phí mở hồ sơ nhu cầu</div>
                </div>
                <span className="font-mono font-bold text-slate-900">0.20 triệu VNĐ</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <strong>Bậc 3: Ngân sách &gt; 100 triệu / năm</strong>
                  <div className="text-[11px] text-slate-500">Phí mở hồ sơ nhu cầu</div>
                </div>
                <span className="font-mono font-bold text-slate-900">0.30 triệu VNĐ</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <strong>Gói thuê bao Chuyên nghiệp</strong>
                  <div className="text-[11px] text-slate-500">Nhận hồ sơ sớm 24h (M20.02)</div>
                </div>
                <span className="font-mono font-bold text-blue-700">2.40 triệu VNĐ/năm</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS (M32.01) */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Nhật ký Hệ thống &amp; Thao tác Quản trị (M32.01)
              </h3>
              <p className="text-xs text-slate-500">
                Ghi nhận ai, lúc nào, đối tượng, giá trị cũ, giá trị mới và lý do
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              AUDIT LOGS
            </span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Thời gian</th>
                  <th className="p-3">Admin</th>
                  <th className="p-3">Hành động</th>
                  <th className="p-3">Chi tiết &amp; Lý do</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-400 font-sans">
                      Chưa có sự kiện nào.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-3 font-semibold text-slate-900">{log.adminEmail}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-xs">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
