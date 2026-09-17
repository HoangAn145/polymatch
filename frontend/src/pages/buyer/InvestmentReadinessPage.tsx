import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  Users, 
  Crown, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2,
  Building2,
  Factory,
  Layers,
  ShoppingBag,
  Truck,
  Wheat,
  Landmark,
  Stethoscope,
  Plane,
  Zap,
  Info,
  ShieldAlert,
  Briefcase
} from 'lucide-react';
import { DBI_PILLARS } from '../../data/mockData';
import { PillarId } from '../../types';

// Danh mục 10 Nhóm ngành chuyên biệt trọng điểm cho Doanh nghiệp Lớn
export interface LargeEnterpriseSectorInfo {
  id: string;
  name: string;
  icon: React.ElementType;
  benchmarkBudget: string;
  highlightTier: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedCoreTech: string[];
  keyChallenges: string;
  description: string;
}

export const LARGE_ENTERPRISE_SECTORS: LargeEnterpriseSectorInfo[] = [
  {
    id: 'MANUFACTURING_HEAVY',
    name: 'Sản xuất Công nghiệp & Chế tạo',
    icon: Factory,
    benchmarkBudget: '1.5 - 5+ tỷ VND',
    highlightTier: 'MEDIUM',
    recommendedCoreTech: ['MES/SCADA tự động hóa', 'ERP SAP S/4HANA / Oracle', 'Bảo trì dự đoán AI/IoT', 'Hệ thống PLM & CAD/CAM'],
    keyChallenges: 'Giám sát chỉ số hiệu suất thiết bị toàn phần (OEE) thời gian thực, đồng bộ chuỗi cung ứng linh kiện và tối ưu dây chuyền.',
    description: 'Quy mô nhà máy lớn, nhiều dây chuyền sản xuất phức tạp, kiểm soát chất lượng QA/QC nghiêm ngặt.'
  },
  {
    id: 'STEEL_MATERIALS',
    name: 'Sắt thép, Luyện kim & Vật liệu Xây dựng',
    icon: Layers,
    benchmarkBudget: '1.2 - 4.5 tỷ VND',
    highlightTier: 'MEDIUM',
    recommendedCoreTech: ['Trạm cân điện tử tự động IoT', 'ERP Bravo/SAP quản trị phôi thép', 'Sàn kim loại quốc tế (SMM/LME)', 'Barcode/RFID kho kim loại'],
    keyChallenges: 'Hao hụt vật tư nguyên liệu thô, biến động giá phôi thép thế giới và bài toán điều phối cân hàng ngàn chuyến xe/ngày.',
    description: 'Doanh nghiệp sản xuất phôi, cán thép, xi măng, khoáng sản với khối lượng luân chuyển vật tư siêu trường siêu trọng.'
  },
  {
    id: 'RETAIL_CHAINS',
    name: 'Chuỗi Bán lẻ, Đại siêu thị & Phân phối',
    icon: ShoppingBag,
    benchmarkBudget: '1.0 - 3.5 tỷ VND',
    highlightTier: 'LOW',
    recommendedCoreTech: ['Omnichannel POS tập trung', 'Customer Data Platform (CDP)', 'Demand Forecasting AI', 'Hệ thống Loyalty đa kênh'],
    keyChallenges: 'Đồng bộ tồn kho đa kênh (Online-to-Offline) theo giây, quản trị tỷ lệ đổi trả và phân tích hành vi khách hàng.',
    description: 'Hàng trăm điểm bán/cửa hàng, lưu lượng giao dịch POS khổng lồ và yêu cầu kết nối hóa đơn điện tử máy tính tiền liên tục.'
  },
  {
    id: 'LOGISTICS_PORT',
    name: 'Logistics, Kho vận Thông minh & Cảng biển',
    icon: Truck,
    benchmarkBudget: '1.5 - 4.5 tỷ VND',
    highlightTier: 'MEDIUM',
    recommendedCoreTech: ['WMS thông minh & Robot AGV', 'TMS tối ưu lộ trình xe bằng AI', 'RFID/GPS theo dõi container', 'Cổng trao đổi dữ liệu điện tử EDI cảng'],
    keyChallenges: 'Chi phí chạy xe rỗng chiều về, nghẽn dòng chứng từ vận tải và thời gian giải phóng tàu/hàng tại cầu cảng.',
    description: 'Hệ thống trung tâm phân phối (DC) diện tích hàng chục nghìn m², đội xe vận tải liên tỉnh và dịch vụ chuỗi cung ứng 3PL/4PL.'
  },
  {
    id: 'AGRITECH_FOOD',
    name: 'Nông nghiệp Công nghệ cao & Chế biến Thực phẩm',
    icon: Wheat,
    benchmarkBudget: '800 triệu - 2.8 tỷ VND',
    highlightTier: 'LOW',
    recommendedCoreTech: ['Giám sát nông trại/nhà kính IoT', 'Truy xuất nguồn gốc Blockchain', 'Số hóa chuẩn HACCP/ISO 22000', 'ERP chế biến thủy hải sản'],
    keyChallenges: 'Kiểm soát vệ sinh an toàn thực phẩm, hao hụt sau thu hoạch và vượt qua hàng rào kiểm dịch của thị trường xuất khẩu EU/US.',
    description: 'Vùng nguyên liệu tập trung, nhà máy chế biến quy mô công nghiệp phục vụ chuỗi cung ứng xuất khẩu và nội địa.'
  },
  {
    id: 'CONSTRUCTION_REALESTATE',
    name: 'Bất động sản, Xây dựng & Quản lý Hạ tầng',
    icon: Building2,
    benchmarkBudget: '1.0 - 4.0 tỷ VND',
    highlightTier: 'MEDIUM',
    recommendedCoreTech: ['Mô hình thông tin công trình BIM 4D/5D', 'Quản lý dự án xây dựng số (PM)', 'Smart Building PMS', 'Nghiệm thu khối lượng số hóa'],
    keyChallenges: 'Kiểm soát vượt tổng mức đầu tư dự án, chồng chéo tiến độ nhà thầu phụ và quản trị an toàn lao động công trường.',
    description: 'Tổng thầu EPC, chủ đầu tư dự án khu đô thị, cao ốc hoặc các dự án hạ tầng giao thông quy mô nghìn tỷ.'
  },
  {
    id: 'FINANCE_BANKING',
    name: 'Tài chính, Ngân hàng & Bảo hiểm (BFSI)',
    icon: Landmark,
    benchmarkBudget: '2.5 - 8+ tỷ VND',
    highlightTier: 'HIGH',
    recommendedCoreTech: ['Core Banking/Finance Cloud', 'Trung tâm an ninh mạng SOC 24/7', 'eKYC & AI Fraud Detection', 'Phê duyệt tín dụng tự động'],
    keyChallenges: 'Tuân thủ nghiêm ngặt Luật An ninh mạng, bảo vệ dữ liệu tài chính cá nhân theo Nghị định 13/2023/NĐ-CP và chống gian lận.',
    description: 'Các ngân hàng thương mại, công ty tài chính, bảo hiểm với hàng triệu tài khoản và lưu lượng giao dịch tiền tệ bảo mật cao.'
  },
  {
    id: 'HEALTHCARE_PHARMA',
    name: 'Y tế, Dược phẩm & Chuỗi Bệnh viện',
    icon: Stethoscope,
    benchmarkBudget: '1.5 - 5.0 tỷ VND',
    highlightTier: 'MEDIUM',
    recommendedCoreTech: ['HIS/LIS/PACS tích hợp HL7/DICOM', 'Bệnh án điện tử EMR chuẩn Bộ Y tế', 'Quản lý kho dược chuẩn GSP/GMP', 'Hệ thống Telemedicine từ xa'],
    keyChallenges: 'Liên thông thanh toán bảo hiểm y tế, bảo mật dữ liệu hồ sơ bệnh án và chuẩn hóa đơn thuốc điện tử.',
    description: 'Bệnh viện đa khoa/chuyên khoa tư nhân quy mô lớn, chuỗi nhà thuốc hoặc nhà máy sản xuất tân dược đạt chuẩn GMP-WHO.'
  },
  {
    id: 'HOSPITALITY_TOURISM',
    name: 'Du lịch, Nghỉ dưỡng & Khách sạn Chuỗi',
    icon: Plane,
    benchmarkBudget: '800 triệu - 3.0 tỷ VND',
    highlightTier: 'LOW',
    recommendedCoreTech: ['Central Reservation System (CRS chuỗi)', 'Dynamic Pricing AI theo mùa vụ', 'Mobile App Check-in & Smart Key', 'Quản lý F&B chuỗi tập trung'],
    keyChallenges: 'Tối ưu hóa tỷ lệ lấp đầy phòng mùa thấp điểm, cân bằng biên lợi nhuận trước phí hoa hồng đại lý OTA (Booking/Agoda).',
    description: 'Tổ hợp nghỉ dưỡng, chuỗi khách sạn từ 3-5 sao, hãng hàng không hoặc tập đoàn lữ hành quốc tế.'
  },
  {
    id: 'ENERGY_UTILITIES',
    name: 'Năng lượng, Tiện ích & Viễn thông',
    icon: Zap,
    benchmarkBudget: '2.0 - 6+ tỷ VND',
    highlightTier: 'HIGH',
    recommendedCoreTech: ['Hệ thống SCADA/EMS lưới điện', 'Quản lý tài sản số doanh nghiệp EAM', 'Đo đếm xa tự động AMR/AMI', 'Digital Twin công trình năng lượng'],
    keyChallenges: 'Duy trì độ sẵn sàng 99.99% của hạ tầng truyền tải, giảm tổn thất thương mại/kỹ thuật và ứng phó tức thời sự cố.',
    description: 'Nhà máy nhiệt điện/thủy điện/năng lượng tái tạo, công ty cấp nước, xử lý môi trường hoặc doanh nghiệp viễn thông.'
  }
];

