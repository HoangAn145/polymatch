import React, { useState } from 'react';
import { FileText, Building2, CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { Quotation } from '../../types';

export const SellerQuotesPage: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const seller = dbService.getSellers().find(s => s.userId === currentUser?.id) || dbService.getSellers()[0];
  const quotations = dbService.getQuotations().filter(q => q.sellerId === seller?.id || q.sellerId === currentUser?.id);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Badge variant="primary">Báo giá thương mại</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Danh sách Báo giá đã phát hành
          </h1>
          <p className="text-xs text-slate-500">
            Theo dõi tình trạng phản hồi của Buyer đối với các bảng chào giá giải pháp công nghệ.
          </p>
        </div>
      </div>

      {quotations.length > 0 ? (
        <div className="space-y-4">
          {quotations.map(q => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1 min-w-0 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant={q.trang_thai === 'chap_nhan' ? 'success' : q.trang_thai === 'tu_choi' ? 'danger' : 'warning'} size="sm">
                    {q.trang_thai === 'chap_nhan' ? 'Đã được chấp thuận (Đã ký HĐ)' : q.trang_thai === 'tu_choi' ? 'Đã từ chối' : 'Chờ Buyer phản hồi'}
                  </Badge>
                  <span className="font-mono text-slate-400">#{q.id}</span>
                  <span className="text-slate-500">
                    Gửi ngày: {new Date(q.ngay_gui).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#1769AA]" />
                  <span className="font-bold text-sm text-slate-900">Khách hàng: {q.buyerCompany}</span>
                </div>

                <p className="text-slate-600 line-clamp-2">
                  <strong>Nội dung báo giá:</strong> {q.noi_dung_bao_gia}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-slate-500 pt-1">
                  <span>Thời gian triển khai: <strong>{q.thoi_gian_trien_khai_tuan} tuần</strong></span>
                  <span>Hiệu lực đến: <strong>{new Date(q.han_hieu_luc).toLocaleDateString('vi-VN')}</strong></span>
                </div>
              </div>

              <div className="text-right shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 w-full md:w-auto">
                <span className="text-xs text-slate-400 block font-medium">Tổng giá trị:</span>
                <div className="text-2xl font-black text-[#1769AA]">
                  {(q.tong_gia_tri / 1000000).toFixed(1)} <span className="text-sm font-normal text-slate-400">triệu</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <p className="text-xs text-slate-500">Chưa có bảng báo giá nào được phát hành.</p>
        </div>
      )}
    </div>
  );
};
