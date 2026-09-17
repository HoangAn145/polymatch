import { PillarId } from '../types';

export interface VsicItIndustry {
  code: string; // 4-digit VSIC code e.g. "6201"
  subCode: string; // 5-digit VSIC code e.g. "62010"
  name: string; // Official standard name in VSIC
  shortName: string;
  groupCode: string; // e.g. "62"
  groupName: string; // e.g. "Nhóm 62: Lập trình máy tính, tư vấn và hoạt động liên quan"
  legalBasis: string; // "Quyết định số 27/2018/QĐ-TTg"
  description: string;
  typicalSolutions: string[];
  defaultTechId: string;
  supportedTechIds: string[];
  pillarId: PillarId;
}

export const VSIC_IT_INDUSTRIES: VsicItIndustry[] = [
  {
    code: '6201',
    subCode: '62010',
    name: 'Lập trình máy tính',
    shortName: 'Lập trình phần mềm ứng dụng',
    groupCode: '62',
    groupName: 'Nhóm 62: Lập trình máy tính, dịch vụ tư vấn và quản trị hệ thống',
    legalBasis: '',
    description: 'Bao gồm hoạt động viết, sửa đổi, thử nghiệm và hỗ trợ phần mềm theo yêu cầu; lập trình ứng dụng doanh nghiệp (ERP, CRM, HRM, MES, POS, WMS), ứng dụng di động, hệ thống cơ sở dữ liệu chuyên ngành.',
    typicalSolutions: [
      'Hệ thống ERP quản trị nguồn lực',
      'Phần mềm CRM quản lý khách hàng',
      'Hệ thống HRM quản trị nhân sự số',
      'Hệ thống MES điều hành sản xuất',
      'Phần mềm WMS quản lý kho thông minh'
    ],
    defaultTechId: 'TECH-ERP-01',
    supportedTechIds: ['TECH-ERP-01', 'TECH-CRM-02', 'TECH-HRM-03', 'TECH-MES-05', 'TECH-WMS-04'],
    pillarId: 'OPERATIONS'
  },
  {
    code: '6202',
    subCode: '62020',
    name: 'Tư vấn máy tính và quản trị hệ thống máy tính',
    shortName: 'Tư vấn CNTT & Quản trị hệ thống',
    groupCode: '62',
    groupName: 'Nhóm 62: Lập trình máy tính, dịch vụ tư vấn và quản trị hệ thống',
    legalBasis: '',
    description: 'Bao gồm hoạt động lập kế hoạch và thiết kế hệ thống máy tính tích hợp phần cứng, phần mềm và công nghệ truyền thông; quản trị và vận hành hệ thống hạ tầng mạng, máy chủ tại chỗ hoặc đám mây.',
    typicalSolutions: [
      'Tư vấn kiến trúc CNTT & Chuyển đổi số',
      'Tích hợp hệ thống phần mềm & phần cứng',
      'Quản trị hạ tầng mạng & hệ thống máy chủ',
      'Dịch vụ vận hành ủy thác hệ thống CNTT (Managed IT)'
    ],
    defaultTechId: 'TECH-CLOUD-09',
    supportedTechIds: ['TECH-CLOUD-09', 'TECH-IOT-12'],
    pillarId: 'INFRASTRUCTURE_TECH'
  },
  {
    code: '6209',
    subCode: '62090',
    name: 'Hoạt động dịch vụ công nghệ thông tin và dịch vụ khác liên quan đến máy tính',
    shortName: 'Dịch vụ CNTT, An ninh mạng & RPA',
    groupCode: '62',
    groupName: 'Nhóm 62: Lập trình máy tính, dịch vụ tư vấn và quản trị hệ thống',
    legalBasis: '',
    description: 'Bao gồm dịch vụ an toàn thông tin mạng, cài đặt phần mềm, khôi phục dữ liệu sau sự cố máy tính, giám sát an ninh mạng SOC, giải pháp tự động hóa quy trình nghiệp vụ bằng robot phần mềm (RPA).',
    typicalSolutions: [
      'An toàn thông tin mạng & Phòng chống mã độc (Cybersecurity)',
      'Tự động hóa quy trình nghiệp vụ RPA',
      'Dịch vụ kiểm thử xâm nhập & Đánh giá an ninh (Pentest)',
      'Giải pháp phòng chống thất thoát dữ liệu DLP'
    ],
    defaultTechId: 'TECH-SEC-06',
    supportedTechIds: ['TECH-SEC-06', 'TECH-RPA-10'],
    pillarId: 'DATA_SECURITY'
  },
  {
    code: '6311',
    subCode: '63110',
    name: 'Xử lý dữ liệu, cho thuê và các hoạt động liên quan (Điện toán đám mây & Hosting)',
    shortName: 'Xử lý dữ liệu, Cloud & Phân tích BI',
    groupCode: '63',
    groupName: 'Nhóm 63: Hoạt động dịch vụ thông tin & Điện toán đám mây',
    legalBasis: '',
    description: 'Cung cấp cơ sở hạ tầng cho thuê hosting, điện toán đám mây (Cloud Server, SaaS, PaaS, IaaS), lưu trữ và xử lý dữ liệu tập trung, phân tích dữ liệu lớn (Big Data Analytics) và báo cáo thông minh kinh doanh (BI).',
    typicalSolutions: [
      'Nền tảng Điện toán đám mây (Cloud Computing)',
      'Hệ thống Phân tích Dữ liệu lớn & Báo cáo BI Dashboard',
      'Hạ tầng Kho dữ liệu số tập trung (Data Warehouse)',
      'Nền tảng Trí tuệ nhân tạo khai phá dữ liệu (AI Analytics)'
    ],
    defaultTechId: 'TECH-BI-07',
    supportedTechIds: ['TECH-BI-07', 'TECH-CLOUD-09', 'TECH-AICARE-11'],
    pillarId: 'INFRASTRUCTURE_TECH'
  },
  {
    code: '6312',
    subCode: '63120',
    name: 'Cổng thông tin (Web portals & Sàn thương mại điện tử)',
    shortName: 'Cổng thông tin & Nền tảng số',
    groupCode: '63',
    groupName: 'Nhóm 63: Hoạt động dịch vụ thông tin & Điện toán đám mây',
    legalBasis: '',
    description: 'Vận hành các trang web đóng vai trò cổng thông tin Internet, sàn giao dịch thương mại điện tử trực tuyến B2B/B2C, cổng dịch vụ số tương tác đa kênh giữa doanh nghiệp và khách hàng.',
    typicalSolutions: [
      'Nền tảng Thương mại điện tử B2B/B2C đa kênh',
      'Cổng thông tin dịch vụ khách hàng trực tuyến (Customer Portal)',
      'Hệ sinh thái ứng dụng kết nối đối tác số',
      'Nền tảng chăm sóc khách hàng tự động đa kênh'
    ],
    defaultTechId: 'TECH-CRM-02',
    supportedTechIds: ['TECH-CRM-02', 'TECH-AICARE-11'],
    pillarId: 'CUSTOMER_EXPERIENCE'
  },
  {
    code: '5820',
    subCode: '58200',
    name: 'Xuất bản phần mềm (Phần mềm thương mại đóng gói)',
    shortName: 'Xuất bản phần mềm & Văn phòng số',
    groupCode: '58',
    groupName: 'Nhóm 58: Hoạt động xuất bản phần mềm',
    legalBasis: '',
    description: 'Sản xuất, đóng gói và phát hành bản quyền phần mềm thương mại sẵn sàng sử dụng: phần mềm văn phòng điện tử E-Office, hóa đơn điện tử, chữ ký số, phần mềm kế toán đóng gói chuẩn mực pháp lý.',
    typicalSolutions: [
      'Văn phòng số E-Office & Trình ký điện tử không giấy tờ',
      'Hệ thống Hóa đơn điện tử & Chữ ký số chuẩn thuế',
      'Phần mềm Kế toán thương mại đóng gói',
      'Phần mềm Quản lý tài liệu và lưu trữ số hóa'
    ],
    defaultTechId: 'TECH-EOFFICE-08',
    supportedTechIds: ['TECH-EOFFICE-08'],
    pillarId: 'STRATEGY'
  },
  {
    code: '6110',
    subCode: '61100',
    name: 'Hoạt động viễn thông có dây',
    shortName: 'Viễn thông có dây & Mạng truyền số liệu',
    groupCode: '61',
    groupName: 'Nhóm 61: Hoạt động viễn thông & Kết nối mạng',
    legalBasis: '',
    description: 'Vận hành, bảo dưỡng hoặc cung cấp quyền truy nhập hạ tầng truyền dẫn số qua cáp quang, mạng trục tốc độ cao, kênh thuê riêng Leased Line phục vụ truyền dữ liệu bảo mật cho doanh nghiệp.',
    typicalSolutions: [
      'Kênh thuê riêng Internet cáp quang Leased Line',
      'Mạng truyền số liệu diện rộng WAN bảo mật',
      'Hạ tầng kết nối mạng nội bộ trung tâm dữ liệu',
      'Dịch vụ kết nối mạng đường trục băng thông rộng'
    ],
    defaultTechId: 'TECH-CLOUD-09',
    supportedTechIds: ['TECH-CLOUD-09'],
    pillarId: 'INFRASTRUCTURE_TECH'
  },
  {
    code: '6120',
    subCode: '61200',
    name: 'Hoạt động viễn thông không dây',
    shortName: 'Viễn thông không dây & Kết nối IoT',
    groupCode: '61',
    groupName: 'Nhóm 61: Hoạt động viễn thông & Kết nối mạng',
    legalBasis: '',
    description: 'Vận hành hạ tầng mạng không dây di động, truyền dẫn dữ liệu không dây diện rộng cho thiết bị cảm biến và thiết bị kết nối vạn vật (IoT công nghiệp, LoRaWAN, mạng riêng 4G/5G chuyên dụng).',
    typicalSolutions: [
      'Nền tảng Mạng IoT công nghiệp & Cảm biến đo lường',
      'Mạng truyền thông không dây diện rộng LoRaWAN/NB-IoT',
      'Hệ thống Giám sát điều khiển từ xa qua mạng di động',
      'Mạng truyền số liệu không dây chuyên dụng'
    ],
    defaultTechId: 'TECH-IOT-12',
    supportedTechIds: ['TECH-IOT-12'],
    pillarId: 'INFRASTRUCTURE_TECH'
  },
  {
    code: '2620',
    subCode: '26200',
    name: 'Sản xuất máy vi tính và thiết bị ngoại vi của máy vi tính',
    shortName: 'Thiết bị máy chủ Server, Kiosk & POS phần cứng',
    groupCode: '26',
    groupName: 'Nhóm 26: Sản xuất sản phẩm điện tử, máy vi tính & viễn thông',
    legalBasis: '',
    description: 'Sản xuất, lắp ráp máy vi tính, hệ thống máy chủ chuyên dụng (Server), máy trạm đồ họa, thiết bị lưu trữ dữ liệu SAN/NAS, thiết bị điểm bán hàng POS phần cứng, Kiosk tự phục vụ cảm ứng.',
    typicalSolutions: [
      'Hệ thống Máy chủ Server & Thiết bị lưu trữ chuyên dụng',
      'Thiết bị phần cứng POS thanh toán & Quản lý bán hàng',
      'Kiosk tra cứu thông tin & Thanh toán tự phục vụ',
      'Thiết bị quét mã vạch và nhận diện RFID công nghiệp'
    ],
    defaultTechId: 'TECH-MES-05',
    supportedTechIds: ['TECH-MES-05', 'TECH-WMS-04'],
    pillarId: 'INFRASTRUCTURE_TECH'
  },
  {
    code: '2630',
    subCode: '26300',
    name: 'Sản xuất thiết bị truyền thông',
    shortName: 'Thiết bị mạng, Tường lửa phần cứng & Camera AI',
    groupCode: '26',
    groupName: 'Nhóm 26: Sản xuất sản phẩm điện tử, máy vi tính & viễn thông',
    legalBasis: '',
    description: 'Sản xuất thiết bị chuyển mạch (Switches), bộ định tuyến (Routers), thiết bị tường lửa bảo mật phần cứng (Hardware Firewall), hệ thống camera giám sát an ninh thông minh tích hợp trí tuệ nhân tạo AI.',
    typicalSolutions: [
      'Thiết bị Tường lửa phần cứng Next-Gen Firewall',
      'Thiết bị Router & Switch mạng quản lý tập trung',
      'Camera an ninh thông minh AI Edge nhận diện khuôn mặt',
      'Thiết bị kiểm soát truy cập thông minh & Chấm công sinh trắc'
    ],
    defaultTechId: 'TECH-SEC-06',
    supportedTechIds: ['TECH-SEC-06', 'TECH-IOT-12'],
    pillarId: 'DATA_SECURITY'
  },
  {
    code: '9511',
    subCode: '95110',
    name: 'Sửa chữa máy vi tính và thiết bị ngoại vi',
    shortName: 'Bảo trì, sửa chữa phần cứng CNTT & Máy chủ',
    groupCode: '95',
    groupName: 'Nhóm 95: Dịch vụ bảo trì, sửa chữa thiết bị máy tính',
    legalBasis: '',
    description: 'Dịch vụ sửa chữa, bảo dưỡng định kỳ, thay thế linh kiện và cứu hộ sự cố phần cứng máy tính, thiết bị ngoại vi và hệ thống máy chủ mạng doanh nghiệp cam kết thời gian đáp ứng SLA.',
    typicalSolutions: [
      'Dịch vụ Bảo dưỡng định kỳ hệ thống máy chủ & Mạng',
      'Cứu hộ phần cứng và thay thế linh kiện máy chủ khẩn cấp 24/7',
      'Dịch vụ Sửa chữa thiết bị đầu cuối và ngoại vi văn phòng'
    ],
    defaultTechId: 'TECH-CLOUD-09',
    supportedTechIds: ['TECH-CLOUD-09'],
    pillarId: 'OPERATIONS'
  }
];
