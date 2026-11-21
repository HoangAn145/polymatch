import {simulateRoi} from '../../lib/diagnostic';
import React, { useState, useMemo } from 'react';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Clock,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';

export const BuyerRoiSimulatorPage: React.FC = () => {
  // Simulator Inputs
  const [initialInvestment, setInitialInvestment] = useState<number>(50000000); // 50 triệu
  const [monthlyOperatingCost, setMonthlyOperatingCost] = useState<number>(4500000); // 4.5 triệu/tháng
  const [monthlySavings, setMonthlySavings] = useState<number>(18000000); // 18 triệu tiết kiệm (nhiên liệu + công đối soát)
  const [timeframeMonths, setTimeframeMonths] = useState<number>(24); // 24 tháng
  const [discountRatePercent, setDiscountRatePercent] = useState<number>(10); // 10%/năm

  // Reset to default
  const handleReset = () => {
    setInitialInvestment(50000000);
    setMonthlyOperatingCost(4500000);
    setMonthlySavings(18000000);
    setTimeframeMonths(24);
    setDiscountRatePercent(10);
  };

  // Financial calculations
  const calculation = useMemo(() => {
    const scenarios=simulateRoi(initialInvestment,monthlyOperatingCost,monthlySavings,timeframeMonths,discountRatePercent);
    const base=scenarios[1];
    return {
      roi:base.roi===null?null:Math.round(base.roi),npv:Math.round(base.npv),paybackMonths:base.payback,
      netProfit:Math.round(base.cashflows.at(-1)!.cumulative),scenarios,
      chartData:base.cashflows.map(c=>({month:c.month,label:`Tháng ${c.month}`,dongTienRong:Math.round(c.cash/1000000),luyKe:Math.round(c.cumulative/1000000)}))
    };
  }, [initialInvestment, monthlyOperatingCost, monthlySavings, timeframeMonths, discountRatePercent]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <section className="bg-white rounded-2xl border p-5 space-y-3"><h2 className="font-bold">So sánh ba kịch bản tài chính</h2><p className="text-xs text-slate-500">Lợi ích thay đổi ±30%, chi phí giữ nguyên. ROI = lợi nhuận ròng / tổng chi phí đầu tư và vận hành trong kỳ.</p><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr><th>Kịch bản</th><th>ROI</th><th>NPV (triệu đồng)</th><th>Hoàn vốn</th></tr></thead><tbody>{calculation.scenarios.map(s=><tr key={s.name}><td className="py-2">{s.name}</td><td>{s.roi===null?"—":`${s.roi.toFixed(1)}%`}</td><td>{(s.npv/1000000).toFixed(2)}</td><td>{s.payback===null?"Chưa hoàn vốn trong kỳ":`${s.payback} tháng`}</td></tr>)}</tbody></table></div></section>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Badge variant="primary">Công cụ tài chính giả lập</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Mô phỏng Hiệu quả Đầu tư (ROI Simulator)
          </h1>
          <p className="text-xs text-slate-500">
            Dự phóng dòng tiền hoàn vốn và tỷ suất sinh lời khi đầu tư phần mềm quản lý vận tải hoặc kho bãi.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={handleReset}
        >
          Đặt lại mặc định
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Calculator className="w-4 h-4 text-[#1769AA]" />
            <span>Giả định đầu vào</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <label>Chi phí đầu tư ban đầu (Setup / Hardware):</label>
                <span className="text-[#1769AA] font-bold">{(initialInvestment / 1000000).toLocaleString('vi-VN')} triệu VNĐ</span>
              </div>
              <input
                type="range"
                min={10000000}
                max={200000000}
                step={5000000}
                value={initialInvestment}
                onChange={e => setInitialInvestment(Number(e.target.value))}
                className="w-full accent-[#1769AA] cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">Gồm: Phí khởi tạo, bản quyền, máy quét mã vạch hoặc thiết bị GPS ban đầu.</span>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <label>Phí thuê bao & Vận hành hàng tháng:</label>
                <span className="text-slate-800 font-bold">{(monthlyOperatingCost / 1000000).toLocaleString('vi-VN')} triệu VNĐ</span>
              </div>
              <input
                type="range"
                min={1000000}
                max={30000000}
                step={500000}
                value={monthlyOperatingCost}
                onChange={e => setMonthlyOperatingCost(Number(e.target.value))}
                className="w-full accent-[#1769AA] cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">Gồm: Phí SaaS cloud, sim 4G định vị, bảo trì kỹ thuật hàng tháng.</span>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <label>Chi phí tiết kiệm dự kiến mỗi tháng:</label>
                <span className="text-emerald-700 font-bold">{(monthlySavings / 1000000).toLocaleString('vi-VN')} triệu VNĐ</span>
              </div>
              <input
                type="range"
                min={3000000}
                max={60000000}
                step={1000000}
                value={monthlySavings}
                onChange={e => setMonthlySavings(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">Gồm: Tiết kiệm xăng dầu từ định tuyến, giảm xe chạy rỗng, giảm giờ làm thêm đối soát.</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Thời gian phân tích:</label>
                <select
                  value={timeframeMonths}
                  onChange={e => setTimeframeMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none"
                >
                  <option value={12}>12 tháng (1 năm)</option>
                  <option value={24}>24 tháng (2 năm)</option>
                  <option value={36}>36 tháng (3 năm)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tỷ lệ chiết khấu (%/năm):</label>
                <select
                  value={discountRatePercent}
                  onChange={e => setDiscountRatePercent(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none"
                >
                  <option value={8}>8% / năm</option>
                  <option value={10}>10% / năm</option>
                  <option value={12}>12% / năm</option>
                </select>
              </div>
            </div>
          </div>

          {/* Disclaimer box */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>Khuyến cáo tính toán:</span>
            </div>
            <p className="leading-relaxed">
              Các chỉ số ROI, NPV và thời gian hoàn vốn chỉ mang tính chất mô phỏng giả định dựa trên các số liệu bạn đưa vào. Không phải cam kết bảo đảm lợi nhuận từ POLYMATCH hay nhà cung cấp.
            </p>
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Output Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Tỷ suất sinh lời ROI</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                {calculation.roi === null ? "—" : `${calculation.roi}%`}
              </div>
              <span className="text-[11px] text-slate-500">Trong vòng {timeframeMonths} tháng</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Thời gian hoàn vốn</span>
              <div className="text-2xl sm:text-3xl font-black text-[#1769AA]">
                {calculation.paybackMonths === null ? <span className="text-base">Chưa hoàn vốn trong kỳ</span> : <>{calculation.paybackMonths} <span className="text-sm font-normal text-slate-400">tháng</span></>}
              </div>
              <span className="text-[11px] text-slate-500">Điểm hòa vốn đầu tư</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Giá trị hiện tại thuần (NPV)</span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-700">
                {(calculation.npv / 1000000).toLocaleString('vi-VN')} <span className="text-sm font-normal text-slate-400">tr</span>
              </div>
              <span className="text-[11px] text-slate-500">Chiết khấu {discountRatePercent}%</span>
            </div>
          </div>

          {/* Cashflow Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-slate-900">
                Biểu đồ Dòng tiền Luỹ kế theo thời gian (Triệu VNĐ)
              </h4>
              <Badge variant="success" size="sm">{calculation.paybackMonths===null?"Chưa hoàn vốn trong kỳ":`Hoàn vốn sau ${calculation.paybackMonths} tháng`}</Badge>
            </div>

            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={calculation.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLuyKe" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1769AA" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1769AA" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" unit=" tr" />
                  <Tooltip
                    formatter={(val: any) => [`${val} triệu VNĐ`, 'Dòng tiền luỹ kế']}
                    contentStyle={{ borderRadius: 8, fontSize: 11 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="luyKe"
                    stroke="#1769AA"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorLuyKe)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
              <span>Lợi nhuận ròng dự kiến sau {timeframeMonths} tháng:</span>
              <strong className="text-emerald-700 text-sm font-bold">
                {calculation.netProfit>0?"+":""}{(calculation.netProfit / 1000000).toLocaleString('vi-VN')} triệu VNĐ
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
