import React, { useState } from 'react';
import { storage, RfqRecord, UserProfile } from '../lib/storage';
import { 
  Building2, 
  Send, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  AlertCircle,
  X
} from 'lucide-react';

interface RfqManagementViewProps {
  currentUser: UserProfile;
  onNavigateToSolutions: () => void;
}

export const RfqManagementView: React.FC<RfqManagementViewProps> = ({
  currentUser,
  onNavigateToSolutions,
}) => {
  const [rfqs, setRfqs] = useState<RfqRecord[]>(storage.getRfqsByBuyer(currentUser.id));
  const [activeChatRfq, setActiveChatRfq] = useState<RfqRecord | null>(null);
  const [chatInput, setChatInput] = useState('');

  const refreshData = () => {
    setRfqs(storage.getRfqsByBuyer(currentUser.id));
  };

  const handleUpdateStatus = (rfqId: string, newStatus: 'da_chon' | 'khong_con_nhu_cau') => {
    const target = storage.getRfq(rfqId);
    if (target) {
      target.status = newStatus;
      storage.saveAssessment(storage.getAssessment(target.assessmentId)!); // trigger persist
      refreshData();
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatRfq || !chatInput.trim()) return;

    storage.sendMessage(activeChatRfq.id, {
      senderId: currentUser.id,
      senderRole: 'buyer',
      senderName: currentUser.name || 'Người mua',
      text: chatInput.trim(),
    });

    setChatInput('');
    setActiveChatRfq(storage.getRfq(activeChatRfq.id) || null);
    refreshData();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
            M11.07 · QUẢN LÝ HỒ SƠ NHU CẦU & BÁO GIÁ
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Yêu cầu báo giá của bạn (RFQs)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi tiến độ phát hồ sơ, số lượng nhà cung cấp đã mở (tối đa 5) và trao đổi trực tiếp
          </p>
        </div>

        <button
          onClick={onNavigateToSolutions}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
        >
          + Tạo thêm yêu cầu mới
        </button>
      </div>

      {/* RFQ List */}
      {rfqs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Chưa có Hồ sơ nhu cầu nào được tạo
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Sau khi làm bài đánh giá, hãy chọn các giải pháp công nghệ phù hợp và bấm "Gửi yêu cầu báo giá" để kết nối nhà cung cấp.
            </p>
          </div>
          <button
            onClick={onNavigateToSolutions}
            className="px-5 py-2.5 bg-blue-700 text-white text-xs font-bold rounded-xl hover:bg-blue-800"
          >
            Khám phá giải pháp công nghệ
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {rfqs.map((rfq) => {
            const unlockedCount = rfq.unlockedVendorIds.length;
            const isFull = unlockedCount >= 5;

            return (
              <div
                key={rfq.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm p-6 space-y-4 transition-all"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-800">
                        {rfq.id}
                      </span>
                      <span className="text-xs font-semibold text-blue-700">
                        Nhánh: {rfq.branch}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-600">
                        Quy mô: {rfq.scale.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 pt-1">
                      {rfq.solutionName}
                    </h3>

                    <p className="text-xs text-slate-500">
                      Tạo ngày {new Date(rfq.createdAt).toLocaleDateString('vi-VN')} · Hạn hiệu lực: {new Date(rfq.expiresAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                  {/* Status & Unlocked count */}
                  <div className="text-left sm:text-right space-y-1.5 shrink-0">
                    <div>
                      {rfq.status === 'dang_phat' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Đang phát hồ sơ
                        </span>
                      )}
                      {rfq.status === 'dong_du_luot' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Đã đủ 5 lượt mở (R15)
                        </span>
                      )}
                      {rfq.status === 'da_chon' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Đã chọn được đối tác
                        </span>
                      )}
                      {rfq.status === 'khong_con_nhu_cau' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                          Không còn nhu cầu
                        </span>
                      )}
                    </div>

                    {/* Unlocked Badge (M18.02) */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold bg-slate-50 border border-slate-200 text-slate-800">
                      <Users className="w-3.5 h-3.5 text-blue-700" />
                      <span>{unlockedCount}/5 Nhà cung cấp đã mở</span>
                    </div>
                  </div>
                </div>

                {/* RFQ Details Snapshot */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Bậc ngân sách:</span>
                    <span className="font-bold text-slate-900">{rfq.budgetText} ({rfq.budgetTier})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Mức trưởng thành số:</span>
                    <span className="font-bold text-slate-900">DBI: {rfq.anonymousSnapshot.dbiMuc} · LDMI: {rfq.anonymousSnapshot.ldmiMucTen}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Báo giá nhận được:</span>
                    <span className="font-bold text-emerald-700">{rfq.quotesReceived.length} báo giá</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tin nhắn trao đổi:</span>
                    <span className="font-bold text-blue-700">{rfq.messages.length} tin nhắn</span>
                  </div>
                </div>

                {/* Received Quotes Section */}
                {rfq.quotesReceived.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-800 block">
                      Báo giá nhận được từ các Nhà cung cấp (M12.03):
                    </span>
                    <div className="space-y-2">
                      {rfq.quotesReceived.map((q) => (
                        <div key={q.id} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-emerald-950">{q.vendorName}</span>
                            <span className="text-emerald-700 font-mono text-sm">{q.price}</span>
                          </div>
                          <p className="text-slate-700">{q.message}</p>
                          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                            <span>Thời gian cam kết: {q.timeline}</span>
                            <span>{new Date(q.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions & Chat */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {rfq.status === 'dang_phat' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(rfq.id, 'da_chon')}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-lg border border-emerald-200"
                        >
                          ✓ Đã chọn được NCC (M11.08)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(rfq.id, 'khong_con_nhu_cau')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg"
                        >
                          ✕ Không còn nhu cầu
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveChatRfq(rfq)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-blue-200"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Hộp thư trao đổi trực tiếp ({rfq.messages.length})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CHAT MODAL (M12.02) */}
      {activeChatRfq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full h-[520px] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-blue-700 font-bold block">
                  TRAO ĐỔI NỘI BỘ (M12.02)
                </span>
                <h3 className="text-sm font-bold text-slate-900 truncate max-w-xs">
                  {activeChatRfq.solutionName}
                </h3>
              </div>
              <button
                onClick={() => setActiveChatRfq(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {activeChatRfq.messages.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  Chưa có tin nhắn nào. Nhà cung cấp đã mở hồ sơ có thể trao đổi trực tiếp với bạn tại đây.
                </div>
              ) : (
                activeChatRfq.messages.map((m) => {
                  const isMe = m.senderId === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-0.5">
                        {m.senderName} · {m.timestamp}
                      </span>
                      <div
                        className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập nội dung trao đổi..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="p-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
