import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Percent,
  CreditCard,
  Mail,
  Save,
  CheckCircle2,
  Database,
  RotateCcw
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { dbService } from '../../services/mockDatabase';

export const AdminConfigPage: React.FC = () => {
  const [tier1, setTier1] = useState(5);
  const [tier2, setTier2] = useState(4);
  const [tier3, setTier3] = useState(3);
  const [sellerFee, setSellerFee] = useState(6000000);
  const [adminEmail, setAdminEmail] = useState('hotro@polymatch.vn');
  const [autoVerifyTax, setAutoVerifyTax] = useState(true);
  const toast = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.addAuditLog({
      adminId: 'usr-admin-01',
      adminName: 'Quản trị viên POLYMATCH',
      hanh_dong: 'CAP_NHAT_CAU_HINH',
      doi_tuong: 'system_config',
      doi_tuong_id: 'config-main',
      mo_ta: 'Lưu thay đổi tham số hoa hồng và phí thường niên'
    });
    toast.success("Đã lưu cấu hình hệ thống", "Các tham số nền tảng đã được đồng bộ thành công.");
  };

  const handleResetData = () => {
    if (confirm("Khôi phục toàn bộ dữ liệu mẫu ban đầu của POLYMATCH? Thao tác này sẽ đặt lại kho dữ liệu demo.")) {
      dbService.resetToSeed();
      toast.success("Đã làm mới dữ liệu", "Hệ thống đã phục hồi trạng thái mẫu ban đầu.");
      setTimeout(() => window.location.reload(), 800);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#1769AA]" />
          Cấu hình tham số vận hành nền tảng
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Thiết lập tỷ lệ hoa hồng thương mại, chính sách thu phí thành viên và cơ chế thẩm định
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Commission Tiers */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Percent className="w-4 h-4 text-[#1769AA]" />
            Khung tỷ lệ hoa hồng giao dịch thành công (Theo VNYTL)
          </h2>
          <p className="text-xs text-slate-500">
            Tỷ lệ hoa hồng sàn trích thu trên giá trị hợp đồng khi Buyer và Seller hoàn tất nghiệm thu
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Hợp đồng dưới 500 triệu:</span>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={tier1}
                  onChange={e => setTier1(Number(e.target.value))}
                  className="w-20 px-3 py-1.5 border border-slate-200 rounded-md font-bold text-slate-900 bg-white"
                  min="0"
                  max="20"
                />
                <span className="font-bold text-slate-600">%</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Hợp đồng 500 triệu - 2 tỷ:</span>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={tier2}
                  onChange={e => setTier2(Number(e.target.value))}
                  className="w-20 px-3 py-1.5 border border-slate-200 rounded-md font-bold text-slate-900 bg-white"
                  min="0"
                  max="20"
                />
                <span className="font-bold text-slate-600">%</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Hợp đồng trên 2 tỷ:</span>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={tier3}
                  onChange={e => setTier3(Number(e.target.value))}
                  className="w-20 px-3 py-1.5 border border-slate-200 rounded-md font-bold text-slate-900 bg-white"
                  min="0"
                  max="20"
                />
                <span className="font-bold text-slate-600">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Subscription Fee */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Phí duy trì gian hàng Nhà cung cấp (Seller Subscription)
          </h2>
          <div className="max-w-md text-xs">
            <label className="block font-bold text-slate-700 mb-1">
              Phí thường niên mỗi năm (VNĐ):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={sellerFee}
                onChange={e => setSellerFee(Number(e.target.value))}
                step="500000"
                className="w-48 px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-900 bg-white"
              />
              <span className="text-slate-500 font-medium">đ/năm (Mặc định 6.000.000 đ)</span>
            </div>
          </div>
        </div>

        {/* Security & Reset */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-600" />
            Khôi phục môi trường demo
          </h2>
          <p className="text-xs text-slate-500">
            Đặt lại toàn bộ dữ liệu mẫu (Doanh nghiệp, Nhà cung cấp, Báo giá, Hợp đồng) về trạng thái mặc định
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetData}
            className="text-rose-600 border-rose-200 hover:bg-rose-50"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Khôi phục dữ liệu gốc mẫu
          </Button>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="primary" type="submit">
            <Save className="w-4 h-4 mr-1.5" />
            Lưu tất cả thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
};
