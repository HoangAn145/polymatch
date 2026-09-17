import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  Layers, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Upload, 
  ArrowLeft, 
  ShieldCheck, 
  Clock,
  Sparkles,
  Info,
  Check,
  Zap,
  ArrowUpRight,
  Briefcase,
  Building2,
  FileCode,
  Code2,
  Copyright
} from 'lucide-react';
import { TAXONOMY_CATALOG } from '../../data/mockData';
import { EnterpriseSize, PillarId } from '../../types';
import { VSIC_IT_INDUSTRIES, VsicItIndustry } from '../../data/vsicItIndustries';

// Tiêu chí chuẩn hóa 5 Cấp độ DBI đồng bộ 100% với Kết quả đánh giá và Đề xuất giải pháp bên phía Người Mua (QĐ 1567/QĐ-BKHCN)
export interface BuyerIndustryOption {
  id: string;
  name: string;
  group: string;
  description: string;
  typicalBuyerTechs: string[];
}

export const BUYER_RECOMMENDED_INDUSTRIES: BuyerIndustryOption[] = [
  { 
    id: 'ALL', 
    name: 'Đa ngành (Phù hợp tất cả các ngành)', 
    group: 'Dùng chung', 
    description: 'Nền tảng quản trị và hạ tầng số dùng chung cho mọi loại hình doanh nghiệp.',
    typicalBuyerTechs: ['Hệ thống ERP', 'CRM Quản trị khách hàng', 'Chữ ký số & Hóa đơn điện tử', 'Quản lý nhân sự HRM']
  },
  { 
    id: 'RETAIL', 
    name: 'Bán lẻ', 
    group: 'Thương mại & Dịch vụ', 
    description: 'Chuỗi cửa hàng bán lẻ, siêu thị mini, thương mại điện tử đa kênh.',
    typicalBuyerTechs: ['Phần mềm POS đa kênh', 'Nền tảng E-commerce', 'Quản lý kho bán lẻ WMS', 'Cổng thanh toán']
  },
  { 
    id: 'FB', 
    name: 'F&B', 
    group: 'Thương mại & Dịch vụ', 
    description: 'Nhà hàng, chuỗi cà phê - ẩm thực, dịch vụ ăn uống.',
    typicalBuyerTechs: ['POS order món QR & Bếp', 'Quản lý định lượng nguyên vật liệu', 'Kiosk tự phục vụ']
  },
  { 
    id: 'LOGISTICS', 
    name: 'Logistics', 
    group: 'Vận tải & Kho bãi', 
    description: 'Kho vận, trung tâm phân phối, giao nhận vận tải hàng hóa.',
    typicalBuyerTechs: ['WMS Quản lý kho mã vạch/RFID', 'TMS Quản trị vận tải & Đội xe', 'Định vị GPS/Sensor']
  },
  { 
    id: 'MANUFACTURING', 
    name: 'Sản xuất & Chế biến chế tạo', 
    group: 'Sản xuất & Công nghiệp', 
    description: 'Nhà máy gia công, cơ khí, chế tạo máy móc, lắp ráp linh kiện.',
    typicalBuyerTechs: ['Hệ thống MES điều hành sản xuất', 'SCADA thu thập dữ liệu máy', 'Đo lường OEE máy móc', 'Bảo trì IoT']
  },
  { 
    id: 'GARMENT', 
    name: 'May mặc', 
    group: 'Sản xuất & Công nghiệp', 
    description: 'Dệt may, da giày, gia công thời trang xuất khẩu.',
    typicalBuyerTechs: ['ERP ngành may', 'Quản lý rải chuyền tự động', 'Hệ thống CAD thiết kế rập', 'Kiểm soát lỗi may']
  },
  { 
    id: 'STEEL', 
    name: 'Sắt thép', 
    group: 'Sản xuất & Công nghiệp', 
    description: 'Luyện cán kim loại, kết cấu thép, gia công phôi thép.',
    typicalBuyerTechs: ['SCADA giám sát lò luyện nhiệt', 'Quản lý cuộn thép mã QR', 'Tích hợp trạm cân điện tử']
  },
  { 
    id: 'AUTO_MOTO', 
    name: 'Ô tô - Xe máy', 
    group: 'Sản xuất & Công nghiệp', 
    description: 'Đại lý phân phối xe, xưởng dịch vụ sửa chữa, phụ tùng xe máy ô tô.',
    typicalBuyerTechs: ['DMS Quản lý kênh đại lý phụ tùng', 'Phần mềm đặt lịch bảo dưỡng', 'Quản trị garage']
  },
  { 
    id: 'PLASTIC', 
    name: 'Nhựa', 
    group: 'Sản xuất & Công nghiệp', 
    description: 'Ép phun nhựa, hạt nhựa, sản phẩm nhựa gia dụng & công nghiệp.',
    typicalBuyerTechs: ['MES giám sát máy ép nhựa', 'Quản lý vòng đời khuôn mẫu', 'Định mức phối trộn hạt nhựa']
  },
  { 
    id: 'PACKAGING', 
    name: 'Bao bì', 
    group: 'Sản xuất & Công nghiệp', 
    description: 'Sản xuất bao bì carton, màng ghép, in ấn công nghiệp.',
    typicalBuyerTechs: ['ERP quản lý dây chuyền sóng', 'Tối ưu bình bản in', 'Kiểm soát chất lượng QC tự động']
  },
  { 
    id: 'RUBBER', 
    name: 'Cao su', 
    group: 'Sản xuất & Công nghiệp', 
    description: 'Mủ cao su tự nhiên, chế biến cao su kỹ thuật, săm lốp.',
    typicalBuyerTechs: ['Quản lý vùng trồng & thu mua mủ', 'SCADA giám sát nồi lưu hóa', 'Hóa đơn mủ cao su']
  },
  { 
    id: 'PAPER', 
    name: 'Giấy', 
    group: 'Sản xuất & Công nghiệp', 
    description: 'Bột giấy, giấy cuộn công nghiệp, chế biến lâm sản & gỗ.',
    typicalBuyerTechs: ['Giám sát tiêu hao năng lượng hơi & điện', 'SCADA xeo giấy', 'Quản lý kho giấy cuộn barcode']
  },
  { 
    id: 'MINING', 
    name: 'Khoáng sản', 
    group: 'Sản xuất & Công nghiệp', 
    description: 'Khai thác mỏ, tuyển khoáng, vật liệu xây dựng thô.',
    typicalBuyerTechs: ['GIS quản lý địa chất & trữ lượng', 'Giám sát hành trình xe ben mỏ', 'Cảm biến an toàn hầm lò']
  },
  { 
    id: 'AGRI', 
    name: 'Nông nghiệp và Chế biến nông sản', 
    group: 'Nông nghiệp & Thủy sản', 
    description: 'Trồng trọt quy mô lớn, nhà kính công nghệ cao, chế biến nông sản.',
    typicalBuyerTechs: ['IoT cảm biến đất & tưới tự động', 'Nhật ký điện tử VietGAP', 'Truy xuất nguồn gốc QR Code']
  },
  { 
    id: 'AQUA', 
    name: 'Thủy sản', 
    group: 'Nông nghiệp & Thủy sản', 
    description: 'Nuôi trồng tôm cá, nhà máy chế biến thủy sản đông lạnh xuất khẩu.',
    typicalBuyerTechs: ['IoT giám sát oxy & độ mặn ao nuôi', 'Quản lý cấp đông chuẩn HACCP', 'ERP chế biến thủy sản']
  },
  { 
    id: 'PHARMA', 
    name: 'Dược phẩm', 
    group: 'Y tế & Sức khỏe', 
    description: 'Sản xuất thuốc, dược phẩm, hóa dược y tế.',
    typicalBuyerTechs: ['ERP quản lý chuẩn GMP-WHO', 'Kiểm soát số lô & hạn dùng', 'DMS phân phối chuỗi nhà thuốc']
  },
  { 
    id: 'MED_EQUIP', 
    name: 'Thiết bị y tế', 
    group: 'Y tế & Sức khỏe', 
    description: 'Thiết bị chẩn đoán hình ảnh, vật tư y tế, sinh phẩm xét nghiệm.',
    typicalBuyerTechs: ['Quản lý thiết bị chuẩn ISO 13485', 'Phần mềm bảo dưỡng định kỳ máy y tế']
  },
  { 
    id: 'HEALTH_BEAUTY', 
    name: 'Sức khỏe – Sắc đẹp', 
    group: 'Y tế & Sức khỏe', 
    description: 'Phòng khám đa khoa, nha khoa, thẩm mỹ viện & Spa.',
    typicalBuyerTechs: ['Phần mềm phòng khám HIS', 'Hồ sơ bệnh án điện tử EMR', 'Đặt lịch hẹn trực tuyến']
  },
  { 
    id: 'EDU', 
    name: 'Giáo dục Đào tạo', 
    group: 'Giáo dục & Đào tạo', 
    description: 'Trường học, trung tâm ngoại ngữ, viện đào tạo, EdTech.',
    typicalBuyerTechs: ['Nền tảng LMS học trực tuyến', 'Cổng tuyển sinh & sổ liên lạc điện tử', 'Ngân hàng thi trắc nghiệm']
  },
  { 
    id: 'CONSTRUCTION', 
    name: 'Xây dựng', 
    group: 'Xây dựng & Bất động sản', 
    description: 'Tổng thầu thi công xây dựng, hạ tầng, sản xuất vật liệu.',
    typicalBuyerTechs: ['Mô hình thông tin công trình BIM', 'Quản lý nhật ký công trường App', 'Nghiệm thu khối lượng số']
  },
  { 
    id: 'REAL_ESTATE', 
    name: 'Bất động sản', 
    group: 'Xây dựng & Bất động sản', 
    description: 'Chủ đầu tư, sàn môi giới phân phối, quản lý vận hành tòa nhà.',
    typicalBuyerTechs: ['CRM Bất động sản & Quản lý giỏ hàng', 'App cư dân ban quản lý tòa nhà BMS']
  },
  { 
    id: 'TOURISM', 
    name: 'Du lịch & Lữ hành', 
    group: 'Du lịch & Khách sạn', 
    description: 'Công ty lữ hành quốc tế, đại lý vé máy bay, đặt tour.',
    typicalBuyerTechs: ['Hệ thống bán tour trực tuyến', 'Cổng thanh toán vé đa tệ', 'Phần mềm điều hành tour']
  },
  { 
    id: 'HOSPITALITY', 
    name: 'Lưu trú - Khách sạn', 
    group: 'Du lịch & Khách sạn', 
    description: 'Khách sạn, resort, khu nghỉ dưỡng, căn hộ dịch vụ.',
    typicalBuyerTechs: ['Hệ thống quản lý khách sạn PMS', 'Channel Manager kết nối OTA', 'Khóa thông minh IoT']
  },
  { 
    id: 'ACCOUNTING', 
    name: 'Dịch vụ kế toán', 
    group: 'Tài chính & Dịch vụ', 
    description: 'Công ty đại lý thuế, dịch vụ kế toán, tư vấn kiểm toán.',
    typicalBuyerTechs: ['Phần mềm kế toán đa công ty', 'Hóa đơn điện tử & Kê khai thuế tự động']
  },
  { 
    id: 'PASSENGER_TRANS', 
    name: 'Vận tải hành khách', 
    group: 'Vận tải & Kho bãi', 
    description: 'Nhà xe vận chuyển hành khách liên tỉnh, xe buýt, taxi.',
    typicalBuyerTechs: ['Nền tảng đặt vé & chọn chỗ ngồi', 'Lệnh xuất bến điện tử', 'Giám sát camera hành trình']
  },
  { 
    id: 'PETRO', 
    name: 'Xăng dầu', 
    group: 'Năng lượng & Tiện ích', 
    description: 'Cây xăng, tổng kho xăng dầu, bán lẻ nhiên liệu khí đốt.',
    typicalBuyerTechs: ['Tự động hóa kết nối cột bơm', 'Quản lý bồn chứa ngầm', 'Hóa đơn điện tử từng lần bơm']
  },
  { 
    id: 'ENVIRONMENT', 
    name: 'Môi trường', 
    group: 'Năng lượng & Tiện ích', 
    description: 'Xử lý nước thải công nghiệp, thu gom và tái chế chất thải.',
    typicalBuyerTechs: ['Hệ thống quan trắc tự động truyền Sở TN&MT', 'Quản lý định vị xe thu gom rác']
  }
];

