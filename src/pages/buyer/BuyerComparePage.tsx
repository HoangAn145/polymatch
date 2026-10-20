import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  GitCompare,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SOLUTIONS_DATA } from '../../data/solutionsData';
import { Solution } from '../../types';
import { useToast } from '../../components/ui/Toast';

export const BuyerComparePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const idsParam = searchParams.get('ids') || '';
  const initialIds = idsParam ? idsParam.split(',').filter(Boolean) : ['sol-02', 'sol-04', 'sol-05'];

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);

  const comparedSolutions = SOLUTIONS_DATA.filter(s => selectedIds.includes(s.id));

  const handleRemove = (id: string) => {
    const updated = selectedIds.filter(x => x !== id);
    setSelectedIds(updated);
    setSearchParams({ ids: updated.join(',') });
  };

  const handleAdd = (id: string) => {
    if (selectedIds.length >= 3) {
      toast.warning("Tối đa 3 giải pháp", "Chỉ có thể so sánh tối đa 3 giải pháp cùng lúc.");
      return;
    }
    const updated = [...selectedIds, id];
    setSelectedIds(updated);
    setSearchParams({ ids: updated.join(',') });
  };

  const remainingSolutions = SOLUTIONS_DATA.filter(s => !selectedIds.includes(s.id));

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Badge variant="primary">Công cụ so sánh giải pháp</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            So sánh đối chiếu trực quan (Tối đa 3 giải pháp)
          </h1>
          <p className="text-xs text-slate-500">
            Đặt các giải pháp lên bàn cân về tính năng, mức giá, thời gian triển khai và điều kiện kỹ thuật.
          </p>
        </div>

        <Link to="/buyer/solutions">
          <Button variant="outline" size="sm">
            &larr; Về danh mục đề xuất
          </Button>
        </Link>
      </div>

      {/* Select more solutions if < 3 */}
      {selectedIds.length < 3 && (
        <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#1769AA]" />
            <span className="font-semibold text-slate-800">
              Bạn có thể chọn thêm {3 - selectedIds.length} giải pháp để so sánh:
            </span>
          </div>

          <select
            onChange={e => {
              if (e.target.value) handleAdd(e.target.value);
            }}
            value=""
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none"
          >
            <option value="">-- Chọn giải pháp muốn thêm --</option>
            {remainingSolutions.map(s => (
              <option key={s.id} value={s.id}>{s.ten} ({s.nha_cung_cap_ten})</option>
            ))}
          </select>
        </div>
      )}

      {/* Comparison Table */}
      {comparedSolutions.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="p-4 w-1/4 font-bold uppercase text-[11px] text-slate-400">Tiêu chí so sánh</th>
                {comparedSolutions.map(sol => (
                  <th key={sol.id} className="p-4 w-1/4 font-bold border-l border-slate-200 align-top">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" size="sm">{sol.nhom_giai_phap}</Badge>
                        <button
                          onClick={() => handleRemove(sol.id)}
                          title="Bỏ khỏi so sánh"
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="font-extrabold text-slate-900 text-sm leading-snug">{sol.ten}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{sol.nha_cung_cap_ten}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {/* Row 1: Giá & Mô hình */}
              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">Khoảng giá dự kiến</td>
                {comparedSolutions.map(s => (
                  <td key={s.id} className="p-4 border-l border-slate-100">
                    <span className="font-bold text-[#1769AA] text-sm block">{s.khoang_gia_text}</span>
                    <span className="text-[11px] text-slate-400 capitalize">Mô hình: {s.mo_hinh_chi_phi.replace(/_/g, ' ')}</span>
                  </td>
                ))}
              </tr>

              {/* Row 2: Thời gian triển khai */}
              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">Thời gian triển khai</td>
                {comparedSolutions.map(s => (
                  <td key={s.id} className="p-4 border-l border-slate-100 font-medium">
                    {s.thoi_gian_trien_khai}
                  </td>
                ))}
              </tr>

              {/* Row 3: Quy mô & Ngành phù hợp */}
              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">Quy mô phù hợp</td>
                {comparedSolutions.map(s => (
                  <td key={s.id} className="p-4 border-l border-slate-100 capitalize">
                    {s.quy_mo_phu_hop.join(', ').replace(/_/g, ' ')}
                  </td>
                ))}
              </tr>

              {/* Row 4: Tính năng chính */}
              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50 align-top">Tính năng & Khả năng cốt lõi</td>
                {comparedSolutions.map(s => (
                  <td key={s.id} className="p-4 border-l border-slate-100 align-top">
                    <ul className="space-y-1.5">
                      {s.tinh_nang_chinh.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Row 5: Nguồn lực cần có */}
              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50 align-top">Yêu cầu nguồn lực</td>
                {comparedSolutions.map(s => (
                  <td key={s.id} className="p-4 border-l border-slate-100 align-top">
                    <ul className="space-y-1 text-slate-600 list-disc pl-4">
                      {s.nguon_luc_can.map((res, i) => (
                        <li key={i}>{res}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Row 6: Tích hợp */}
              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">Tích hợp sẵn có</td>
                {comparedSolutions.map(s => (
                  <td key={s.id} className="p-4 border-l border-slate-100 uppercase font-mono text-[11px]">
                    {s.tich_hop.join(', ')}
                  </td>
                ))}
              </tr>

              {/* Row 7: Case study */}
              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50 align-top">Kết quả kiểm chứng</td>
                {comparedSolutions.map(s => (
                  <td key={s.id} className="p-4 border-l border-slate-100 align-top">
                    <p className="text-slate-600 italic leading-relaxed">
                      {s.case_study || 'Đang cập nhật case study từ nhà cung cấp.'}
                    </p>
                  </td>
                ))}
              </tr>

              {/* Actions row */}
              <tr className="bg-slate-50/80">
                <td className="p-4 font-bold text-slate-900">Thao tác</td>
                {comparedSolutions.map(s => (
                  <td key={s.id} className="p-4 border-l border-slate-100">
                    <Link to={`/buyer/solutions`}>
                      <Button variant="primary" size="sm" className="w-full">
                        Yêu cầu báo giá &rarr;
                      </Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-sm text-slate-500 mb-3">Bạn chưa chọn giải pháp nào để so sánh.</p>
          <Link to="/buyer/solutions">
            <Button variant="primary" size="sm">
              Quay lại danh mục giải pháp đề xuất
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