export const InvestmentReadinessPage: React.FC = () => {
  const { investmentPrefs, saveInvestmentPrefs, navigate, currentUser, currentResult } = useApp();

  // Determine if the current enterprise is large or SME
  const initialIsLarge = Boolean(
    investmentPrefs.isLargeEnterprise ||
    currentResult?.assessmentType === 'LARGE' || 
    currentUser?.company?.size === 'LARGE' || 
    (currentUser?.company?.employeeCount && currentUser.company.employeeCount > 200)
  );

  const [isLargeMode, setIsLargeMode] = useState<boolean>(initialIsLarge);
  
  // Selected Industry Sector for Large Enterprise
  const [selectedSectorId, setSelectedSectorId] = useState<string>(() => {
    if (investmentPrefs.industrySector) {
      const found = LARGE_ENTERPRISE_SECTORS.find(s => s.name === investmentPrefs.industrySector || s.id === investmentPrefs.industrySector);
      if (found) return found.id;
    }
    // Match from current company industry
    const companyInd = (currentResult?.industry || currentUser?.company?.industry || '').toLowerCase();
    if (companyInd.includes('sắt') || companyInd.includes('thép') || companyInd.includes('kim loại')) return 'STEEL_MATERIALS';
    if (companyInd.includes('sản xuất') || companyInd.includes('chế biến') || companyInd.includes('công nghiệp')) return 'MANUFACTURING_HEAVY';
    if (companyInd.includes('bán lẻ') || companyInd.includes('siêu thị')) return 'RETAIL_CHAINS';
    if (companyInd.includes('logistics') || companyInd.includes('kho') || companyInd.includes('vận tải')) return 'LOGISTICS_PORT';
    if (companyInd.includes('nông nghiệp') || companyInd.includes('thực phẩm')) return 'AGRITECH_FOOD';
    if (companyInd.includes('xây dựng') || companyInd.includes('bất động sản')) return 'CONSTRUCTION_REALESTATE';
    if (companyInd.includes('tài chính') || companyInd.includes('ngân hàng')) return 'FINANCE_BANKING';
    if (companyInd.includes('y tế') || companyInd.includes('dược')) return 'HEALTHCARE_PHARMA';
    if (companyInd.includes('du lịch') || companyInd.includes('khách sạn')) return 'HOSPITALITY_TOURISM';
    if (companyInd.includes('năng lượng') || companyInd.includes('điện')) return 'ENERGY_UTILITIES';
    return 'MANUFACTURING_HEAVY';
  });

  const [budgetTier, setBudgetTier] = useState<'LOW' | 'MEDIUM' | 'HIGH'>(investmentPrefs.budgetTier);
  const [hrReadiness, setHrReadiness] = useState<number>(investmentPrefs.hrReadiness);
  const [infraReadiness, setInfraReadiness] = useState<number>(investmentPrefs.infraReadiness);
  const [leadershipCommitment, setLeadershipCommitment] = useState<number>(investmentPrefs.leadershipCommitment);
  const [priorityPillars, setPriorityPillars] = useState<PillarId[]>(investmentPrefs.priorityPillars);
  const [timeline, setTimeline] = useState<string>(investmentPrefs.timeline || 'Quý 2/2026');

  // Budget Options for Large Enterprises vs SME
  const largeBudgetOptions = useMemo(() => [
    {
      tier: 'LOW' as const,
      title: 'Phân hệ Trọng điểm / Khởi động Chuyên sâu (500 triệu - 2 tỷ VND)',
      rangeText: '500 triệu - 2 tỷ VND',
      description: 'Phù hợp số hóa phân hệ lõi: ERP Core, CRM Enterprise, WMS tự động hoặc Hạ tầng Cloud & Bảo mật bước đầu.'
    },
    {
      tier: 'MEDIUM' as const,
      title: 'Đồng bộ Chuỗi / Đa chi nhánh & Tự động hóa (2 - 5 tỷ VND)',
      rangeText: '2 - 5 tỷ VND',
      description: 'Triển khai liên chi nhánh/nhà máy: Tự động hóa sản xuất MES/SCADA, Trung tâm an ninh SOC 24/7, tích hợp dữ liệu tập trung.'
    },
    {
      tier: 'HIGH' as const,
      title: 'Chuyển đổi số Toàn diện Cấp Tập đoàn (> 5 tỷ VND)',
      rangeText: '> 5 tỷ VND',
      description: 'Tái cấu trúc kiến trúc số tập đoàn, Data Lakehouse / Enterprise AI, Smart Factory quy mô tổ hợp và sinh thái liên kết mở.'
    }
  ], []);

  const smeBudgetOptions = useMemo(() => [
    {
      tier: 'LOW' as const,
      title: 'Quy mô Vừa & Nhỏ (Dưới 100 triệu VND)',
      rangeText: '< 100 triệu VND',
      description: 'Phù hợp giải pháp SaaS trả phí linh hoạt theo tháng/năm hoặc các gói phần mềm chuẩn hóa.'
    },
    {
      tier: 'MEDIUM' as const,
      title: 'Quy mô Trung bình (100 - 500 triệu VND)',
      rangeText: '100 - 500 triệu VND',
      description: 'Phù hợp triển khai hệ thống quản trị chuyên sâu (ERP/CRM/WMS) có tùy chỉnh và đào tạo.'
    },
    {
      tier: 'HIGH' as const,
      title: 'Quy mô Lớn trong phân khúc SME (Trên 500 triệu VND)',
      rangeText: '> 500 triệu VND',
      description: 'Phù hợp đầu tư hạ tầng đám mây riêng, hệ thống tự động hóa nhà máy MES hoặc bảo mật SOC.'
    }
  ], []);

  const activeBudgetOptions = isLargeMode ? largeBudgetOptions : smeBudgetOptions;

  const activeSector = useMemo(() => {
    return LARGE_ENTERPRISE_SECTORS.find(s => s.id === selectedSectorId) || LARGE_ENTERPRISE_SECTORS[0];
  }, [selectedSectorId]);

  const handleSelectSector = (sector: LargeEnterpriseSectorInfo) => {
    setSelectedSectorId(sector.id);
    // Automatically match highlight tier for this sector if not changed by user
    setBudgetTier(sector.highlightTier);
  };

  const togglePillar = (id: PillarId) => {
    if (priorityPillars.includes(id)) {
      if (priorityPillars.length > 1) {
        setPriorityPillars(priorityPillars.filter(p => p !== id));
      }
    } else {
      if (priorityPillars.length < 3) {
        setPriorityPillars([...priorityPillars, id]);
      } else {
        alert('Vui lòng chọn tối đa 3 trụ cột ưu tiên nhất.');
      }
    }
  };

  const handleSaveAndMatch = () => {
    const selectedBudgetObj = activeBudgetOptions.find(b => b.tier === budgetTier) || activeBudgetOptions[1];
    
    saveInvestmentPrefs({
      budgetTier,
      budgetText: selectedBudgetObj.rangeText,
      hrReadiness,
      infraReadiness,
      leadershipCommitment,
      priorityPillars,
      timeline,
      isLargeEnterprise: isLargeMode,
      industrySector: isLargeMode ? activeSector.name : (currentUser?.company?.industry || 'Bán lẻ')
    });

    navigate('/assessment/active/recommendations');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Title Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
            Bước 2: Khảo sát Năng lực & Dự toán Đầu tư
          </span>

          {/* Enterprise Size Mode Selector Switch */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setIsLargeMode(false)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                !isLargeMode 
                  ? 'bg-white text-teal-900 shadow-xs border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>SME (Thang 100đ)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsLargeMode(true)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isLargeMode 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Doanh nghiệp Lớn (Thang 695đ)</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isLargeMode 
            ? 'Khảo sát Nhóm Ngành & Khung Ngân sách Chuyển đổi số (Doanh nghiệp Lớn)' 
            : 'Khảo sát Khả năng Hấp thụ Công nghệ & Ngân sách Đầu tư'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Thuật toán AI kết hợp giữa <strong>Kết quả DBI 6 Trụ cột</strong> , 
          {isLargeMode && <strong> đặc thù nhóm ngành chuyên biệt</strong>} và <strong>năng lực tài chính</strong> để kê đơn giải pháp công nghệ có tỷ lệ thành công cao nhất cho <strong>{currentUser.company.companyName}</strong>.
        </p>

        {isLargeMode && (
          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Quy chuẩn Doanh nghiệp Lớn :</strong> Doanh nghiệp có quy mô tổ chức đa phòng ban, chuỗi nhà máy/chi nhánh cần giải pháp công nghệ có năng lực mở rộng cao (Enterprise-grade), đáp ứng các tiêu chuẩn bảo mật dữ liệu và tích hợp hệ thống phức hợp. Hãy chọn nhóm ngành bên dưới để nhận định mức ngân sách và khuyến nghị công nghệ lõi chuẩn xác nhất.
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: LỰA CHỌN NHÓM NGÀNH CHUYÊN BIỆT (CHỈ HIỂN THỊ KHI LÀ DOANH NGHIỆP LỚN) */}
      {isLargeMode && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>1. Lựa chọn Nhóm ngành Chuyên biệt của Doanh nghiệp Lớn</span>
              </h2>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                10 Nhóm ngành Trọng điểm
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Chọn nhóm ngành kinh doanh cốt lõi để AI thiết lập bộ quy tắc thẩm định giá và định mức benchmark chi phí
            </p>
          </div>

          {/* Grid 10 Sectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {LARGE_ENTERPRISE_SECTORS.map((sector) => {
              const isSelected = selectedSectorId === sector.id;
              const SectorIcon = sector.icon;

              return (
                <div
                  key={sector.id}
                  onClick={() => handleSelectSector(sector)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 text-left ${
                    isSelected 
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-600/20' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <SectorIcon className="w-4 h-4" />
                      </div>
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[11px] font-black text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                          Đang chọn
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">
                          {sector.benchmarkBudget}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-extrabold text-slate-900 leading-snug">
                      {sector.name}
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {sector.description}
                    </p>
                  </div>

                  {/* Micro tags */}
                  <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-1">
                    {sector.recommendedCoreTech.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 truncate max-w-[130px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Callout Panel for Selected Sector */}
          {activeSector && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-md border border-indigo-800/40 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                    <activeSector.icon className="w-4 h-4 text-indigo-300" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wide text-indigo-200">
                    Đặc thù Chuyển đổi số: {activeSector.name}
                  </span>
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-100 border border-indigo-400/40">
                  Benchmark tham chiếu: {activeSector.benchmarkBudget}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 pt-1">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-teal-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Công nghệ Lõi Ưu tiên Triển khai:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSector.recommendedCoreTech.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white/10 text-white font-medium text-[11px] border border-white/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Điểm nghẽn Ngành thường gặp:
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    {activeSector.keyChallenges}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: KHUNG NGÂN SÁCH DỰ KIẾN ĐẦU TƯ (ADAPTIVE TỰ ĐỘNG THEO QUY MÔ & NGÀNH) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-600" />
              <span>{isLargeMode ? '2. Khung Ngân sách Dự án Enterprise' : '1. Khung Ngân sách Dự kiến Đầu tư Chuyển đổi số'}</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {isLargeMode ? 'Định mức Doanh nghiệp Lớn' : 'Định mức SME'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isLargeMode 
              ? `Lựa chọn hạn mức ngân sách phù hợp với giai đoạn số hóa của ${activeSector.name}` 
              : 'Chọn mức ngân sách khả thi trong kế hoạch tài chính năm 2026 của doanh nghiệp'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {activeBudgetOptions.map((opt) => {
            const isSelected = budgetTier === opt.tier;
            const isIndustryRecommended = isLargeMode && activeSector.highlightTier === opt.tier;

            return (
              <div
                key={opt.tier}
                onClick={() => setBudgetTier(opt.tier)}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 relative ${
                  isSelected 
                    ? isLargeMode 
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-2 ring-indigo-600/20' 
                      : 'border-teal-600 bg-teal-50/60 shadow-xs ring-2 ring-teal-600/20' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {/* Industry Recommendation Ribbon */}
                {isIndustryRecommended && (
                  <div className="absolute -top-3 right-3 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                    Khuyên dùng cho {activeSector.name.split('&')[0]}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      {isLargeMode ? `Gói Enterprise Mức ${opt.tier === 'LOW' ? '1' : opt.tier === 'MEDIUM' ? '2' : '3'}` : 'Gói ngân sách SME'}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className={`w-5 h-5 ${isLargeMode ? 'text-indigo-600 fill-indigo-100' : 'text-teal-600 fill-teal-100'}`} />
                    )}
                  </div>
                  <div className="text-base font-extrabold text-slate-900 leading-snug">
                    {opt.rangeText}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: ĐÁNH GIÁ MỨC ĐỘ SẴN SÀNG NỘI BỘ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>{isLargeMode ? '3. Đánh giá Mức độ Sẵn sàng Nội bộ (Thang điểm 1 đến 5)' : '2. Đánh giá Mức độ Sẵn sàng Nội bộ (Thang điểm 1 đến 5)'}</span>
          </h2>
          <p className="text-xs text-slate-500">
            Mức độ hấp thụ công nghệ thực tế của đội ngũ nhân sự và năng lực cơ sở hạ tầng
          </p>
        </div>

        <div className="space-y-6 pt-2">
          {/* Slider 1: HR */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-800">Khả năng tiếp thu của Đội ngũ Nhân sự (HR Readiness)</span>
              <span className="text-teal-700 font-extrabold text-sm px-2.5 py-0.5 rounded bg-teal-100">
                {hrReadiness}/5 điểm
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={hrReadiness}
              onChange={(e) => setHrReadiness(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>1: Nhân sự ngại đổi mới</span>
              <span>3: Sẵn sàng thử nghiệm</span>
              <span>5: Thành thạo công nghệ</span>
            </div>
          </div>

          {/* Slider 2: Infra */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-800">Hạ tầng Kỹ thuật & Thiết bị hiện có (Infra Readiness)</span>
              <span className="text-blue-700 font-extrabold text-sm px-2.5 py-0.5 rounded bg-blue-100">
                {infraReadiness}/5 điểm
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={infraReadiness}
              onChange={(e) => setInfraReadiness(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>1: Máy tính cũ, mạng chập chờn</span>
              <span>3: Đã có Internet cáp quang, máy tính tốt</span>
              <span>5: Hạ tầng Cloud tiêu chuẩn</span>
            </div>
          </div>

          {/* Slider 3: Leadership */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-800">Cam kết & Quyết tâm của Ban Lãnh đạo (Leadership Commitment)</span>
              <span className="text-purple-700 font-extrabold text-sm px-2.5 py-0.5 rounded bg-purple-100">
                {leadershipCommitment}/5 điểm
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={leadershipCommitment}
              onChange={(e) => setLeadershipCommitment(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>1: Thử nghiệm không bắt buộc</span>
              <span>3: Lãnh đạo chỉ đạo chung</span>
              <span>5: Đưa vào KPI điều hành bắt buộc</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: TRỤ CỘT ƯU TIÊN & THỜI GIAN TRIỂN KHAI */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <span>{isLargeMode ? '4. Trụ cột Ưu tiên & Khung thời gian Triển khai' : '3. Trụ cột Ưu tiên & Khung thời gian Triển khai'}</span>
          </h2>
          <p className="text-xs text-slate-500">
            Chọn tối đa 3 trụ cột doanh nghiệp mong muốn giải quyết triệt để trong đợt này
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {DBI_PILLARS.map((p) => {
            const isSelected = priorityPillars.includes(p.id);
            return (
              <div
                key={p.id}
                onClick={() => togglePillar(p.id)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between text-xs font-bold ${
                  isSelected 
                    ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-2xs' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span>{p.name}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Kế hoạch thời gian bắt đầu dự án
          </label>
          <select
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-teal-600 bg-white"
          >
            <option value="Ngay trong tháng này">Ngay trong tháng này (Khẩn cấp)</option>
            <option value="Quý 2/2026">Quý 2/2026 (1 - 3 tháng tới)</option>
            <option value="Quý 3/2026">Quý 3/2026 (3 - 6 tháng tới)</option>
            <option value="Cuối năm 2026">Cuối năm 2026</option>
          </select>
        </div>
      </div>

      {/* NAVIGATION CTAS */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => navigate('/assessment/active/result')}
          className="px-5 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Xem lại Báo cáo Radar</span>
        </button>

        <button
          type="button"
          onClick={handleSaveAndMatch}
          className={`px-8 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
            isLargeMode 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-teal-600 hover:bg-teal-700 text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Kích hoạt AI Khớp nối Giải pháp {isLargeMode ? `cho ${activeSector.name.split('&')[0]}` : 'Công nghệ'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
