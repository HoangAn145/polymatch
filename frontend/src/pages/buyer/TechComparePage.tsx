import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Scale, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  Star, 
  Building2, 
  Send,
  Sparkles
} from 'lucide-react';
import { TechListing } from '../../types';

export const TechComparePage: React.FC = () => {
  const { techListings, comparisonList, toggleCompare, navigate, createLead, currentUser, investmentPrefs } = useApp();

  React.useEffect(() => {
    if (currentUser.role === 'GUEST') {
      sessionStorage.setItem('dbi_login_notice', 'Vui lòng đăng nhập để sử dụng tính năng So sánh Giải pháp Công nghệ.');
      navigate('/login');
    }
  }, [currentUser.role, navigate]);

  if (currentUser.role === 'GUEST') {
    return null;
  }

  const comparedItems: TechListing[] = techListings.filter(t => comparisonList.includes(t.id));

  const handleInquireFromCompare = (item: TechListing) => {
    if (currentUser.role === 'GUEST') {
      sessionStorage.setItem('dbi_login_notice', `Vui lòng đăng nhập tài khoản doanh nghiệp để gửi yêu cầu kết nối với giải pháp "${item.techName}".`);
      navigate('/login');
      return;
    }
    createLead({
      listingId: item.id,
      techName: item.techName,
      vendorName: item.vendorName,
      buyerName: currentUser.company.companyName,
      buyerMst: currentUser.company.mst,
      buyerPhone: currentUser.phone,
      buyerEmail: currentUser.email,
      buyerDbiLevel: 2,
      buyerDbiScore: 48,
      notes: `Quan tâm giải pháp sau khi xem bảng so sánh công nghệ trên Cổng DBI.`,
      budgetRange: investmentPrefs.budgetText,
      timeline: 'Quý 2/2026'
    });
    navigate('/interests');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/assessment/active/recommendations')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Danh sách Đề xuất</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Scale className="w-6 h-6 text-teal-600" />
            <span>Bảng So sánh Trực quan Giải pháp Công nghệ</span>
          </h1>
          <p className="text-xs text-slate-500">
            Đặt các giải pháp cạnh nhau để phân tích sự tương thích về chi phí, tính năng và cấp độ trưởng thành số DBI.
          </p>
        </div>

        {comparedItems.length > 0 && (
          <div className="text-xs font-bold text-slate-600">
            Đang so sánh {comparedItems.length} / 3 giải pháp
          </div>
        )}
      </div>

      {comparedItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Chưa có giải pháp nào được chọn để so sánh</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Hãy quay lại trang Danh mục Đề xuất và tích chọn ô "So sánh" (tối đa 3 giải pháp cùng lúc).
          </p>
          <button
            onClick={() => navigate('/assessment/active/recommendations')}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
          >
            Mở Danh mục Giải pháp
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-4 w-52 font-bold text-slate-500 uppercase tracking-wider">Tiêu chí đối chiếu</th>
                  {comparedItems.map((item) => (
                    <th key={item.id} className="p-4 w-72 min-w-[260px] align-top">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                            {item.id_tech}
                          </span>
                          <button
                            onClick={() => toggleCompare(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Bỏ khỏi so sánh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.techName}</h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-teal-600" />
                          <span>{item.vendorName}</span>
                        </div>
                        <button
                          onClick={() => handleInquireFromCompare(item)}
                          className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
                        >
                          Bày tỏ quan tâm
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Row: AI Match Percentage */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Độ tương thích AI (DBI)</td>
                  {comparedItems.map((item) => (
                    <td key={item.id} className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs font-black text-teal-800 bg-teal-100 px-2.5 py-1 rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        <span>Khớp {item.matchPercentage || 92}%</span>
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Row: Price Range */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Khung giá tham chiếu</td>
                  {comparedItems.map((item) => (
                    <td key={item.id} className="p-4 font-extrabold text-slate-900">
                      {item.priceMin.toLocaleString('vi-VN')} - {item.priceMax.toLocaleString('vi-VN')} VND
                      <span className="text-slate-400 text-[10px] block font-normal">{item.priceUnit}</span>
                    </td>
                  ))}
                </tr>

                {/* Row: Target DBI Levels */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Cấp độ DBI phù hợp</td>
                  {comparedItems.map((item) => (
                    <td key={item.id} className="p-4">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                        Cấp độ {item.targetDbiLevels.join(', ')}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Row: Target Enterprise Size */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Quy mô doanh nghiệp tối ưu</td>
                  {comparedItems.map((item) => (
                    <td key={item.id} className="p-4 font-semibold text-slate-700">
                      {item.targetSizes.join(' & ')}
                    </td>
                  ))}
                </tr>

                {/* Row: Key Features */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Tính năng cốt lõi</td>
                  {comparedItems.map((item) => (
                    <td key={item.id} className="p-4 align-top">
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {item.features.map((f, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Row: Ratings & Reviews */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Đánh giá thực tế</td>
                  {comparedItems.map((item) => (
                    <td key={item.id} className="p-4">
                      <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{item.rating}/5.0</span>
                        <span className="text-slate-400 font-normal">({item.reviewCount} đánh giá)</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Row: Deployment Model */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Mô hình triển khai</td>
                  {comparedItems.map((item) => (
                    <td key={item.id} className="p-4 text-xs font-semibold text-slate-800">
                      Cloud SaaS (Web & Mobile App)
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
