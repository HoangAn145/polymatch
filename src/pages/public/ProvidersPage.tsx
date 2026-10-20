import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  Search,
  ExternalLink,
  Layers,
  ArrowRight,
  Clock
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { dbService } from '../../services/mockDatabase';

export const ProvidersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const sellers = dbService.getSellers();

  const filtered = sellers.filter(s =>
    s.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.ma_so_thue.includes(searchTerm) ||
    s.nhom_cong_nghe.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <Badge variant="primary">Mạng lưới nhà cung cấp công nghệ</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Các đơn vị cung cấp giải pháp công nghệ đã tham gia
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Tất cả nhà cung cấp trên nền tảng POLYMATCH đều phải trải qua quy trình xác minh mã số thuế, năng lực giải pháp và cam kết chất lượng dịch vụ theo quy chế nền tảng.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Tìm theo tên nhà cung cấp, mã số thuế, công nghệ..."
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
        />
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(vendor => (
          <div
            key={vendor.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#1769AA] flex items-center justify-center font-bold text-lg shrink-0">
                    {vendor.ten.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {vendor.ten}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      MST: {vendor.ma_so_thue}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={vendor.trang_thai === 'da_duyet' ? 'success' : 'warning'}
                  size="sm"
                  dot
                >
                  {vendor.trang_thai === 'da_duyet' ? 'Đã xác thực' : 'Đang xác minh'}
                </Badge>
              </div>

              {/* Tax Lookup Snapshot */}
              {vendor.mst_tra_cuu && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px] space-y-1 text-slate-600">
                  <div className="flex items-center gap-1 font-semibold text-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dữ liệu đăng ký doanh nghiệp:</span>
                  </div>
                  <div className="truncate">Tên ĐKKD: <strong>{vendor.mst_tra_cuu.ten_dang_ky}</strong></div>
                  <div>Tình trạng: <span className="text-emerald-700 font-medium">{vendor.mst_tra_cuu.tinh_trang}</span></div>
                </div>
              )}

              {/* Tech Categories */}
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1.5">Nhóm công nghệ cung cấp:</span>
                <div className="flex flex-wrap gap-1.5">
                  {vendor.nhom_cong_nghe.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs bg-blue-50/70 text-[#1769AA] font-medium px-2.5 py-1 rounded-md border border-blue-100"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <a
                href={vendor.website}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-[#1769AA] flex items-center gap-1 font-medium"
              >
                <span>Xem website chính thức</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <Link to="/solutions">
                <Button variant="outline" size="sm">
                  Xem các giải pháp
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box for prospective sellers */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="font-bold text-lg">Bạn là nhà cung cấp giải pháp công nghệ logistics?</h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Đăng ký tham gia nền tảng POLYMATCH để tiếp cận các doanh nghiệp có nhu cầu số hóa thực tế, nhận yêu cầu kết nối phù hợp với giải pháp của bạn.
          </p>
        </div>
        <Link to="/register/seller" className="shrink-0">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Đăng ký làm Nhà cung cấp
          </Button>
        </Link>
      </div>
    </div>
  );
};
