import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Save, CheckCircle2, Building2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { Solution } from '../../types';
import { useToast } from '../../components/ui/Toast';

export const SellerNewSolutionPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const seller = dbService.getSellers().find(s => s.userId === currentUser?.id) || dbService.getSellers()[0];

  const [ten, setTen] = useState('');
  const [nhomGiaiPhap, setNhomGiaiPhap] = useState('TMS');
  const [moTa, setMoTa] = useState('');
  const [khoangGiaText, setKhoangGiaText] = useState('Từ 3.000.000đ/tháng');
  const [moHinhChiPhi, setMoHinhChiPhi] = useState<'thue_bao_thang' | 'thue_bao_nam' | 'thiet_bi' | 'du_an' | 'lien_he'>('thue_bao_thang');
  const [mucLdmi, setMucLdmi] = useState<number>(2);
  const [thoiGianTrienKhai, setThoiGianTrienKhai] = useState('2 - 4 tuần');
  const [features, setFeatures] = useState('Lập lệnh điều xe điện tử\nBản đồ định vị GPS thời gian thực\nTính cước và phụ phí tự động');
  const [caseStudy, setCaseStudy] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ten || !moTa) {
      toast.warning("Thiếu thông tin", "Vui lòng nhập tên giải pháp và mô tả chi tiết.");
      return;
    }

    setLoading(true);
    try {
      const newSol: Solution = {
        id: `sol-${Date.now()}`,
        ma: `TECH-${Math.floor(1000 + Math.random() * 9000)}`,
        ten,
        nhom_giai_phap: nhomGiaiPhap,
        hoat_dong_logistics: ["VT"],
        khoang_trong_giai_quyet: ["G-VT-01", "G-VT-02"],
        phan_khuc: ["VT", "3PL"],
        muc_ldmi_phu_hop: mucLdmi,
        quy_mo_phu_hop: ["nho", "vua"],
        khoang_gia_text: khoangGiaText,
        mo_hinh_chi_phi: moHinhChiPhi,
        trang_thai_gia: "cong_khai",
        thoi_gian_trien_khai: thoiGianTrienKhai,
        tich_hop: ["api", "ke_toan"],
        nguon_luc_can: ["Nhân sự phụ trách vận hành"],
        nha_cung_cap_id: seller.id,
        nha_cung_cap_ten: seller.ten,
        trang_thai_nguon: "da_xac_thuc",
        la_tai_tro: false,
        mo_ta: moTa,
        tinh_nang_chinh: features.split('\n').filter(Boolean),
        case_study: caseStudy,
        danh_gia_sao: 5.0,
        so_luot_danh_gia: 1
      };

      dbService.addSolution(newSol);

      dbService.addAuditLog({
        adminId: currentUser?.id || "seller",
        adminName: seller.ten,
        hanh_dong: "DANG_GIAI_PHAP_MOI",
        doi_tuong: "giai_phap",
        doi_tuong_id: newSol.id,
        mo_ta: `Nhà cung cấp ${seller.ten} đã niêm yết giải pháp ${newSol.ten} (${newSol.nhom_giai_phap}).`
      });

      toast.success("Đã đăng tải giải pháp thành công!", "Giải pháp của bạn đã được niêm yết trên Catalog của POLYMATCH.");
      navigate('/seller/solutions');
    } catch {
      toast.error("Không thể lưu giải pháp", "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <Badge variant="primary">Khởi tạo giải pháp mới</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Đăng ký Giải pháp công nghệ lên Catalog
          </h1>
        </div>

        <Link to="/seller/solutions">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Quay lại
          </Button>
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tên giải pháp / Sản phẩm *</label>
              <input
                type="text"
                required
                value={ten}
                onChange={e => setTen(e.target.value)}
                placeholder="Ví dụ: Smartlog STM - Quản lý Vận tải Cloud"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nhóm giải pháp (Danh mục đóng) *</label>
              <select
                value={nhomGiaiPhap}
                onChange={e => setNhomGiaiPhap(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 bg-white"
              >
                <option value="TMS">Quản lý vận tải (TMS)</option>
                <option value="WMS">Quản lý kho (WMS)</option>
                <option value="OMS">Quản lý đơn hàng (OMS)</option>
                <option value="EPOD">Ký nhận điện tử (ePOD)</option>
                <option value="TOI_UU_TUYEN">Tối ưu định tuyến (VRP)</option>
                <option value="GIAO_NHAN">Quản lý giao nhận (FMS)</option>
                <option value="THEO_DOI_LO">Theo dõi container</option>
                <option value="DINH_VI">GPS & Giám sát nhiên liệu</option>
                <option value="DOI_SOAT">Đối soát cước & Hóa đơn</option>
                <option value="PHAT_THAI">Đo phát thải (GLEC)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mô tả tổng quan giải pháp *</label>
            <textarea
              rows={3}
              required
              value={moTa}
              onChange={e => setMoTa(e.target.value)}
              placeholder="Giới thiệu các chức năng cốt lõi, đối tượng khách hàng mục tiêu và giá trị mang lại..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Khoảng giá hiển thị *</label>
              <input
                type="text"
                required
                value={khoangGiaText}
                onChange={e => setKhoangGiaText(e.target.value)}
                placeholder="Từ 3.000.000đ/tháng"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mô hình chi phí</label>
              <select
                value={moHinhChiPhi}
                onChange={e => setMoHinhChiPhi(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 bg-white"
              >
                <option value="thue_bao_thang">Thuê bao tháng (SaaS)</option>
                <option value="thue_bao_nam">Thuê bao năm</option>
                <option value="thiet_bi">Mua thiết bị phần cứng</option>
                <option value="du_an">Theo dự án chuyển giao</option>
                <option value="lien_he">Liên hệ báo giá</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mức LDMI phù hợp *</label>
              <select
                value={mucLdmi}
                onChange={e => setMucLdmi(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 bg-white"
              >
                <option value={1}>Mức 1: Doanh nghiệp thủ công</option>
                <option value={2}>Mức 2: Bắt đầu số hóa</option>
                <option value={3}>Mức 3: Đã có phần mềm cần tích hợp</option>
                <option value={4}>Mức 4: Hiển thị thời gian thực</option>
                <option value={5}>Mức 5: Tối ưu thông minh</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Các tính năng nổi bật (Mỗi tính năng 1 dòng)
            </label>
            <textarea
              rows={4}
              value={features}
              onChange={e => setFeatures(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Kết quả kiểm chứng thực tế (Case study minh họa)
            </label>
            <input
              type="text"
              value={caseStudy}
              onChange={e => setCaseStudy(e.target.value)}
              placeholder="Ví dụ: Giúp doanh nghiệp vận tải ABC giảm 18% chi phí nhiên liệu sau 3 tháng."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Link to="/seller/solutions">
              <Button variant="outline" size="sm" type="button">Hủy bỏ</Button>
            </Link>
            <Button variant="primary" size="sm" type="submit" loading={loading} leftIcon={<Save className="w-4 h-4" />}>
              Lưu & Niêm yết giải pháp
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