export interface DbiLevelCriterion {
  level: number;
  code: string;
  shortTitle: string;
  scoreRange: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  activeBorder: string;
  activeBg: string;
  activeRing: string;
  typicalTechs: string[];
  buyerDiagnosticRole: string;
}

export const VENDOR_DBI_CRITERIA: DbiLevelCriterion[] = [
  {
    level: 1,
    code: 'Mức 1 – Khởi động',
    shortTitle: 'Khởi động',
    scoreRange: '< 25 điểm (SME) | 70 - 173đ (Lớn)',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
    badgeBorder: 'border-rose-200',
    activeBorder: 'border-rose-600',
    activeBg: 'bg-rose-50/80',
    activeRing: 'ring-rose-500/20',
    typicalTechs: ['Hóa đơn điện tử & Chữ ký số', 'Phần mềm kế toán cơ bản', 'Email doanh nghiệp', 'Website & Bán hàng đơn kênh'],
    buyerDiagnosticRole: 'Đề xuất khi Buyer vận hành thủ công, cần trang bị công cụ số cơ sở để vượt qua giai đoạn khởi tạo.'
  },
  {
    level: 2,
    code: 'Mức 2 – Bắt đầu',
    shortTitle: 'Bắt đầu kết nối',
    scoreRange: '25 - 49 điểm (SME) | 174 - 347đ (Lớn)',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    activeBorder: 'border-amber-600',
    activeBg: 'bg-amber-50/80',
    activeRing: 'ring-amber-500/20',
    typicalTechs: ['Omnichannel POS đa kênh', 'CRM Quản trị khách hàng', 'WMS quản lý kho mã vạch/RFID', 'Cổng thanh toán trực tuyến'],
    buyerDiagnosticRole: 'Đề xuất khi Buyer gặp điểm nghẽn dữ liệu rời rạc giữa bán hàng - kho - kế toán, cần liên thông hệ thống.'
  },
  {
    level: 3,
    code: 'Mức 3 – Hình thành',
    shortTitle: 'Hình thành',
    scoreRange: '50 - 74 điểm (SME) | 348 - 521đ (Lớn)',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    badgeBorder: 'border-blue-200',
    activeBorder: 'border-blue-600',
    activeBg: 'bg-blue-50/80',
    activeRing: 'ring-blue-500/20',
    typicalTechs: ['ERP quản trị tổng thể doanh nghiệp', 'WMS tự động hóa kho bãi', 'Dashboard BI phân tích thông minh', 'Tự động hóa quy trình RPA'],
    buyerDiagnosticRole: 'Đề xuất để chuẩn hóa điều hành liên phòng ban, số hóa 50-75% quy trình nghiệp vụ và bứt phá lên Mức 3.'
  },
  {
    level: 4,
    code: 'Mức 4 – Nâng cao',
    shortTitle: 'Nâng cao / Tối ưu',
    scoreRange: '75 - 89 điểm (SME) | 522 - 625đ (Lớn)',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-800',
    badgeBorder: 'border-teal-200',
    activeBorder: 'border-teal-600',
    activeBg: 'bg-teal-50/80',
    activeRing: 'ring-teal-500/20',
    typicalTechs: ['Tự động hóa sản xuất MES / SCADA', 'AI/ML Dự báo nhu cầu thị trường', 'Bảo trì dự đoán thiết bị IoT', 'Trung tâm an ninh mạng SOC 24/7'],
    buyerDiagnosticRole: 'Đề xuất khi Buyer đã hoàn thiện nền tảng số, cần tối ưu hóa vận hành bằng dữ liệu thời gian thực và tự động hóa cao.'
  },
  {
    level: 5,
    code: 'Mức 5 – Dẫn dắt',
    shortTitle: 'Dẫn dắt / Toàn diện',
    scoreRange: '≥ 90 điểm (SME) | ≥ 626đ (Lớn)',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
    badgeBorder: 'border-indigo-200',
    activeBorder: 'border-indigo-600',
    activeBg: 'bg-indigo-50/80',
    activeRing: 'ring-indigo-500/20',
    typicalTechs: ['Hệ sinh thái mở (Open API Platform)', 'Data Lakehouse / Big Data', 'Digital Twin mô phỏng số', 'Nền tảng thương mại số toàn cầu'],
    buyerDiagnosticRole: 'Đề xuất cho doanh nghiệp số hàng đầu xây dựng hệ sinh thái mở, dẫn dắt đổi mới mô hình kinh doanh số.'
  }
];

