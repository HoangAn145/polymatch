import React, { useState } from 'react';
import {
  History,
  Search
} from 'lucide-react';
import { dbService } from '../../services/mockDatabase';
import { AuditLog } from '../../types';
import { Badge } from '../../components/ui/Badge';

export const AdminAuditPage: React.FC = () => {
  const [logs] = useState<AuditLog[]>(() => dbService.getAuditLogs());
  const [search, setSearch] = useState('');

  const filtered = logs.filter(l =>
    l.hanh_dong.toLowerCase().includes(search.toLowerCase()) ||
    l.adminName.toLowerCase().includes(search.toLowerCase()) ||
    l.mo_ta.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-[#1769AA]" />
          Nhật ký hoạt động hệ thống (Audit Log)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Ghi nhận toàn bộ thao tác bảo mật, xác minh thuế, duyệt giải pháp và chuyển đổi trạng thái
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo hành động, người thực hiện, chi tiết..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1769AA]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Hành động</th>
                <th className="py-3 px-4">Người thực hiện</th>
                <th className="py-3 px-4">Đối tượng</th>
                <th className="py-3 px-4">Chi tiết thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(l.thoi_gian).toLocaleString('vi-VN')}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="neutral" size="sm">
                      {l.hanh_dong}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {l.adminName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                      {l.doi_tuong}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {l.mo_ta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
