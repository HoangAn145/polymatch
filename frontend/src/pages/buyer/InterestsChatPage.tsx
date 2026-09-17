import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Paperclip, 
  Phone, 
  Mail, 
  ArrowLeft,
  Search,
  CheckCheck
} from 'lucide-react';
import { LeadInquiry } from '../../types';

export const InterestsChatPage: React.FC = () => {
  const { leads, chatMessages, sendChatMessage, activeChatLeadId, setActiveChatLeadId, currentUser, navigate } = useApp();

  const [inputMsg, setInputMsg] = useState('');

  // Selected lead
  const currentLead: LeadInquiry = leads.find(l => l.id === activeChatLeadId) || leads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !currentLead) return;

    sendChatMessage(currentLead.id, inputMsg.trim());
    setInputMsg('');
  };

  const getStatusBadge = (status: LeadInquiry['status']) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Mới gửi</span>;
      case 'CONTACTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Đang trao đổi</span>;
      case 'QUOTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Đã gửi báo giá</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Đã ký hợp đồng</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-teal-600" />
            <span>Hộp thư Trao đổi & Báo giá Công nghệ</span>
          </h1>
          <p className="text-xs text-slate-500">
            Trao đổi kỹ thuật trực tiếp và nhận báo giá chính thức từ các nhà cung cấp đã được xác minh.
          </p>
        </div>
      </div>

      {/* Main Dual Pane Chat Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 min-h-[600px] overflow-hidden">
        {/* Left Col: List of Inquiries (Leads) */}
        <div className="border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Danh sách Yêu cầu đã gửi ({leads.length})
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm giải pháp hoặc nhà cung cấp..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-teal-600 bg-slate-50"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {leads.map((lead) => {
              const isSelected = lead.id === currentLead?.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => setActiveChatLeadId(lead.id)}
                  className={`p-4 cursor-pointer transition-colors space-y-1.5 ${
                    isSelected ? 'bg-teal-50/80 border-l-4 border-teal-600' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{lead.techName}</span>
                    {getStatusBadge(lead.status)}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-teal-600" />
                    <span>{lead.vendorName}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                    "{lead.notes}"
                  </p>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>{lead.createdAt}</span>
                    <span className="font-semibold text-teal-700">{lead.budgetRange}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Active Chat Room */}
        {currentLead ? (
          <div className="md:col-span-2 flex flex-col justify-between h-full bg-white">
            {/* Chat Room Header */}
            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-extrabold text-sm flex items-center justify-center">
                  {currentLead.vendorName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{currentLead.vendorName}</h4>
                  <p className="text-xs text-slate-500">
                    Trao đổi giải pháp: <strong>{currentLead.techName}</strong> • Kế hoạch: {currentLead.timeline}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(currentLead.status)}
              </div>
            </div>

            {/* Chat Message History */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
              <div className="text-center text-[11px] text-slate-400">
                <span>Hệ thống bảo vệ kết nối: Hồ sơ DBI của bạn đã được gửi kèm yêu cầu</span>
              </div>

              {chatMessages.map((msg) => {
                const isMe = msg.senderRole === currentUser.role || (currentUser.role === 'BUYER' && msg.senderRole === 'BUYER');
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-600">{msg.senderName}</span>
                      <span>• {msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-teal-600 text-white rounded-tr-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nhập nội dung trao đổi, đặt câu hỏi tính năng hoặc yêu cầu gửi báo giá PDF..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-teal-600 bg-white"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim()}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="md:col-span-2 flex items-center justify-center p-12 text-slate-400 text-xs">
            Chọn một yêu cầu bên trái để bắt đầu trao đổi.
          </div>
        )}
      </div>
    </div>
  );
};
