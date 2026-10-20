import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Compass,
  Lightbulb
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { KNOWLEDGE_GAPS } from '../../data/knowledgeGaps';
import { KnowledgeGap } from '../../types';

export const BuyerGapsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedGap, setSelectedGap] = useState<KnowledgeGap | null>(null);

  const groups = [
    { id: 'all', name: 'Tất cả nhóm năng lực' },
    { id: 'VT', name: 'Vận tải (VT)' },
    { id: 'KB', name: 'Kho bãi (KB)' },
    { id: 'GN', name: 'Giao nhận quốc tế (GN)' },
    { id: 'DH', name: 'Đơn hàng & Giao nhận (DH)' },
    { id: 'HT', name: 'Hiển thị & Tích hợp (HT)' },
    { id: 'CT', name: 'Chứng từ & Hải quan (CT)' },
    { id: 'CP', name: 'Chi phí & Hiệu suất (CP)' },
    { id: 'XA', name: 'Logistics Xanh (XA)' }
  ];

  const filtered = KNOWLEDGE_GAPS.filter(g => {
    const matchSearch =
      g.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.trieu_chung.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.nguyen_nhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.ma.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGroup = selectedGroup === 'all' || g.nhom_nang_luc === selectedGroup;
    return matchSearch && matchGroup;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 space-y-1">
        <Badge variant="warning">Ngân hàng Tri thức Điểm nghẽn</Badge>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Chẩn đoán 17 Điểm nghẽn Điển hình trong Chuỗi cung ứng
        </h1>
        <p className="text-xs text-slate-500">
          Tra cứu các triệu chứng, nguyên nhân cốt lõi, bước chuẩn bị theo từng mức năng lực và chỉ số đo lường khuyến nghị.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã (vd: G-VT-01) hoặc tên điểm nghẽn..."
            className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none"
          >
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Gaps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(gap => (
          <div
            key={gap.ma}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Badge variant="danger" size="sm">{gap.ma}</Badge>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Nhóm {gap.nhom_nang_luc}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 leading-snug">
                {gap.ten}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div>
                  <strong className="text-slate-800">Triệu chứng:</strong> {gap.trieu_chung}
                </div>
                <div>
                  <strong className="text-slate-800">Nguyên nhân:</strong> {gap.nguyen_nhan}
                </div>
                <div>
                  <strong className="text-emerald-700">Bước tiếp theo:</strong> {gap.buoc_tiep.muc_2 || gap.buoc_tiep.muc_1}
                </div>
                <div>
                  <strong className="text-slate-800">Chỉ số:</strong> {gap.chi_so}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                Nguồn: {gap.nguon[0]}
              </span>
              <Link to={`/buyer/solutions?gap=${gap.ma}`}>
                <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Giải pháp khắc phục
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
