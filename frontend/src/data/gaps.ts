/**
 * 17 Logistics Knowledge Base Gaps from TRI_THUC_KHOANG_TRONG.json
 * Ground truth for diagnosing bottlenecks and mapping LDMI next steps
 */

import { GroupCode } from './questions';

export interface KnowledgeGap {
  ma: string;
  nhom_nang_luc: GroupCode;
  ten: string;
  trieu_chung: string;
  nguyen_nhan: string;
  buoc_tiep: {
    muc_1: string;
    muc_2: string;
    muc_3: string;
    muc_4: string;
  };
  dieu_kien: string;
  chi_so: string;
  rui_ro: string;
  nguon: string[];
  luu_y_bang_chung: string;
}

export const KNOWLEDGE_GAPS: KnowledgeGap[] = [
  {
    ma: 'G-VT-01',
    nhom_nang_luc: 'VT',
    ten: 'Điều phối xe thủ công',
    trieu_chung: 'Điều phối viên quá tải; xe chờ lâu; không biết xe nào rảnh để xếp nốt',
    nguyen_nhan: 'Điều phối dựa vào trí nhớ và điện thoại, không có lịch xe dùng chung',
    buoc_tiep: {
      muc_1: 'Lập lịch xe dùng chung trên bảng tính, chuẩn hóa mẫu lệnh điều xe',
      muc_2: 'Chuyển sang phần mềm quản lý vận tải (TMS) có phân hệ lệnh điều xe',
      muc_3: 'Kích hoạt tính năng gợi ý xe theo tải trọng, thể tích và vị trí GPS',
      muc_4: 'Thử nghiệm điều phối tự động theo thuật toán tối ưu trên một nhóm tuyến'
    },
    dieu_kien: 'Có người điều phối dùng được máy tính; danh sách xe và tài xế được cập nhật liên tục',
    chi_so: 'Số chuyến mỗi xe mỗi ngày; thời gian chờ điều xe',
    rui_ro: 'Dữ liệu đầu vào kém; điều phối viên kháng cự thói quen cũ; kỳ vọng tự động hóa khi dữ liệu chưa chuẩn',
    nguon: ['Facchini et al. (2020)', 'Toth & Vigo, The Vehicle Routing Problem (SIAM)'],
    luu_y_bang_chung: 'Mức tiết kiệm 5–30% của công cụ định tuyến là tuyên bố nhà cung cấp, không dùng làm cam kết cố định'
  },
  {
    ma: 'G-VT-02',
    nhom_nang_luc: 'VT',
    ten: 'Lập tuyến chưa tối ưu',
    trieu_chung: 'Chi phí nhiên liệu cao; giao trễ ở tuyến có nhiều điểm dừng; tài xế chạy vòng vèo',
    nguyen_nhan: 'Tuyến lập theo kinh nghiệm cảm tính, không tính toán ràng buộc giờ giao và tải trọng',
    buoc_tiep: {
      muc_1: 'Ghi lại tuyến thực tế và thời gian từng chuyến để có số liệu gốc chuẩn hóa',
      muc_2: 'Dùng công cụ gợi ý tuyến đường cho từng chuyến giao',
      muc_3: 'Áp dụng phần mềm tối ưu nhiều điểm giao và nhiều xe cùng lúc',
      muc_4: 'Tối ưu tuyến động theo dữ liệu giao thông thực tế thời gian thực'
    },
    dieu_kien: 'Địa chỉ giao hàng chuẩn hóa; có số liệu nhật trình tuyến ít nhất 1 tháng',
    chi_so: 'Chi phí mỗi km; số km mỗi đơn hàng; tỷ lệ giao đúng hạn OTIF',
    rui_ro: 'Địa chỉ Việt Nam chưa chuẩn hóa gây sai tuyến; bỏ qua ràng buộc cấm tải, cấm giờ của đô thị',
    nguon: ['Kuo (2010), Computers & Industrial Engineering'],
    luu_y_bang_chung: 'Nghiên cứu mô phỏng ghi nhận giảm khoảng 5% nhiên liệu; cần điều chỉnh thực tế tuyến tại Việt Nam'
  },
  {
    ma: 'G-VT-03',
    nhom_nang_luc: 'VT',
    ten: 'Dữ liệu định vị không được khai thác',
    trieu_chung: 'Có thiết bị giám sát hành trình (hộp đen) nhưng không ai xem; khách hỏi vị trí xe thì phải gọi điện',
    nguyen_nhan: 'Dữ liệu định vị nằm riêng ở ứng dụng của nhà cung cấp thiết bị, không gắn với chuyến và đơn hàng',
    buoc_tiep: {
      muc_1: 'Phân công người theo dõi dữ liệu, bật các cảnh báo vi phạm cơ bản',
      muc_2: 'Chọn nhà cung cấp định vị có API hoặc kết nối với phần mềm vận tải',
      muc_3: 'Gắn dữ liệu định vị trực tiếp với chuyến xe và đơn hàng cụ thể',
      muc_4: 'Dùng dữ liệu vận hành để chấm điểm an toàn tài xế và lập lịch bảo trì dự phòng'
    },
    dieu_kien: 'Thiết bị giám sát hành trình đang hoạt động ổn định và truyền tín hiệu',
    chi_so: 'Số cảnh báo vi phạm xử lý; tỷ lệ chuyến xe có vị trí thời gian thực',
    rui_ro: 'Dữ liệu phân mảnh giữa nhiều nhà cung cấp thiết bị; vùng mất sóng; phản ứng riêng tư của tài xế',
    nguon: ['Nghị định 10/2020/NĐ-CP', 'Thông tư 12/2020/TT-BGTVT', 'Thông tư 71/2024/TT-BCA'],
    luu_y_bang_chung: 'Thiết bị giám sát hành trình là bắt buộc pháp lý nên dữ liệu đã có sẵn, là điểm khởi động nhanh ít tốn kém'
  },
  {
    ma: 'G-KB-01',
    nhom_nang_luc: 'KB',
    ten: 'Tồn kho không chính xác',
    trieu_chung: 'Kiểm kê thực tế lệch với sổ sách; hết hàng bất ngờ; khách hàng phàn nàn giao thiếu hoặc nhầm mã',
    nguyen_nhan: 'Ghi nhận nhập xuất chậm hoặc sai sót; không quản lý theo vị trí kệ ô (bin location)',
    buoc_tiep: {
      muc_1: 'Chuẩn hóa danh mục mã hàng và vị trí kệ, quy định ghi nhận ngay khi nhập xuất',
      muc_2: 'Ứng dụng phần mềm quản lý kho WMS cơ bản và dán mã vạch định danh',
      muc_3: 'Quản lý kho chi tiết theo vị trí, số lô, hạn dùng; thực hiện kiểm kê luân phiên',
      muc_4: 'Quét mã vạch/RFID cập nhật tức thời thời gian thực, tự động đối soát tồn kho liên tục'
    },
    dieu_kien: 'Danh mục mã hàng hóa thống nhất; có thiết bị quét hoặc điện thoại thông minh',
    chi_so: 'Độ chính xác tồn kho (%); số lần hết hàng ngoài kế hoạch',
    rui_ro: 'Đầu tư công nghệ cao nhưng quy trình thao tác kho bừa bãi thì công nghệ không phát huy hiệu quả',
    nguon: ['Frazelle, World-Class Warehousing and Material Handling', 'Richards, Warehouse Management', 'Auburn University RFID Lab'],
    luu_y_bang_chung: 'Độ chính xác tồn kho nâng từ 65% lên trên 95% khi áp dụng quét mã vạch và quy trình vị trí chuẩn'
  },
  {
    ma: 'G-KB-02',
    nhom_nang_luc: 'KB',
    ten: 'Năng suất lấy hàng thấp',
    trieu_chung: 'Nhân viên đi tìm hàng trong kho lâu; giờ cao điểm dồn ứ đơn; giao hàng chậm trễ',
    nguyen_nhan: 'Bố trí vị trí hàng không theo tần suất luân chuyển (ABC analysis); nhặt từng đơn hàng lẻ',
    buoc_tiep: {
      muc_1: 'Đo lường thời gian lấy hàng hiện tại để thiết lập mốc chuẩn',
      muc_2: 'Gán vị trí cố định cho từng mặt hàng và in phiếu nhặt hàng tối ưu theo tuyến đi',
      muc_3: 'Sắp xếp lại layout kho theo tần suất xuất hàng, gom nhiều đơn lấy theo đợt (batch picking)',
      muc_4: 'Hệ thống WMS tự động lập đợt nhặt hàng và chỉ dẫn đường đi ngắn nhất'
    },
    dieu_kien: 'Có sơ đồ bố trí kho (layout) và dữ liệu đơn hàng xuất ít nhất 1 tháng',
    chi_so: 'Năng suất lấy hàng (dòng/người/giờ); thời gian xử lý hoàn tất đơn hàng',
    rui_ro: 'Bố trí vị trí sai làm tăng quãng đường di chuyển; tự động hóa quá sớm khi sản lượng chưa đủ lớn',
    nguon: ['De Koster, Le-Duc & Roodbergen (2007), European Journal of Operational Research', 'Rushton, Croucher & Baker, Handbook of Logistics'],
    luu_y_bang_chung: 'Khâu lấy hàng (picking) thường chiếm khoảng 50–70% chi phí vận hành nhân công trong kho'
  },
  {
    ma: 'G-GN-01',
    nhom_nang_luc: 'GN',
    ten: 'Báo giá chậm trễ',
    trieu_chung: 'Khách hàng phải chờ báo giá cước quá lâu; mất cơ hội chốt hợp đồng vào tay đối thủ',
    nguyen_nhan: 'Tính giá thủ công từ nhiều nguồn bảng cước của các hãng tàu, hãng bay và nhà xe',
    buoc_tiep: {
      muc_1: 'Chuẩn hóa bảng cước theo từng tuyến và từng loại hàng trên mẫu thống nhất',
      muc_2: 'Dùng phần mềm tự động tra cứu và tính giá theo bảng cước đã lưu trữ',
      muc_3: 'Báo giá tự động gửi khách, lưu vết lịch sử để phân tích tỷ lệ chốt đơn',
      muc_4: 'Kết nối cập nhật giá cước thị trường tự động từ nhiều hãng vận tải'
    },
    dieu_kien: 'Bảng cước của các đối tác vận tải được cập nhật định kỳ',
    chi_so: 'Thời gian phản hồi báo giá (giờ); tỷ lệ báo giá thành công (%)',
    rui_ro: 'Dữ liệu cước biến động nhanh nếu không cập nhật sẽ báo giá sai gây lỗ; tích hợp nhiều hãng phức tạp',
    nguon: ['DHL Logistics Trend Radar', 'Bộ Công Thương (2023), Báo cáo Logistics Việt Nam'],
    luu_y_bang_chung: 'Rút ngắn thời gian báo giá từ 24h xuống dưới 15 phút giúp tăng đáng kể tỷ lệ chốt đơn cho forwarder'
  },
  {
    ma: 'G-GN-02',
    nhom_nang_luc: 'GN',
    ten: 'Theo dõi lô hàng quốc tế thủ công',
    trieu_chung: 'Nhân viên mất hàng giờ truy cập từng web hãng tàu để tra vận đơn; khách hỏi liên tục',
    nguyen_nhan: 'Không có công cụ tra cứu và cập nhật trạng thái lô hàng tập trung đa hãng',
    buoc_tiep: {
      muc_1: 'Lập bảng theo dõi tập trung cho toàn bộ các lô hàng đang vận chuyển',
      muc_2: 'Dùng công cụ phần mềm tra cứu tập trung kết nối dữ liệu nhiều hãng tàu/bay',
      muc_3: 'Hệ thống tự động cập nhật trạng thái mốc vận chuyển và phát cảnh báo trễ',
      muc_4: 'Ứng dụng mô hình dự báo thời gian hàng đến (ETA) và gửi thông báo chủ động cho khách'
    },
    dieu_kien: 'Mã vận đơn (BL, AWB) và số container được ghi nhận đầy đủ, chuẩn xác',
    chi_so: 'Thời gian tra cứu mỗi lô; số lượng cuộc gọi thắc mắc tình trạng hàng từ khách',
    rui_ro: 'Chất lượng dữ liệu trạng thái phụ thuộc vào hãng vận chuyển gốc; chi phí API kết nối',
    nguon: ['Christopher, Logistics and Supply Chain Management'],
    luu_y_bang_chung: 'Tự động hóa theo dõi lô hàng giúp giảm đến 60% thời gian nhân viên chăm sóc khách hàng trực hotline'
  },
  {
    ma: 'G-DH-01',
    nhom_nang_luc: 'DH',
    ten: 'Tiếp nhận đơn hàng thủ công',
    trieu_chung: 'Nhân viên phải nhập lại đơn nhiều lần; nhầm lẫn địa chỉ giao, sai quy cách hoặc số lượng',
    nguyen_nhan: 'Đơn hàng đến phân tán từ nhiều kênh (Zalo, điện thoại, email, web) không tập trung',
    buoc_tiep: {
      muc_1: 'Quy chuẩn mọi đơn hàng về một mẫu biểu và lưu trữ tại một nơi tập trung',
      muc_2: 'Ứng dụng phần mềm quản lý đơn hàng (OMS) tập trung',
      muc_3: 'Cung cấp cổng thông tin để khách tự tạo đơn hoặc kết nối API trực tiếp',
      muc_4: 'Đơn hàng tự động truyền vào hệ thống, tự phân bổ vị trí kho lấy và xe giao phù hợp'
    },
    dieu_kien: 'Mẫu biểu đơn hàng và danh mục sản phẩm được chuẩn hóa thống nhất',
    chi_so: 'Tỷ lệ đơn hàng sai sót (%); thời gian từ lúc nhận đơn đến khi xuất kho',
    rui_ro: 'Khách hàng quen thói quen nhắn Zalo tự do; tích hợp đa kênh ban đầu cần thời gian hướng dẫn đối tác',
    nguon: ['Bowersox, Closs & Cooper, Supply Chain Logistics Management', 'Chopra & Meindl, Supply Chain Management'],
    luu_y_bang_chung: 'Chuẩn hóa tiếp nhận đơn giúp loại bỏ việc gõ lại dữ liệu và giảm thiểu sai sót giao hàng'
  },
  {
    ma: 'G-DH-02',
    nhom_nang_luc: 'DH',
    ten: 'Không có bằng chứng giao hàng điện tử',
    trieu_chung: 'Tranh chấp giao hàng thường xuyên; chậm đối soát thanh toán cước vì chờ biên bản giấy',
    nguyen_nhan: 'Xác nhận giao nhận chỉ dùng giấy tờ hoặc ảnh chụp tự do gửi qua Zalo phân tán',
    buoc_tiep: {
      muc_1: 'Quy định quy trình tài xế chụp ảnh hàng và biên bản gửi về theo mẫu quy chuẩn',
      muc_2: 'Trang bị ứng dụng mobile cho tài xế có tính năng chụp ảnh hàng và ký nhận điện tử',
      muc_3: 'Tích hợp xác nhận giao hàng điện tử (ePOD) trực tiếp với phần mềm quản lý vận tải TMS',
      muc_4: 'Tự động gửi ePOD ngay tức thời cho khách hàng và kích hoạt quy trình đối soát công nợ'
    },
    dieu_kien: 'Đội ngũ tài xế hoặc đối tác vận chuyển có điện thoại thông minh',
    chi_so: 'Thời gian hoàn tất đối soát cước (ngày); số vụ tranh chấp giao hàng phát sinh',
    rui_ro: 'Tài xế ngại dùng ứng dụng; các khu vực giao hàng vùng sâu vùng xa bị mất sóng điện thoại',
    nguon: ['Rushton, Croucher & Baker, The Handbook of Logistics and Distribution Management'],
    luu_y_bang_chung: 'ePOD giúp rút ngắn chu kỳ đối soát công nợ từ hàng tuần xuống trong ngày'
  },
  {
    ma: 'G-DH-03',
    nhom_nang_luc: 'DH',
    ten: 'Không đo lường được giao hàng đúng hạn đủ hàng (OTIF)',
    trieu_chung: 'Không trả lời được khách hàng khi được hỏi về cam kết chất lượng dịch vụ (SLA)',
    nguyen_nhan: 'Không ghi nhận thời gian cam kết giao hàng và mốc thời gian giao hàng thực tế',
    buoc_tiep: {
      muc_1: 'Bắt đầu ghi nhận giờ cam kết và giờ giao thực tế cho từng đơn hàng cụ thể',
      muc_2: 'Tổng hợp và tính toán chỉ số OTIF định kỳ hằng tháng trên Excel',
      muc_3: 'Hệ thống phần mềm tự động đo lường OTIF theo từng khách hàng, từng tuyến',
      muc_4: 'Phát cảnh báo sớm theo thời gian thực khi đơn hàng có nguy cơ bị trễ hẹn'
    },
    dieu_kien: 'Có quy trình và công cụ ghi nhận chính xác mốc giờ giao hàng thực tế',
    chi_so: 'Tỷ lệ giao hàng đúng hạn đủ hàng (OTIF %)',
    rui_ro: 'Khái niệm OTIF chưa được thống nhất rõ ràng giữa các bên gây tranh cãi khi đánh giá',
    nguon: ['ASCM, SCOR Digital Standard (RL.2.1, RL.2.2)', 'Chopra & Meindl, Supply Chain Management'],
    luu_y_bang_chung: 'OTIF là chỉ số sinh mệnh để giữ chân khách hàng B2B lớn trong chuỗi cung ứng'
  },
  {
    ma: 'G-HT-01',
    nhom_nang_luc: 'HT',
    ten: 'Khách hàng không tự theo dõi được hành trình',
    trieu_chung: 'Bộ phận chăm sóc khách hàng và điều hành tốn nhiều thời gian trả lời điện thoại hỏi hàng ở đâu',
    nguyen_nhan: 'Dữ liệu hành trình vận chuyển chỉ lưu nội bộ, không có kênh chia sẻ ra bên ngoài cho khách',
    buoc_tiep: {
      muc_1: 'Chuẩn hóa các mốc trạng thái vận chuyển và cập nhật thường xuyên',
      muc_2: 'Cung cấp cổng thông tin web đơn giản để khách hàng tự tra cứu vận đơn',
      muc_3: 'Tạo đường link (tracking URL) cho phép theo dõi vị trí xe/hàng theo thời gian thực',
      muc_4: 'Gửi tin nhắn cảnh báo chủ động và dự báo chính xác thời gian xe đến cho người nhận'
    },
    dieu_kien: 'Dữ liệu trạng thái chuyến xe đã được số hóa trên phần mềm quản lý',
    chi_so: 'Số lượng cuộc gọi hotline hỏi vị trí hàng; điểm số hài lòng của khách hàng (CSAT)',
    rui_ro: 'Dữ liệu trạng thái cập nhật trễ hoặc sai lệch gây mất niềm tin của đối tác',
    nguon: ['Christopher, Logistics and Supply Chain Management', 'DHL Logistics Trend Radar'],
    luu_y_bang_chung: 'Tự động hóa tra cứu giúp giải phóng 40-50% thời gian xử lý thủ công của đội ngũ hỗ trợ'
  },
  {
    ma: 'G-HT-02',
    nhom_nang_luc: 'HT',
    ten: 'Hệ thống phần mềm nội bộ rời rạc',
    trieu_chung: 'Nhân viên phải nhập lại dữ liệu giữa các phần mềm; số liệu báo cáo giữa các phòng ban không khớp',
    nguyen_nhan: 'Mỗi bộ phận tự mua hoặc phát triển phần mềm riêng rẽ, không tính đến khả năng kết nối tích hợp',
    buoc_tiep: {
      muc_1: 'Lập danh mục toàn bộ phần mềm hiện có và định vị luồng dữ liệu của từng bên',
      muc_2: 'Chuẩn hóa quy trình xuất nhập file dữ liệu định kỳ theo giờ/ngày cố định',
      muc_3: 'Kết nối tích hợp trực tiếp qua API giữa phần mềm vận tải, kho bãi, đơn hàng và kế toán',
      muc_4: 'Xây dựng nền tảng dữ liệu tập trung duy nhất cập nhật đồng bộ tức thời'
    },
    dieu_kien: 'Có nhân sự am hiểu toàn diện quy trình liên phòng ban và công nghệ phần mềm',
    chi_so: 'Số giờ lao động phải nhập lại dữ liệu thủ công; tỷ lệ chênh lệch số liệu giữa các bộ phận',
    rui_ro: 'Dữ liệu đầu vào chưa sạch (bẩn) sẽ làm dự án tích hợp thất bại; phần mềm kế toán cũ thiếu API mở',
    nguon: ['Chopra & Meindl, Supply Chain Management'],
    luu_y_bang_chung: 'Tích hợp dữ liệu là bước ngoặt chuyển đổi từ cấp độ Số hóa (Mức 2) sang cấp độ Tích hợp (Mức 3)'
  },
  {
    ma: 'G-CT-01',
    nhom_nang_luc: 'CT',
    ten: 'Chứng từ lập thủ công, hay phát sinh sai sót',
    trieu_chung: 'Phải sửa chữa bộ chứng từ hải quan nhiều lần; ách tắc hàng hóa tại cảng/cửa khẩu do thiếu giấy tờ',
    nguyen_nhan: 'Nhập lại cùng một dữ liệu hàng hóa trên nhiều mẫu biểu chứng từ khác nhau',
    buoc_tiep: {
      muc_1: 'Sử dụng bộ biểu mẫu chuẩn hóa cho từng loại chứng từ vận chuyển và hải quan',
      muc_2: 'Lập chứng từ tự động từ dữ liệu lô hàng đã nhập trên phần mềm',
      muc_3: 'Hệ thống tự động phát sinh bộ chứng từ điện tử đầy đủ và ký số số hóa',
      muc_4: 'Trao đổi dữ liệu chứng từ số hóa trực tiếp với đối tác và cơ quan quản lý'
    },
    dieu_kien: 'Dữ liệu chi tiết về lô hàng được nhập liệu đầy đủ, chính xác ngay từ khâu tiếp nhận ban đầu',
    chi_so: 'Tỷ lệ chứng từ phát sinh sai sót phải chỉnh sửa (%); thời gian lập xong một bộ chứng từ',
    rui_ro: 'Mã nghiệp vụ khai báo hải quan (VNACCS) phức tạp; dữ liệu nguồn bị sai sẽ lan truyền toàn bộ chuỗi chứng từ',
    nguon: ['Hệ thống VNACCS/VCIS Tổng cục Hải quan', 'Nghị định 123/2020/NĐ-CP', 'Thông tư 78/2021/TT-BTC'],
    luu_y_bang_chung: 'Hóa đơn điện tử bắt buộc và khai báo điện tử chuẩn hóa giúp ngăn ngừa hoàn toàn nguy cơ phạt vi phạm hành chính'
  },
  {
    ma: 'G-CP-01',
    nhom_nang_luc: 'CP',
    ten: 'Không nắm được chi phí và lợi nhuận chi tiết theo tuyến, theo khách',
    trieu_chung: 'Có những tuyến hoặc khách hàng đang chạy bị lỗ mà không biết; báo giá cước dựa theo cảm tính',
    nguyen_nhan: 'Chi phí vận hành chỉ được tập hợp một cục tổng thể vào cuối tháng, không phân bổ chi tiết',
    buoc_tiep: {
      muc_1: 'Ghi nhận và bóc tách các chi phí trực tiếp (nhiên liệu, cầu đường, lương) theo từng chuyến xe',
      muc_2: 'Tính toán chi phí và lợi nhuận gộp theo từng tuyến đường định kỳ hằng tháng',
      muc_3: 'Hệ thống tự động phân bổ chi phí hoạt động theo từng chuyến, từng tuyến và từng khách hàng',
      muc_4: 'Phân tích biên lợi nhuận sâu, tự động cảnh báo các hợp đồng hoặc tuyến vận tải đang thua lỗ'
    },
    dieu_kien: 'Có quy trình ghi nhận đầy đủ chi phí nhiên liệu, phí cầu đường (ETC) cho từng chuyến đi',
    chi_so: 'Chi phí trung bình mỗi km; tỷ suất lợi nhuận gộp theo từng tuyến vận tải',
    rui_ro: 'Việc phân bổ chi phí gián tiếp làm thủ công rất tốn công sức và dễ bỏ cuộc nếu thiếu phần mềm tự động',
    nguon: ['Kaplan & Narayanan, Customer Profitability', 'Christopher, Logistics and Supply Chain Management', 'Ballou, Business Logistics Management'],
    luu_y_bang_chung: 'Hiểu rõ Cost-to-Serve giúp doanh nghiệp loại bỏ các tuyến lỗ ngầm và tập trung nguồn lực vào khách hàng sinh lời cao'
  },
  {
    ma: 'G-CP-02',
    nhom_nang_luc: 'CP',
    ten: 'Thiếu bảng điều khiển (Dashboard) chỉ số vận hành',
    trieu_chung: 'Ban lãnh đạo không nắm bắt được tình hình vận hành theo ngày; chỉ phát hiện sự cố khi đã muộn',
    nguyen_nhan: 'Số liệu vận hành nằm rải rác trên nhiều file và sổ sách, không có ai tổng hợp trực quan',
    buoc_tiep: {
      muc_1: 'Lựa chọn từ 3 đến 5 chỉ số KPI cốt lõi nhất và theo dõi đều đặn hằng tuần',
      muc_2: 'Xây dựng bảng điều khiển trực quan cập nhật số liệu định kỳ (Power BI hoặc Google Looker)',
      muc_3: 'Kết nối dữ liệu thời gian thực lên Dashboard vận hành tập trung',
      muc_4: 'Tích hợp các thuật toán dự báo xu hướng và cảnh báo bất thường chủ động'
    },
    dieu_kien: 'Dữ liệu các chỉ số vận hành được các bộ phận nhập liệu ghi nhận đầy đủ và có kỷ luật',
    chi_so: 'Số lượng chỉ số KPI cốt lõi được theo dõi tự động hằng ngày',
    rui_ro: 'Bảng điều khiển thiết kế đẹp mắt nhưng dữ liệu đầu vào bị sai; hiển thị quá nhiều chỉ số rác không dẫn đến hành động',
    nguon: ['Christopher, Logistics and Supply Chain Management', 'ASCM, SCOR Digital Standard'],
    luu_y_bang_chung: 'Bảng điều khiển tập trung giúp ban điều hành ra quyết định dựa trên dữ liệu thay vì suy đoán'
  },
  {
    ma: 'G-XA-01',
    nhom_nang_luc: 'XA',
    ten: 'Tỷ lệ xe chạy rỗng cao, chưa đo lường được',
    trieu_chung: 'Xe chạy chiều về thường xuyên rỗng hàng; chi phí nhiên liệu đội lên cao, giảm hiệu quả tài sản',
    nguyen_nhan: 'Không có dữ liệu đo lường số km chạy rỗng và thiếu mạng lưới kết nối tìm nguồn hàng chiều về',
    buoc_tiep: {
      muc_1: 'Bắt đầu ghi chép số km có hàng và số km chạy rỗng cho từng chuyến xe',
      muc_2: 'Đo lường tỷ lệ km chạy rỗng định kỳ hằng tháng, chủ động liên hệ đối tác tìm nguồn hàng chiều về',
      muc_3: 'Ghép chuyến chiều về thông qua hợp tác mạng lưới hoặc tham gia sàn giao dịch vận tải',
      muc_4: 'Hệ thống tự động ghép chuyến hai chiều bằng thuật toán tối ưu hóa tải trọng'
    },
    dieu_kien: 'Có ghi nhận số km odometer của từng chuyến xe trên lệnh điều xe hoặc GPS',
    chi_so: 'Tỷ lệ km xe chạy rỗng (%); tỷ lệ chuyến xe chiều về có hàng (%)',
    rui_ro: 'Một phần km chạy rỗng là do mất cân đối luồng hàng tự nhiên giữa các vùng kinh tế; đội xe nhỏ khó tự tìm hàng lẻ',
    nguon: ['Eurostat, Road Freight Statistics', 'World Bank, The Economics of Empty Trips'],
    luu_y_bang_chung: 'Tại Việt Nam tỷ lệ chạy rỗng trung bình ngành lên tới 50-70%; giảm 10% rỗng đem lại lợi nhuận trực tiếp'
  },
  {
    ma: 'G-XA-02',
    nhom_nang_luc: 'XA',
    ten: 'Chưa đo lường và báo cáo phát thải khí nhà kính',
    trieu_chung: 'Khách hàng FDI hoặc đối tác quốc tế yêu cầu số liệu kiểm kê phát thải carbon mà không đáp ứng được',
    nguyen_nhan: 'Chưa có phương pháp luận và công cụ đo lường mức phát thải trong chuỗi vận chuyển',
    buoc_tiep: {
      muc_1: 'Ghi nhận lượng nhiên liệu tiêu thụ chi tiết theo từng chuyến vận chuyển',
      muc_2: 'Tính toán sơ bộ lượng phát thải khí nhà kính từ lượng nhiên liệu theo hệ số quy đổi chuẩn',
      muc_3: 'Áp dụng phương pháp luận quốc tế chuẩn hóa (GLEC Framework v3 hoặc tiêu chuẩn ISO 14083)',
      muc_4: 'Xuất báo cáo phát thải carbon chi tiết theo từng chuyến hoặc từng lô hàng gửi cho đối tác'
    },
    dieu_kien: 'Có số liệu tiêu hao nhiên liệu chính xác theo từng đầu xe và tuyến vận chuyển',
    chi_so: 'Lượng phát thải CO₂e mỗi tấn-km (gCO₂e/tkm); tổng phát thải CO₂e theo từng lô hàng',
    rui_ro: 'Thiếu dữ liệu nhiên liệu chi tiết; dùng hệ số ước lượng chung chung dẫn đến rủi ro bị cáo buộc tô vẽ xanh (greenwashing)',
    nguon: ['Smart Freight Centre (2023), GLEC Framework v3', 'ISO 14083:2023'],
    luu_y_bang_chung: 'Tiêu chuẩn phát thải quốc tế đang trở thành điều kiện tiên quyết để trúng thầu các tập đoàn đa quốc gia'
  }
];
