import React, { useState } from 'react';
import { lookupTaxCode } from '../../services/apiService';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Search,
  CheckCircle,
  FileText,
  Upload,
  Copyright
} from 'lucide-react';
import { VIETNAM_INDUSTRIES, VIETNAM_PROVINCES } from '../../data/mockData';
import { EnterpriseSize } from '../../types';

export const CompanyOnboardingPage: React.FC = () => {
  const { currentUser, setCurrentUser, navigate } = useApp();
  const isVendor = currentUser.role === 'VENDOR';

  const [companyName, setCompanyName] = useState(currentUser.company.companyName || '');
  const [mst, setMst] = useState(currentUser.company.mst || '');
  const [industry, setIndustry] = useState(currentUser.company.industry || VIETNAM_INDUSTRIES[0]);
  const [employeeCount, setEmployeeCount] = useState<number>(currentUser.company.employeeCount || 60);
  const [province, setProvince] = useState(currentUser.company.province || 'Hà Nội');
  const [website, setWebsite] = useState(currentUser.company.website || '');
  const [representative, setRepresentative] = useState(currentUser.fullName || '');
  const [licenseUploaded, setLicenseUploaded] = useState(false);
  const [ipCertificateUploaded, setIpCertificateUploaded] = useState(false);
  const [taxLookupSuccess, setTaxLookupSuccess] = useState(false);
  const [isCheckingTax, setIsCheckingTax] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-infer SME vs. Large Enterprise
  const inferredSize: EnterpriseSize = employeeCount >= 200 ? 'LARGE' : 'SME';

  // Strict Tax ID (MST) validation regex
  const validateMst = (taxId: string): boolean => {
    const mstRegex = /^[0-9]{10}(-[0-9]{3})?$/;
    return mstRegex.test(taxId.trim());
  };

  // Hàm tra cứu MST thực tế qua API XInvoice
  const handleTaxLookup = async (taxCode: string) => {
    const cleanTaxCode = taxCode.trim();
    if (!cleanTaxCode) {
      setErrorMsg('Vui lòng nhập Mã số thuế (MST) để tra cứu.');
      setTaxLookupSuccess(false);
      return;
    }

    if (!validateMst(cleanTaxCode)) {
      setErrorMsg('Mã số thuế không hợp lệ! MST chuẩn gồm 10 chữ số hoặc 13 chữ số (ví dụ: 0101234567 hoặc 0101234567-001).');
      setTaxLookupSuccess(false);
      return;
    }

    setIsCheckingTax(true);
    setErrorMsg('');

    try {
      const res = await lookupTaxCode(cleanTaxCode);
      if (res && res.valid) {
        setTaxLookupSuccess(true);
        if (res.companyName) {
          setCompanyName(res.companyName);
        }
      } else {
        setTaxLookupSuccess(false);
        setErrorMsg('MST không tồn tại');
        setCompanyName('');
      }
    } catch (err) {
      setTaxLookupSuccess(false);
      setErrorMsg('MST không tồn tại');
    } finally {
      setIsCheckingTax(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mst.trim()) {
      setErrorMsg('Mã số thuế (MST) là trường bắt buộc.');
      return;
    }
    if (!validateMst(mst)) {
      setErrorMsg('Mã số thuế không hợp lệ! MST phải gồm 10 chữ số hoặc 13 chữ số có dấu gạch.');
      return;
    }
    if (!companyName.trim()) {
      setErrorMsg('Tên doanh nghiệp không được để trống.');
      return;
    }

    if (isVendor && !licenseUploaded) {
      setErrorMsg('Doanh nghiệp bán công nghệ (Vendor) bắt buộc phải tải lên Giấy phép ĐKKD (GPKD).');
      return;
    }

    // Update currentUser state
    const updatedUser = {
      ...currentUser,
      fullName: representative || currentUser.fullName,
      company: {
        ...currentUser.company,
        companyName,
        mst,
        industry,
        employeeCount,
        size: inferredSize,
        province,
        website,
        representative,
        verifiedTax: taxLookupSuccess,
        licenseFile: isVendor ? 'GPKD_XacThuc_SLA.pdf' : undefined,
        intellectualPropertyFile: ipCertificateUploaded ? 'Giay_Chung_Nhan_Dang_Ky_Quyen_SHTT_PhanMem.pdf' : undefined,
        kycStatus: isVendor ? ('pending' as const) : ('approved' as const),
        submittedAt: new Date().toISOString()
      }
    };

    setCurrentUser(updatedUser);

    if (isVendor) {
      navigate('/vendor');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
        <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Xác thực định danh doanh nghiệp</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {isVendor ? 'Hồ sơ Nhà cung cấp Công nghệ (Vendor KYC)' : 'Thông tin Doanh nghiệp tham gia Đánh giá DBI'}
            </h2>
            <p className="text-xs text-slate-500">
              {isVendor 
                ? 'Thông tin xác minh pháp lý với Tổng cục Thuế để đăng tin giải pháp trên Sàn B2B (SLA duyệt: 24h).' 
                : 'Thông tin quy mô và ngành nghề dùng để chuẩn hóa tiêu chí đánh giá và tính điểm chuẩn ngành.'}
            </p>
          </div>

          <div className="shrink-0 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <span className="text-[11px] text-slate-500 font-semibold block">Vai trò kích hoạt:</span>
            <strong className={`text-xs font-extrabold ${isVendor ? 'text-blue-700' : 'text-teal-700'}`}>
              {isVendor ? 'Tech Vendor (Bán công nghệ)' : 'Tech Buyer (Mua công nghệ)'}
            </strong>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: MST Lookup & Verification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mã số thuế (MST Doanh nghiệp) <span className="text-rose-500">* (Bắt buộc kiểm tra định dạng)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nhập 10 hoặc 13 chữ số (VD: 0108967845)..."
                  value={mst}
                  onChange={(e) => {
                    setMst(e.target.value);
                    setTaxLookupSuccess(false);
                    if (errorMsg) setErrorMsg('');
                  }}
                  onBlur={() => handleTaxLookup(mst)}
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none bg-white ${
                    errorMsg ? 'border-rose-500 bg-rose-50' : 'border-slate-300 focus:border-teal-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleTaxLookup(mst)}
                  disabled={isCheckingTax}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 disabled:bg-slate-400"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isCheckingTax ? 'Đang tra...' : 'Tra cứu Thuế'}</span>
                </button>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Hệ thống tự động liên thông kiểm tra tình trạng nộp thuế qua Cổng Dịch vụ công XInvoice.
              </span>
            </div>

            <div className="flex flex-col justify-center border-l border-slate-200 pl-4">
              <span className="text-[11px] text-slate-500 font-semibold mb-1">Trạng thái MST:</span>
              {isCheckingTax ? (
                <div className="text-xs text-teal-700 font-semibold bg-teal-50 px-2.5 py-1 rounded-md animate-pulse">
                  Đang kiểm tra API...
                </div>
              ) : taxLookupSuccess ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md">
                  <CheckCircle className="w-4 h-4" /> Đang hoạt động hợp lệ
                </div>
              ) : (
                <div className="text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Chờ tra cứu / Xác thực
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Company Name & Representative */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên Doanh nghiệp đầy đủ theo ĐKKD <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Tên công ty sẽ tự động điền khi tra cứu MST..."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Người đại diện pháp luật / Đầu mối liên hệ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Họ và tên đại diện..."
                value={representative}
                onChange={(e) => setRepresentative(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* Row 3: Industry & Employee Count */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lĩnh vực / Ngành nghề hoạt động <span className="text-rose-500">*</span>
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-teal-600 bg-white"
              >
                {VIETNAM_INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số lượng nhân sự chính thức <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={50000}
                required
                value={employeeCount}
                onChange={(e) => setEmployeeCount(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phân loại quy mô tự động
              </label>
              <div className="h-10 px-4 rounded-xl bg-slate-100 flex items-center justify-between border border-slate-200">
                <span className="text-xs font-extrabold text-slate-800">
                  {inferredSize === 'SME' ? 'Doanh nghiệp Vừa & Nhỏ (SME)' : 'Doanh nghiệp Lớn (Large Enterprise)'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${inferredSize === 'SME' ? 'bg-teal-100 text-teal-800' : 'bg-purple-100 text-purple-800'}`}>
                  {inferredSize}
                </span>
              </div>
            </div>
          </div>

          {/* Row 4: Province & Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tỉnh / Thành phố trụ sở chính <span className="text-rose-500">*</span>
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-teal-600 bg-white"
              >
                {VIETNAM_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Website công ty (nếu có)
              </label>
              <input
                type="url"
                placeholder="https://doanhnghiep.vn"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* Vendor Specific Uploads */}
          {isVendor && (
            <>
              <div className="p-5 rounded-2xl bg-blue-50/60 border-2 border-dashed border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-700" />
                    <h4 className="text-sm font-bold text-blue-950">
                      Tải lên Giấy chứng nhận Đăng ký Kinh doanh (GPKD) <span className="text-rose-500">*</span>
                    </h4>
                  </div>
                  {licenseUploaded && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Đã tải lên file: GPKD_BanChinh_Scan.pdf
                    </span>
                  )}
                </div>

                <p className="text-xs text-blue-900/80">
                  Định dạng hỗ trợ: PDF, JPG, PNG (tối đa 15MB). Ban Quản trị cam kết thẩm định và phê duyệt tài khoản trong vòng <strong>24 giờ làm việc</strong> (SLA 24h).
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setLicenseUploaded(true)}
                    className="px-4 py-2 bg-white hover:bg-blue-50 text-blue-800 border border-blue-300 rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Chọn tệp GPKD từ máy tính</span>
                  </button>
                  <span className="text-[11px] text-slate-500">
                    {licenseUploaded ? 'Tệp đã sẵn sàng kiểm duyệt' : 'Chưa chọn tệp'}
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/60 border-2 border-dashed border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Copyright className="w-5 h-5 text-purple-700" />
                    <h4 className="text-sm font-bold text-purple-950">
                      Tải lên Giấy Đăng ký Quyền sở hữu trí tuệ (SHTT / Bản quyền phần mềm)
                    </h4>
                  </div>
                  {ipCertificateUploaded && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Đã tải lên file: Giay_Chung_Nhan_Dang_Ky_Quyen_SHTT.pdf
                    </span>
                  )}
                </div>

                <p className="text-xs text-purple-950/80">
                  Giấy chứng nhận đăng ký quyền tác giả, nhãn hiệu hoặc bằng độc quyền giải pháp hữu ích cấp bởi <strong>Cục Sở hữu trí tuệ / Cục Bản quyền tác giả</strong>.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIpCertificateUploaded(true)}
                    className="px-4 py-2 bg-white hover:bg-purple-50 text-purple-800 border border-purple-300 rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{ipCertificateUploaded ? 'Thay đổi tệp SHTT' : 'Chọn tệp Giấy đăng ký quyền SHTT (.pdf, .jpg)'}</span>
                  </button>
                  <span className="text-[11px] text-slate-500">
                    {ipCertificateUploaded ? 'Tệp SHTT đã sẵn sàng gửi thẩm định' : 'Không bắt buộc (Khuyến khích để tăng độ tin cậy)'}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Submit CTA */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{isVendor ? 'Nộp hồ sơ Nhà cung cấp & Vào Dashboard' : 'Hoàn tất & Chuyển tới Bảng điều khiển'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};