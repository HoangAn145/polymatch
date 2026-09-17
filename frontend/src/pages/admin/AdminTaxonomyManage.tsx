import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Layers, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck,
  Tag
} from 'lucide-react';
import { DBI_PILLARS } from '../../data/mockData';
import { PillarId, TaxonomyItem } from '../../types';

export const AdminTaxonomyManage: React.FC = () => {
  const { techCatalog, addTaxonomyItem, navigate } = useApp();

  const [idTech, setIdTech] = useState('');
  const [standardName, setStandardName] = useState('');
  const [pillarId, setPillarId] = useState<PillarId>('TECH_INFRA');
  const [description, setDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateTaxonomy = (e: React.FormEvent) => {
    e.preventDefault();

    if (!idTech.trim() || !standardName.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Mã danh mục và Tên chuẩn hóa.');
      return;
    }

    const cleanId = idTech.trim().toUpperCase();
    if (techCatalog.some(t => t.id_tech === cleanId)) {
      setErrorMsg(`Mã phân loại '${cleanId}' đã tồn tại trong Closed Taxonomy.`);
      return;
    }

    addTaxonomyItem({
      id_tech: cleanId,
      standardName: standardName.trim(),
      pillarId,
      description: description.trim() || `Giải pháp thuộc trụ cột ${pillarId}`
    });

    setSuccessMsg(`Đã bổ sung mã danh mục chuẩn [${cleanId}] vào Closed Taxonomy!`);
    setIdTech('');
    setStandardName('');
    setDescription('');
    setShowAddForm(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-purple-700 transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Bảng điều khiển Admin</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-600" />
            <span>Quản lý Danh mục Phân loại Đóng (Closed Taxonomy Catalog)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Tất cả giải pháp của Vendor bắt buộc phải gắn với một mã danh mục chuẩn tại đây để đảm bảo tính toán khớp nối DBI chính xác.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Mã Phân loại Mới</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Add new taxonomy form modal / drawer */}
      {showAddForm && (
        <form onSubmit={handleCreateTaxonomy} className="bg-white rounded-2xl border-2 border-purple-300 p-6 sm:p-8 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900">
              Định nghĩa Mã Phân loại Công nghệ Mới
            </h3>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded">
              Chuẩn Quốc gia DBI
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mã định danh (id_tech) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: RPA, AI_CHATBOT, WMS..."
                value={idTech}
                onChange={(e) => setIdTech(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold uppercase focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên chuẩn hóa giải pháp <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Tự động hóa Quy trình Bằng Robot (RPA)..."
                value={standardName}
                onChange={(e) => setStandardName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Trụ cột DBI cốt lõi <span className="text-rose-500">*</span>
              </label>
              <select
                value={pillarId}
                onChange={(e) => setPillarId(e.target.value as PillarId)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-purple-600 bg-white"
              >
                {DBI_PILLARS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Định nghĩa chức năng & Tiêu chí nghiệp vụ
            </label>
            <textarea
              rows={2}
              placeholder="Mô tả phạm vi ứng dụng và lợi ích giải quyết điểm nghẽn của mã công nghệ này..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm"
            >
              Lưu vào Closed Taxonomy
            </button>
          </div>
        </form>
      )}

      {/* Table of active Closed Taxonomy items */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-4">Mã phân loại (id_tech)</th>
                <th className="p-4">Tên chuẩn hóa giải pháp</th>
                <th className="p-4">Trụ cột DBI tương ứng</th>
                <th className="p-4">Mô tả nghiệp vụ</th>
                <th className="p-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {techCatalog.map((item) => (
                <tr key={item.id_tech} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4">
                    <span className="font-extrabold px-3 py-1 rounded-lg bg-blue-100 text-blue-900 border border-blue-200">
                      {item.id_tech}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900 text-sm">
                    {item.standardName}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-100">
                      {item.pillarId}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 max-w-md leading-relaxed">
                    {item.description}
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      Hiệu lực
                    </span>
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