export const VendorListingCreator: React.FC = () => {
  const { techCatalog, addListing, currentUser, navigate } = useApp();

  // Strict Closed Taxonomy: Selected taxonomy item from pre-defined catalog
  const [selectedVsicCode, setSelectedVsicCode] = useState<string>('6201');
  const [selectedTechId, setSelectedTechId] = useState<string>(techCatalog[0]?.id_tech || 'TECH-ERP-01');
  const [selectedIndustryName, setSelectedIndustryName] = useState<string>('Đa ngành (Phù hợp tất cả các ngành)');
  const [commercialName, setCommercialName] = useState('');
  const [priceMin, setPriceMin] = useState<number>(30000000);
  const [priceMax, setPriceMax] = useState<number>(150000000);
  const [priceUnit, setPriceUnit] = useState<string>('VND / năm');
  const [targetLevels, setTargetLevels] = useState<number[]>([2, 3]);
  const [targetSizes, setTargetSizes] = useState<EnterpriseSize[]>(['SME']);
  const [summary, setSummary] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'Tích hợp phân hệ kế toán chuẩn hóa Thông tư 133/200',
    'Tự động hóa phê duyệt đơn hàng đa cấp qua Mobile App',
    'Báo cáo quản trị dòng tiền và tồn kho thời gian thực'
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [brochureUploaded, setBrochureUploaded] = useState(false);
  const [ipCertificateUploaded, setIpCertificateUploaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  // Find active taxonomy definition, industry definition & VSIC IT classification
  const matchedVsic = VSIC_IT_INDUSTRIES.find(v => v.code === selectedVsicCode.trim() || v.subCode === selectedVsicCode.trim());
  const currentVsic = matchedVsic || {
    code: selectedVsicCode.trim() || '6201',
    subCode: `${selectedVsicCode.trim() || '6201'}0`,
    name: 'Ngành Công nghệ thông tin & Dịch vụ số',
    shortName: 'Dịch vụ số',
    groupCode: '62',
    groupName: 'Nhóm ngành kinh tế',
    legalBasis: '',
    description: '',
    typicalSolutions: [],
    defaultTechId: 'TECH-ERP-01',
    supportedTechIds: [],
    pillarId: 'OPERATIONS' as PillarId
  };
  const currentTaxonomy = techCatalog.find(t => t.id_tech === selectedTechId) || techCatalog[0];
  const currentIndustry = BUYER_RECOMMENDED_INDUSTRIES.find(i => i.name === selectedIndustryName) || BUYER_RECOMMENDED_INDUSTRIES[0];

  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setFeatures([...features, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== idx));
    }
  };

  const toggleLevel = (lvl: number) => {
    if (targetLevels.includes(lvl)) {
      if (targetLevels.length > 1) {
        setTargetLevels(targetLevels.filter(l => l !== lvl));
      }
    } else {
      setTargetLevels([...targetLevels, lvl].sort());
    }
  };

  const toggleSize = (size: EnterpriseSize) => {
    if (targetSizes.includes(size)) {
      if (targetSizes.length > 1) {
        setTargetSizes(targetSizes.filter(s => s !== size));
      }
    } else {
      setTargetSizes([...targetSizes, size]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (priceMin > priceMax) {
      setErrorMsg('Giá tối thiểu không được lớn hơn giá tối đa.');
      return;
    }

    if (!summary.trim()) {
      setErrorMsg('Vui lòng nhập tóm tắt mô tả giải pháp.');
      return;
    }

    setErrorMsg('');

    // Generate listing using STRICT CLOSED TAXONOMY
    const finalTechTitle = commercialName.trim() 
      ? `${commercialName.trim()} (${currentTaxonomy.standardName})`
      : currentTaxonomy.standardName;

    addListing({
      vendorId: currentUser.id,
      vendorName: currentUser.company.companyName,
      vendorMst: currentUser.company.mst,
      id_tech: currentTaxonomy.id_tech, // strictly from closed taxonomy
      techName: finalTechTitle,
      pillarId: currentTaxonomy.pillarId,
      industry: selectedIndustryName,
      targetIndustries: selectedIndustryName === 'Đa ngành (Phù hợp tất cả các ngành)'
        ? ['Đa ngành', ...BUYER_RECOMMENDED_INDUSTRIES.filter(i => i.id !== 'ALL').map(i => i.name)]
        : [selectedIndustryName],
      vsicCode: currentVsic.code,
      vsicName: `${currentVsic.name} (Mã cấp 5: ${currentVsic.subCode})`,
      priceMin,
      priceMax,
      priceUnit,
      targetDbiLevels: targetLevels,
      targetSizes,
      features,
      summary,
      brochurePdfName: brochureUploaded ? 'Brochure_Giai_Phap_DBI.pdf' : undefined,
      ipCertificateFile: ipCertificateUploaded ? 'Giay_Chung_Nhan_Dang_Ky_Quyen_SHTT.pdf' : undefined,
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      status: 'PENDING_REVIEW', // Undergoes 24h SLA review
      rating: 5.0,
      reviewCount: 0
    });

    setSuccessSubmitted(true);
    setTimeout(() => {
      navigate('/vendor/listings');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/vendor')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Bảng điều khiển Vendor</span>
      </button>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Quy chế Niêm yết Chuẩn hóa DBI (Closed Taxonomy)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Đăng ký Niêm yết Giải pháp Công nghệ
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Để đảm bảo tính khách quan và tự động hóa khớp nối với kết quả đánh giá DBI của doanh nghiệp, danh mục công nghệ bắt buộc phải được chuẩn hóa theo mã phân loại danh mục đóng <strong>(Closed Taxonomy id_tech)</strong>.
        </p>
      </div>

      {successSubmitted ? (
        <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-emerald-950">Gửi hồ sơ Giải pháp thành công!</h2>
          <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
            Giải pháp <strong>{commercialName || currentTaxonomy.standardName}</strong> đã được chuyển tới hàng đợi kiểm duyệt của Ban Quản trị. Thời gian phê duyệt theo SLA: <strong>24 giờ làm việc</strong>.
          </p>
          <div className="text-xs text-slate-500">Đang chuyển tiếp tới danh sách giải pháp...</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SECTION 1: STRICT CLOSED TAXONOMY & INDUSTRY CLASSIFICATION */}
          <div className="bg-white rounded-2xl border-2 border-blue-600/30 p-6 sm:p-8 shadow-xs space-y-6 bg-gradient-to-br from-white to-blue-50/20">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>1. Phân loại Ngành & Mã ngành Kinh tế (VSIC) <span className="text-rose-500">* (Bắt buộc)</span></span>
                </label>
              </div>
              <p className="text-xs text-slate-500">
                Chuẩn hóa phân loại ngành ứng dụng và mã ngành kinh tế (VSIC) phục vụ thẩm định hồ sơ và tự động đề xuất giải pháp cho doanh nghiệp.
              </p>
            </div>

            {/* 1.1 PHÂN LOẠI NGÀNH ÁP DỤNG (ĐỒNG BỘ 25 NGÀNH BÊN PHÍA NGƯỜI MUA) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>Phân loại Ngành ứng dụng (Chuẩn hóa theo 25 ngành kinh tế bên phía Người Mua) <span className="text-rose-500">*</span></span>
                </label>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider"></span>
              </div>

              <select
                value={selectedIndustryName}
                onChange={(e) => setSelectedIndustryName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs"
              >
                {Array.from(new Set(BUYER_RECOMMENDED_INDUSTRIES.map(i => i.group))).map(groupName => (
                  <optgroup key={groupName} label={`── ${groupName} ──`}>
                    {BUYER_RECOMMENDED_INDUSTRIES.filter(i => i.group === groupName).map(item => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {/* Quick Select Industry Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500 mr-1">Chọn nhanh ngành:</span>
                {[
                  'Đa ngành (Phù hợp tất cả các ngành)',
                  'Bán lẻ',
                  'F&B',
                  'Logistics',
                  'Sản xuất & Chế biến chế tạo',
                  'May mặc',
                  'Dược phẩm',
                  'Giáo dục Đào tạo',
                  'Xây dựng'
                ].map((indName) => {
                  const isPicked = selectedIndustryName === indName;
                  return (
                    <button
                      key={indName}
                      type="button"
                      onClick={() => setSelectedIndustryName(indName)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        isPicked
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {indName.split('(')[0].trim()}
                    </button>
                  );
                })}
              </div>

              {/* Industry Diagnostics Matching Box */}
              <div className="p-4 rounded-xl bg-blue-50/90 border border-blue-200 text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-blue-950 text-sm">
                      {currentIndustry.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-200/80 text-blue-900">
                      Nhóm: {currentIndustry.group}
                    </span>
                  </div>
                </div>
                <p className="text-blue-950/80 text-[11px] leading-relaxed">
                  {currentIndustry.description}
                </p>
                <div className="pt-2 border-t border-blue-200/70 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="font-bold text-blue-950">Giải pháp mẫu đề xuất bên Buyer:</span>
                  {currentIndustry.typicalBuyerTechs.map((tech, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white text-slate-700 border border-blue-200 font-medium text-[10px]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 1.2 MÃ NGÀNH VSIC - CHỈ CẦN NHẬP MÃ SỐ */}
            <div className="space-y-2 pt-3 border-t border-blue-200/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>Mã số ngành VSIC <span className="text-rose-500">* (Bắt buộc)</span></span>
                </label>
                {matchedVsic && (
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {matchedVsic.name}
                  </span>
                )}
              </div>

              <input
                type="text"
                value={selectedVsicCode}
                onChange={(e) => {
                  const newCode = e.target.value.trim();
                  setSelectedVsicCode(newCode);
                  const vsicObj = VSIC_IT_INDUSTRIES.find(v => v.code === newCode || v.subCode === newCode);
                  if (vsicObj && !vsicObj.supportedTechIds.includes(selectedTechId)) {
                    setSelectedTechId(vsicObj.defaultTechId);
                  }
                }}
                placeholder="Nhập mã số VSIC (Ví dụ: 6201, 6202, 6311, 5820...)"
                className="w-full px-4 py-2.5 rounded-xl border border-blue-300 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs"
              />

              {matchedVsic ? (
                <p className="text-[11px] text-slate-500">
                  Mã ngành: <strong className="text-slate-800 font-mono">{matchedVsic.code}</strong> (Cấp 5: <span className="font-mono">{matchedVsic.subCode}</span>) - {matchedVsic.name}
                </p>
              ) : selectedVsicCode ? (
                <p className="text-[11px] text-slate-500">
                  Mã số đã nhập: <strong className="text-slate-800 font-mono">{selectedVsicCode}</strong>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Nhập mã số 4 chữ số hoặc 5 chữ số của ngành công nghệ thông tin theo hệ thống VSIC.
                </p>
              )}
            </div>

            {/* 1.3 TÊN THƯƠNG MẠI CỦA GIẢI PHÁP */}
            <div className="pt-2 border-t border-blue-200/60">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên thương mại / Phiên bản giải pháp của bạn (Tùy chọn bổ trợ)
              </label>
              <input
                type="text"
                placeholder="VD: SmartERP Cloud SME Edition, CyberGuard 2026..."
                value={commercialName}
                onChange={(e) => setCommercialName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>
          </div>

          {/* SECTION 2: PRICING & TARGET LEVEL */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-teal-600" />
              <span>2. Khung Chi phí & Mức độ DBI Khuyến nghị</span>
            </h3>

            {/* Price inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giá tối thiểu (VND) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000000}
                  required
                  value={priceMin}
                  onChange={(e) => setPriceMin(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giá tối đa (VND) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000000}
                  required
                  value={priceMax}
                  onChange={(e) => setPriceMax(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đơn vị tính chi phí <span className="text-rose-500">*</span>
                </label>
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-blue-600 bg-white"
                >
                  <option value="VND / tháng">VND / tháng (SaaS)</option>
                  <option value="VND / năm">VND / năm</option>
                  <option value="VND / trọn gói">VND / trọn gói (Vĩnh viễn)</option>
                  <option value="VND / người dùng / tháng">VND / người dùng / tháng</option>
                </select>
              </div>
            </div>

            {/* Target DBI Levels - Đồng bộ Tiêu chí Mức độ DBI Đề xuất Bên Phía Người Mua */}
            <div id="vendor-dbi-level-selector" className="space-y-3.5 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tiêu chí Mức độ DBI Đăng ký (Đồng bộ Đề xuất Phía Người Mua)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setTargetLevels([2, 3])}
                    className="text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors border border-blue-200"
                  >
                    Mức 2 & 3 (Phổ biến)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetLevels([1, 2, 3, 4, 5])}
                    className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors border border-slate-200"
                  >
                    Chọn tất cả
                  </button>
                </div>
              </div>

              {/* Thông tin đối soát 2 chiều với Người mua */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-teal-50/60 border border-blue-200 text-xs text-blue-950 space-y-1">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Cơ chế ghép nối giải pháp công nghệ với Doanh nghiệp Người Mua:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px] text-blue-900/80">
                  <div className="flex items-start gap-1.5 bg-white/70 p-2 rounded-lg border border-blue-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                    <span><strong>1. Khắc phục Điểm nghẽn:</strong> Đề xuất ưu tiên nếu giải pháp thuộc Trụ cột DBI có điểm số thấp nhất của Buyer.</span>
                  </div>
                  <div className="flex items-start gap-1.5 bg-white/70 p-2 rounded-lg border border-blue-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <span><strong>2. Bứt phá Cấp độ:</strong> Đề xuất nâng hạng khi Cấp độ giải pháp = Cấp độ hiện tại của Buyer + 1.</span>
                  </div>
                </div>
              </div>

              {/* Danh sách 5 Cấp độ Tiêu chí DBI */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {VENDOR_DBI_CRITERIA.map((criterion) => {
                  const isSelected = targetLevels.includes(criterion.level);
                  return (
                    <button
                      type="button"
                      key={criterion.level}
                      onClick={() => toggleLevel(criterion.level)}
                      className={`relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                        isSelected 
                          ? `${criterion.activeBorder} ${criterion.activeBg} ring-2 ${criterion.activeRing} shadow-xs` 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-wider ${criterion.badgeBg} ${criterion.badgeText} ${criterion.badgeBorder}`}>
                          Mức {criterion.level}
                        </span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-slate-100'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="text-base font-black text-slate-900 tracking-tight mt-1 mb-0.5">
                        Mức {criterion.level}
                      </div>

                      <div className="text-xs font-bold text-slate-600">
                        {criterion.shortTitle}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Current Selection summary */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="font-bold text-slate-600">Đã chọn ({targetLevels.length} cấp độ):</span>
                {targetLevels.length === 0 ? (
                  <span className="text-rose-600 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    Vui lòng chọn tối thiểu 1 cấp độ DBI
                  </span>
                ) : (
                  targetLevels.sort().map(lvl => {
                    const crit = VENDOR_DBI_CRITERIA.find(c => c.level === lvl);
                    return (
                      <span key={lvl} className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black border ${crit?.badgeBg} ${crit?.badgeText} ${crit?.badgeBorder}`}>
                        {crit?.code}
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            {/* Target Sizes */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700">
                Quy mô doanh nghiệp tối ưu
              </label>
              <div className="flex gap-4">
                {(['SME', 'LARGE'] as EnterpriseSize[]).map((size) => (
                  <label key={size} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={targetSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span>{size === 'SME' ? 'Doanh nghiệp vừa và nhỏ (SME)' : 'Doanh nghiệp Lớn (Large Enterprise)'}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: FEATURES & SUMMARY */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-sm font-extrabold text-slate-900">
              3. Mô tả Giải pháp & Tính năng Nổi bật
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tóm tắt giá trị mang lại cho doanh nghiệp <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Mô tả ngắn gọn về giải pháp, năng lực giải quyết điểm nghẽn chuyển đổi số..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Dynamic Features List */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Các tính năng chính (Tối thiểu 3 tính năng)
              </label>

              <div className="space-y-2">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const updated = [...features];
                        updated[idx] = e.target.value;
                        setFeatures(updated);
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Xóa tính năng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Thêm tính năng mới..."
                  value={newFeatureInput}
                  onChange={(e) => setNewFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm</span>
                </button>
              </div>
            </div>

            {/* Upload Brochure & SLA notice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Tài liệu Giới thiệu Kỹ thuật (Brochure PDF)</span>
                  {brochureUploaded && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã tải lên
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setBrochureUploaded(true)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>{brochureUploaded ? 'Thay đổi tài liệu PDF' : 'Tải lên Brochure giải pháp (.pdf)'}</span>
                </button>
              </div>

              {/* Upload Giấy Đăng ký Quyền sở hữu trí tuệ */}
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Copyright className="w-3.5 h-3.5 text-purple-700" />
                    <span className="text-xs font-bold text-purple-950">Giấy Đăng ký Quyền Sở hữu trí tuệ</span>
                  </div>
                  {ipCertificateUploaded && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã đính kèm
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-purple-900/80">
                  Giấy chứng nhận bản quyền phần mềm / sáng chế (Cục Bản quyền tác giả, Cục SHTT).
                </p>
                <button
                  type="button"
                  onClick={() => setIpCertificateUploaded(true)}
                  className="px-4 py-2 bg-white hover:bg-purple-100/60 text-purple-800 border border-purple-300 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-purple-600" />
                  <span>{ipCertificateUploaded ? 'Thay đổi Giấy SHTT' : 'Tải lên Giấy Đăng ký Quyền SHTT (.pdf)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Submit Action & SLA reminder */}
          <div className="p-6 rounded-2xl bg-blue-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                <Clock className="w-4 h-4" />
                <span>Cam kết thời gian thẩm định (SLA: 24 giờ)</span>
              </div>
              <p className="text-xs text-blue-100">
                Sau khi gửi, chuyên viên DBI sẽ rà soát sự tương thích của giải pháp trước khi hiển thị chính thức trên Sàn.
              </p>
            </div>

            <button
              type="submit"
              className="shrink-0 px-8 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              Gửi Hồ sơ Phê duyệt
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
