/**
 * Mathematical and Business Logic Engine for POLYMATCH Logistics
 * Implements R01 to R27 from LOGIC NGHIỆP VỤ and BANG_CAU_HOI_CAI_TIEN.xlsx
 */

import { BranchCode, GroupCode, QUESTIONS_DBI, QUESTIONS_LDMI, QUESTIONS_METRICS } from '../data/questions';
import { HE_SO_NHOM_NHANH, LDMI_CONFIG, DBI_CONFIG, MATCHING_WEIGHTS } from '../data/weights';
import { KNOWLEDGE_GAPS, KnowledgeGap } from '../data/gaps';
import { Solution, SOLUTIONS_CATALOG } from '../data/solutions';

export type EnterpriseScale = 'sieu_nho' | 'nho' | 'vua' | 'lon';

// R01: Phân loại quy mô theo Nghị định 80/2021/NĐ-CP (lĩnh vực thương mại, dịch vụ)
export function tinhQuyMoDoanhNghiep(
  laoDong: 'duoi_10' | '10_50' | '50_100' | 'tren_100',
  doanhThu: 'duoi_10' | '10_100' | '100_300' | 'tren_300',
  nguonVon: 'duoi_3' | '3_50' | '50_100' | 'tren_100'
): EnterpriseScale {
  // Siêu nhỏ: lao động ≤ 10 VÀ (doanh thu ≤ 10 tỷ HOẶC nguồn vốn ≤ 3 tỷ)
  if (laoDong === 'duoi_10' && (doanhThu === 'duoi_10' || nguonVon === 'duoi_3')) {
    return 'sieu_nho';
  }

  // Nhỏ: lao động ≤ 50 VÀ (doanh thu ≤ 100 tỷ HOẶC nguồn vốn ≤ 50 tỷ)
  const isLaoDongSmall = laoDong === 'duoi_10' || laoDong === '10_50';
  const isDoanhThuSmall = doanhThu === 'duoi_10' || doanhThu === '10_100';
  const isNguonVonSmall = nguonVon === 'duoi_3' || nguonVon === '3_50';
  if (isLaoDongSmall && (isDoanhThuSmall || isNguonVonSmall)) {
    return 'nho';
  }

  // Vừa: lao động ≤ 100 VÀ (doanh thu ≤ 300 tỷ HOẶC nguồn vốn ≤ 100 tỷ)
  const isLaoDongMedium = laoDong === 'duoi_10' || laoDong === '10_50' || laoDong === '50_100';
  const isDoanhThuMedium = doanhThu === 'duoi_10' || doanhThu === '10_100' || doanhThu === '100_300';
  const isNguonVonMedium = nguonVon === 'duoi_3' || nguonVon === '3_50' || nguonVon === '50_100';
  if (isLaoDongMedium && (isDoanhThuMedium || isNguonVonMedium)) {
    return 'vua';
  }

  // Còn lại là Lớn: lao động > 100 HOẶC (doanh thu > 300 tỷ VÀ nguồn vốn > 100 tỷ)
  return 'lon';
}

export function getTenQuyMo(quyMo: EnterpriseScale): string {
  switch (quyMo) {
    case 'sieu_nho': return 'Doanh nghiệp Siêu nhỏ';
    case 'nho': return 'Doanh nghiệp Nhỏ';
    case 'vua': return 'Doanh nghiệp Vừa';
    case 'lon': return 'Doanh nghiệp Lớn';
  }
}

// R03: Điểm câu hỏi (muc - 1) / 4 * 100 (thang 0 đến 100)
export function tinhDiemCau(muc: number): number {
  if (muc < 1) return 0;
  if (muc > 5) return 100;
  return ((muc - 1) / 4) * 100;
}

// R04: Chấm mức DBI bằng TOPSIS trên 12 câu phần chung
export interface DbiResult {
  diem: number; // 0 - 100
  ci: number; // 0 - 1
  muc_ma: 'khoi_dong' | 'bat_dau' | 'hinh_thanh' | 'nang_cao' | 'dan_dat';
  muc_ten: string;
  diem_tru_cot: Record<string, number>;
}

export function tinhDbiScore(traLoiDbi: Record<string, number>): DbiResult {
  const cauHoiDbi = QUESTIONS_DBI;
  const n = cauHoiDbi.length; // 12
  const weight = 1 / n;

  // Tính khoảng cách tới giải pháp lý tưởng dương A+ (tất cả 100) và âm A- (tất cả 0)
  let sumSqPos = 0;
  let sumSqNeg = 0;

  const diemTruCot: Record<string, { sum: number; count: number }> = {
    khach_hang: { sum: 0, count: 0 },
    chien_luoc: { sum: 0, count: 0 },
    cong_nghe: { sum: 0, count: 0 },
    van_hanh: { sum: 0, count: 0 },
    van_hoa: { sum: 0, count: 0 },
    du_lieu: { sum: 0, count: 0 },
  };

  cauHoiDbi.forEach((q) => {
    const muc = traLoiDbi[q.ma] || 1;
    const score = tinhDiemCau(muc);

    // TOPSIS euclidean distances
    sumSqPos += weight * Math.pow(score - 100, 2);
    sumSqNeg += weight * Math.pow(score - 0, 2);

    if (q.tru_cot_dbi && diemTruCot[q.tru_cot_dbi]) {
      diemTruCot[q.tru_cot_dbi].sum += score;
      diemTruCot[q.tru_cot_dbi].count += 1;
    }
  });

  const dPos = Math.sqrt(sumSqPos);
  const dNeg = Math.sqrt(sumSqNeg);
  const ci = (dPos + dNeg) === 0 ? 0 : dNeg / (dPos + dNeg);
  const diem = Math.round(ci * 1000) / 10; // Round to 1 decimal place

  // Quy đổi sang 5 mức DBI theo ngưỡng cấu hình
  let muc_ma: DbiResult['muc_ma'] = 'khoi_dong';
  let muc_ten = 'Khởi động';

  for (const item of DBI_CONFIG.nguong) {
    if (diem >= item.min && (diem < item.max || (diem >= 95 && item.muc === 'dan_dat'))) {
      muc_ma = item.muc as DbiResult['muc_ma'];
      muc_ten = item.ten;
      break;
    }
  }

  const diemTruCotFinal: Record<string, number> = {};
  for (const [key, val] of Object.entries(diemTruCot)) {
    diemTruCotFinal[key] = val.count > 0 ? Math.round((val.sum / val.count) * 10) / 10 : 0;
  }

  return {
    diem,
    ci,
    muc_ma,
    muc_ten,
    diem_tru_cot: diemTruCotFinal,
  };
}

// R05 & R06: Tính điểm nhóm năng lực & mức LDMI có điều kiện chặn
export interface LdmiResult {
  diem: number; // 0 - 100
  muc: number; // 1 - 5
  muc_ten: string;
  diem_nhom: Record<GroupCode, number | null>;
  dieu_kien_chan_ghi_chu?: string;
}

export function tinhLdmiScore(
  nhanh: BranchCode,
  traLoiLdmi: Record<string, number>,
  dichVu3pl: string[] = []
): LdmiResult {
  const heSoNhanh = HE_SO_NHOM_NHANH[nhanh] || HE_SO_NHOM_NHANH['VT'];
  const allGroups: GroupCode[] = ['VT', 'KB', 'GN', 'DH', 'HT', 'CT', 'CP', 'XA'];

  // Nếu là 3PL, kiểm tra các dịch vụ được chọn tại C05 để xác định các nhóm áp dụng (R02)
  const activeWeights: Record<GroupCode, number> = { ...heSoNhanh };
  if (nhanh === '3PL' && dichVu3pl.length > 0) {
    if (!dichVu3pl.includes('VT')) activeWeights['VT'] = 0;
    if (!dichVu3pl.includes('KB')) activeWeights['KB'] = 0;
    if (!dichVu3pl.includes('GN')) activeWeights['GN'] = 0;
  }

  // R05: Tính điểm từng nhóm năng lực
  const diemNhom: Record<GroupCode, number | null> = {
    VT: null, KB: null, GN: null, DH: null, HT: null, CT: null, CP: null, XA: null
  };

  const groupScoresRaw: Record<GroupCode, { sum: number; count: number }> = {
    VT: { sum: 0, count: 0 }, KB: { sum: 0, count: 0 }, GN: { sum: 0, count: 0 },
    DH: { sum: 0, count: 0 }, HT: { sum: 0, count: 0 }, CT: { sum: 0, count: 0 },
    CP: { sum: 0, count: 0 }, XA: { sum: 0, count: 0 },
  };

  QUESTIONS_LDMI.forEach((q) => {
    if (!q.nhom_nang_luc) return;
    // Kiểm tra câu hỏi có áp dụng cho nhánh này không
    if (!q.nhanh_ap_dung.includes(nhanh)) return;
    if (activeWeights[q.nhom_nang_luc] === 0) return;

    const muc = traLoiLdmi[q.ma] || 1;
    const score = tinhDiemCau(muc);

    groupScoresRaw[q.nhom_nang_luc].sum += score;
    groupScoresRaw[q.nhom_nang_luc].count += 1;
  });

  allGroups.forEach((g) => {
    if (groupScoresRaw[g].count > 0 && activeWeights[g] > 0) {
      diemNhom[g] = Math.round((groupScoresRaw[g].sum / groupScoresRaw[g].count) * 10) / 10;
    }
  });

  // R06: Tính điểm LDMI = Σ(diem_nhom × he_so) / Σ he_so
  let sumWeightedScores = 0;
  let sumWeights = 0;

  allGroups.forEach((g) => {
    const score = diemNhom[g];
    const weight = activeWeights[g];
    if (score !== null && weight > 0) {
      sumWeightedScores += score * weight;
      sumWeights += weight;
    }
  });

  const diemLdmi = sumWeights > 0 ? Math.round((sumWeightedScores / sumWeights) * 10) / 10 : 0;

  // Xác định mức ứng viên ban đầu
  let candidateMuc = 1;
  if (diemLdmi < 30) candidateMuc = 1;
  else if (diemLdmi < 50) candidateMuc = 2;
  else if (diemLdmi < 65) candidateMuc = 3;
  else if (diemLdmi < 80) candidateMuc = 4;
  else candidateMuc = 5;

  // Áp dụng điều kiện chặn (Gatekeeper conditions) R06
  let finalMuc = candidateMuc;
  let chanNote: string | undefined = undefined;

  const scoreHT = diemNhom['HT'] ?? 0;
  const scoreCP = diemNhom['CP'] ?? 0;

  // Kiểm tra từ mức cao xuống thấp
  if (finalMuc === 5) {
    if (scoreCP < LDMI_CONFIG.dieu_kien_chan.muc_5.diem_toi_thieu) {
      finalMuc = 4;
      chanNote = 'Điểm nhóm Chi phí & hiệu suất (CP) < 75 nên hạ từ Mức 5 (Thông minh) xuống Mức 4 (Hiển thị).';
    }
  }
  if (finalMuc === 4) {
    if (scoreHT < LDMI_CONFIG.dieu_kien_chan.muc_4.diem_toi_thieu) {
      finalMuc = 3;
      chanNote = (chanNote ? chanNote + ' ' : '') + 'Điểm nhóm Hiển thị & tích hợp (HT) < 65 nên hạ từ Mức 4 xuống Mức 3 (Tích hợp).';
    }
  }
  if (finalMuc === 3) {
    if (scoreHT < LDMI_CONFIG.dieu_kien_chan.muc_3.diem_toi_thieu) {
      finalMuc = 2;
      chanNote = (chanNote ? chanNote + ' ' : '') + 'Điểm nhóm Hiển thị & tích hợp (HT) < 50 nên hạ từ Mức 3 xuống Mức 2 (Số hóa).';
    }
  }

  const mucTenMap: Record<number, string> = {
    1: 'Thủ công',
    2: 'Số hóa',
    3: 'Tích hợp',
    4: 'Hiển thị',
    5: 'Thông minh',
  };

  return {
    diem: diemLdmi,
    muc: finalMuc,
    muc_ten: mucTenMap[finalMuc] || 'Thủ công',
    diem_nhom: diemNhom,
    dieu_kien_chan_ghi_chu: chanNote,
  };
}

// R07: Xác định 3 khoảng trống lớn nhất & bước tiếp theo (R19 không nhảy cóc)
export interface IdentifiedGap {
  thu_hang: number;
  nhom: GroupCode;
  ten_nhom: string;
  do_lon: number;
  ma_khoang_trong: string;
  ten_khoang_trong: string;
  cau_thap_nhat_ma: string;
  cau_thap_nhat_noi_dung: string;
  cau_thap_nhat_muc: number;
  buoc_tiep_theo: string;
  tri_thuc: KnowledgeGap;
}

export function xacDinhKhoangTrong(
  nhanh: BranchCode,
  diemNhom: Record<GroupCode, number | null>,
  traLoiLdmi: Record<string, number>,
  traLoiChiSo: Record<string, { trang_thai: 'co_do' | 'uoc_luong' | 'khong_do'; gia_tri?: number }>,
  ldmiMucHienTai: number,
  uuTienP01: string[] = []
): IdentifiedGap[] {
  const heSoNhanh = HE_SO_NHOM_NHANH[nhanh] || HE_SO_NHOM_NHANH['VT'];
  const allGroups: GroupCode[] = ['VT', 'KB', 'GN', 'DH', 'HT', 'CT', 'CP', 'XA'];

  // Kiểm tra xem nhóm có chỉ số nào bị "Không đo" không
  const nhomCoChiSoKhongDo: Record<GroupCode, boolean> = {
    VT: false, KB: false, GN: false, DH: false, HT: false, CT: false, CP: false, XA: false
  };

  QUESTIONS_METRICS.forEach((m) => {
    if (m.nhanh.includes(nhanh)) {
      const ans = traLoiChiSo[m.ma];
      if (ans && ans.trang_thai === 'khong_do') {
        nhomCoChiSoKhongDo[m.nhom] = true;
      }
    }
  });

  // Tính độ lớn khoảng trống cho từng nhóm
  const gapSizing: { nhom: GroupCode; do_lon: number; he_so: number }[] = [];

  allGroups.forEach((g) => {
    const score = diemNhom[g];
    const weight = heSoNhanh[g];
    if (score !== null && weight > 0) {
      const heSoDoLuong = nhomCoChiSoKhongDo[g] ? 1.1 : 1.0;
      const doLon = Math.round((100 - score) * weight * heSoDoLuong * 10) / 10;
      gapSizing.push({ nhom: g, do_lon: doLon, he_so: weight });
    }
  });

  // Sắp xếp giảm dần theo độ lớn khoảng trống; nếu bằng điểm thì ưu tiên nhóm trùng với P01
  gapSizing.sort((a, b) => {
    if (Math.abs(b.do_lon - a.do_lon) > 0.01) {
      return b.do_lon - a.do_lon;
    }
    // Tie-breaker: ưu tiên P01
    const aMatchP01 = uuTienP01.some((p) => p.includes(a.nhom.toLowerCase()));
    const bMatchP01 = uuTienP01.some((p) => p.includes(b.nhom.toLowerCase()));
    if (aMatchP01 && !bMatchP01) return -1;
    if (!aMatchP01 && bMatchP01) return 1;
    return 0;
  });

  // Chọn 3 nhóm có khoảng trống lớn nhất
  const top3Groups = gapSizing.slice(0, 3);
  const result: IdentifiedGap[] = [];

  top3Groups.forEach((item, index) => {
    // Trong mỗi nhóm, tìm câu hỏi có điểm số thấp nhất để ánh xạ mã khoảng trống
    const questionsInGroup = QUESTIONS_LDMI.filter(
      (q) => q.nhom_nang_luc === item.nhom && q.nhanh_ap_dung.includes(nhanh)
    );

    let lowestQ = questionsInGroup[0];
    let minMuc = 999;

    questionsInGroup.forEach((q) => {
      const muc = traLoiLdmi[q.ma] || 1;
      if (muc < minMuc) {
        minMuc = muc;
        lowestQ = q;
      }
    });

    const gapCode = lowestQ?.ma_khoang_trong || `G-${item.nhom}-01`;
    const triThuc = KNOWLEDGE_GAPS.find((kg) => kg.ma === gapCode) || KNOWLEDGE_GAPS[0];

    // Bước tiếp theo đúng với mức LDMI hiện tại (R19 không nhảy cóc)
    let buocTiep = triThuc.buoc_tiep.muc_1;
    if (ldmiMucHienTai === 2) buocTiep = triThuc.buoc_tiep.muc_2;
    else if (ldmiMucHienTai === 3) buocTiep = triThuc.buoc_tiep.muc_3;
    else if (ldmiMucHienTai >= 4) buocTiep = triThuc.buoc_tiep.muc_4;

    result.push({
      thu_hang: index + 1,
      nhom: item.nhom,
      ten_nhom: triThuc.nhom_nang_luc,
      do_lon: item.do_lon,
      ma_khoang_trong: triThuc.ma,
      ten_khoang_trong: triThuc.ten,
      cau_thap_nhat_ma: lowestQ?.ma || '',
      cau_thap_nhat_noi_dung: lowestQ?.noi_dung || '',
      cau_thap_nhat_muc: minMuc === 999 ? 1 : minMuc,
      buoc_tiep_theo: buocTiep,
      tri_thuc: triThuc,
    });
  });

  return result;
}

// R08 & R09: Thuật toán ghép nối giải pháp 7 thành phần
export interface MatchDetails {
  khoang_trong_score: number;
  uu_tien_score: number;
  quy_mo_score: number;
  ngan_sach_score: number;
  san_sang_score: number;
  he_thong_score: number;
  kiem_chung_score: number;
}

export interface RecommendedSolution {
  solution: Solution;
  diem_phu_hop: number; // 0 - 100%
  chi_tiet_diem: MatchDetails;
  ly_do: string[]; // Thành phần >= 0.8
  han_che: string[]; // Thành phần < 0.5
  thu_hang: number;
  khoang_trong_khop: string[];
}

export function ghepNoiGiaiPhap(
  nhanh: BranchCode,
  quyMo: EnterpriseScale,
  ldmiMuc: number,
  topGaps: IdentifiedGap[],
  uuTienP01: string[],
  nganSachP02: string,
  sanSang: { nhanSu?: string; duLieu?: string; lanhDao?: string },
  phanMemP07: string[]
): {
  de_xuat_xac_thuc: RecommendedSolution[];
  nhom_tham_khao: RecommendedSolution[];
} {
  const gapCodes = topGaps.map((g) => g.ma_khoang_trong);
  const gap1 = gapCodes[0];
  const gap2 = gapCodes[1];
  const gap3 = gapCodes[2];

  // Trần ngân sách tối đa theo P02 (triệu VNĐ/năm)
  let budgetCap = 9999;
  if (nganSachP02 === 'duoi_20') budgetCap = 20;
  else if (nganSachP02 === '20_100') budgetCap = 100;
  else if (nganSachP02 === '100_300') budgetCap = 300;

  const validSolutions = SOLUTIONS_CATALOG.filter((sol) => {
    // R09 Bộ lọc cứng:
    // 1. Phải đúng phân khúc / nhánh
    const matchBranch = sol.phan_khuc.includes(nhanh);
    if (!matchBranch) return false;

    // 2. Mức LDMI giải pháp ≤ mức hiện tại + 1 (không nhảy cóc R19)
    if (sol.muc_ldmi_phu_hop > ldmiMuc + 1) return false;

    // 3. Nếu giá đã xác thực và vượt ngân sách quá nhiều thì loại khỏi danh sách chính
    if (sol.trang_thai_gia === 'cong_khai' && sol.gia_min && sol.gia_min > budgetCap) {
      return false;
    }

    return true;
  });

  const scoredSolutions: RecommendedSolution[] = validSolutions.map((sol) => {
    // 1. Khớp khoảng trống (Trọng số 0.30)
    let sKhoangTrong = 0.2; // default if not in top 3
    if (sol.khoang_trong_giai_quyet.includes(gap1)) {
      sKhoangTrong = 1.0;
    } else if (gap2 && sol.khoang_trong_giai_quyet.includes(gap2)) {
      sKhoangTrong = 0.7;
    } else if (gap3 && sol.khoang_trong_giai_quyet.includes(gap3)) {
      sKhoangTrong = 0.5;
    }

    // 2. Khớp ưu tiên (Trọng số 0.15)
    let sUuTien = 0.0;
    const solGaps = sol.khoang_trong_giai_quyet;
    // Map P01 selected priorities to gap prefixes
    const matchesPriority = uuTienP01.some((p) => {
      if (p === 'giam_chi_phi' && solGaps.some((g) => g.includes('CP'))) return true;
      if (p === 'giam_chay_rong' && solGaps.some((g) => g.includes('XA'))) return true;
      if (p === 'tang_theo_doi' && solGaps.some((g) => g.includes('HT') || g.includes('VT'))) return true;
      if (p === 'chinh_xac_kho' && solGaps.some((g) => g.includes('KB'))) return true;
      if (p === 'rut_ngan_don' && solGaps.some((g) => g.includes('DH'))) return true;
      if (p === 'tang_otif' && solGaps.some((g) => g.includes('DH') || g.includes('VT'))) return true;
      if (p === 'giam_sai_chung_tu' && solGaps.some((g) => g.includes('CT'))) return true;
      if (p === 'giam_phat_thai' && solGaps.some((g) => g.includes('XA'))) return true;
      return false;
    });
    if (matchesPriority) sUuTien = 1.0;

    // 3. Khớp loại hình và quy mô (Trọng số 0.15)
    const matchScale = sol.quy_mo_phu_hop.includes(quyMo) ? 1.0 : 0.4;
    const sQuyMo = (1.0 + matchScale) / 2; // [0.7 - 1.0]

    // 4. Khớp ngân sách (Trọng số 0.15) R27
    let sNganSach = 0.5; // Mặc định cho giá 'lien_he' (không xác định R27)
    if (sol.trang_thai_gia !== 'lien_he' && sol.gia_min !== undefined) {
      if (sol.gia_min <= 0.7 * budgetCap) sNganSach = 1.0;
      else if (sol.gia_min <= budgetCap) sNganSach = 0.6;
      else sNganSach = 0.3;
    }

    // 5. Khớp mức sẵn sàng (Trọng số 0.10)
    let readyCount = 0;
    if (sanSang.nhanSu === 'chuyen_trach') readyCount += 1;
    else if (sanSang.nhanSu === 'kiem_nhiem') readyCount += 0.5;
    if (sanSang.duLieu === 'phan_mem' || sanSang.duLieu === 'excel_day_du') readyCount += 1;
    if (sanSang.lanhDao === 'truc_tiep') readyCount += 1;
    const sSanSang = Math.min(1.0, readyCount / 3);

    // 6. Khớp hệ thống hiện tại (Trọng số 0.10)
    let sHeThong = 0.5;
    const integratesWithCurrent = sol.tich_hop.some((t) => phanMemP07.includes(t));
    if (integratesWithCurrent || phanMemP07.includes('khong_co')) {
      sHeThong = 1.0;
    } else {
      sHeThong = 0.3;
    }

    // 7. Kết quả đã kiểm chứng (Trọng số 0.05)
    const sKiemChung = Math.min(1.0, (sol.co_chi_so_kiem_chung || 0) / 3);

    // Tổng điểm phù hợp theo trọng số (R08)
    const totalScore = (
      MATCHING_WEIGHTS.khoang_trong * sKhoangTrong +
      MATCHING_WEIGHTS.uu_tien * sUuTien +
      MATCHING_WEIGHTS.quy_mo_loai_hinh * sQuyMo +
      MATCHING_WEIGHTS.ngan_sach * sNganSach +
      MATCHING_WEIGHTS.san_sang * sSanSang +
      MATCHING_WEIGHTS.he_thong * sHeThong +
      MATCHING_WEIGHTS.kiem_chung * sKiemChung
    );

    const matchPercent = Math.round(totalScore * 100);

    // Lý do phù hợp (thành phần >= 0.8) & Hạn chế (thành phần < 0.5) R06
    const lyDo: string[] = [];
    const hanChe: string[] = [];

    if (sKhoangTrong >= 0.8) lyDo.push(`Giải quyết trực tiếp khoảng trống ưu tiên số 1: ${topGaps[0]?.ten_khoang_trong || gap1}`);
    else if (sKhoangTrong < 0.5) hanChe.push('Chưa khớp hoàn toàn với top 2 khoảng trống cấp bách nhất');

    if (sUuTien >= 0.8) lyDo.push('Đúng mục tiêu ưu tiên cải thiện trong 6 tháng tới');
    if (sQuyMo >= 0.85) lyDo.push(`Phù hợp cao với quy mô ${getTenQuyMo(quyMo)}`);
    if (sNganSach >= 0.8) lyDo.push('Chi phí dự kiến nằm gọn trong 70% ngân sách phân bổ');
    else if (sNganSach < 0.5 && sol.trang_thai_gia !== 'lien_he') hanChe.push('Chi phí giải pháp chạm ngưỡng trên của ngân sách');

    if (sHeThong >= 0.8) lyDo.push('Tương thích tốt với hệ thống phần mềm hiện có');
    else if (sHeThong < 0.5) hanChe.push('Yêu cầu chuẩn bị dữ liệu đầu vào hoặc chỉnh sửa API kết nối');

    if (sKiemChung >= 0.8) lyDo.push(`Đã có ${sol.co_chi_so_kiem_chung} doanh nghiệp ghi nhận cải thiện chỉ số thực tế`);

    return {
      solution: sol,
      diem_phu_hop: matchPercent,
      chi_tiet_diem: {
        khoang_trong_score: sKhoangTrong,
        uu_tien_score: sUuTien,
        quy_mo_score: sQuyMo,
        ngan_sach_score: sNganSach,
        san_sang_score: sSanSang,
        he_thong_score: sHeThong,
        kiem_chung_score: sKiemChung,
      },
      ly_do: lyDo,
      han_che: hanChe,
      thu_hang: 0,
      khoang_trong_khop: sol.khoang_trong_giai_quyet.filter((g) => gapCodes.includes(g)),
    };
  });

  // Tách thành 2 nhóm: Nhà cung cấp đã xác thực vs Nhóm giải pháp tham khảo (R11)
  const xacThucList = scoredSolutions.filter((s) => s.solution.trang_thai_nguon === 'da_xac_thuc');
  const thamKhaoList = scoredSolutions.filter((s) => s.solution.trang_thai_nguon === 'tham_khao');

  // Sắp xếp theo điểm phù hợp giảm dần (R10: Cờ tài trợ KHÔNG đổi thứ hạng, chỉ gắn nhãn)
  xacThucList.sort((a, b) => b.diem_phu_hop - a.diem_phu_hop);
  thamKhaoList.sort((a, b) => b.diem_phu_hop - a.diem_phu_hop);

  xacThucList.forEach((item, idx) => { item.thu_hang = idx + 1; });
  thamKhaoList.forEach((item, idx) => { item.thu_hang = idx + 1; });

  return {
    de_xuat_xac_thuc: xacThucList,
    nhom_tham_khao: thamKhaoList,
  };
}

// R25: Kiểm tra định dạng và chữ số kiểm tra mã số thuế Việt Nam
// W = [31, 29, 23, 19, 17, 13, 7, 5, 3]
// S = sum(d[i]*W[i] for i in range(9))
// if S % 11 == 0: False
// return (10 - S % 11) == d[9]
export function kiemTraMaSoThue(mst: string): { hop_le: boolean; loi?: string } {
  if (!mst) return { hop_le: false, loi: 'Vui lòng nhập mã số thuế.' };

  const cleanMst = mst.trim();

  // Kiểm tra chi nhánh (13 ký tự với dấu gạch ngang: XXXXXXXXXX-XXX)
  let ma10 = cleanMst;
  if (cleanMst.includes('-')) {
    const parts = cleanMst.split('-');
    if (parts.length !== 2 || parts[0].length !== 10 || parts[1].length !== 3) {
      return { hop_le: false, loi: 'Mã số thuế chi nhánh phải có dạng 10 số + "-" + 3 số (001-999).' };
    }
    const branchNum = parseInt(parts[1], 10);
    if (isNaN(branchNum) || branchNum < 1 || branchNum > 999) {
      return { hop_le: false, loi: 'Phần mã chi nhánh (3 chữ số sau) phải từ 001 đến 999.' };
    }
    ma10 = parts[0];
  }

  if (ma10.length !== 10 || !/^\d{10}$/.test(ma10)) {
    return { hop_le: false, loi: 'Mã số thuế doanh nghiệp phải bao gồm đúng 10 chữ số.' };
  }

  // Thuật toán kiểm tra chữ số kiểm tra (R25)
  const W = [31, 29, 23, 19, 17, 13, 7, 5, 3];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(ma10[i], 10) * W[i];
  }

  const mod = sum % 11;
  if (mod === 0) {
    return { hop_le: false, loi: 'Mã số thuế không đúng quy tắc thuật toán cấp mã (S mod 11 = 0).' };
  }

  const checkDigit = 10 - mod;
  const d9 = parseInt(ma10[9], 10);

  if (checkDigit !== d9) {
    return {
      hop_le: false,
      loi: `Chữ số kiểm tra không khớp (tính toán: ${checkDigit}, thực tế: ${d9}). Vui lòng kiểm tra lại.`
    };
  }

  return { hop_le: true };
}

// R26: Giả lập tra cứu thông tin doanh nghiệp qua mã số thuế (esgoo / xinvoice)
export interface TaxLookupResult {
  mst: string;
  ten: string;
  dia_chi: string;
  dai_dien?: string;
  tinh_trang: string;
  nguon: 'esgoo' | 'xinvoice' | 'thu_cong';
}

export function traCuuMstMoPhong(mst: string): TaxLookupResult {
  const cleanMst = mst.trim();
  // Một số mã số thuế mẫu thực tế trong hệ thống đã kiểm chứng
  const knownMst: Record<string, TaxLookupResult> = {
    '0316956049': {
      mst: '0316956049',
      ten: 'CÔNG TY TNHH MARINE DIGITALE',
      dia_chi: '490A Điện Biên Phủ, Phường 21, Quận Bình Thạnh, TP. Hồ Chí Minh',
      dai_dien: 'Nguyễn Hải Đăng',
      tinh_trang: 'Đang hoạt động (đã được cấp GCN ĐKKD)',
      nguon: 'esgoo'
    },
    '0101248141': {
      mst: '0101248141',
      ten: 'CÔNG TY CỔ PHẦN FPT',
      dia_chi: 'Số 10 phố Phạm Văn Bạch, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
      dai_dien: 'Nguyễn Văn Khoa',
      tinh_trang: 'NNT đang hoạt động',
      nguon: 'xinvoice'
    },
    '0108054755': {
      mst: '0108054755',
      ten: 'CÔNG TY TNHH CÔNG NGHỆ LOGIVAN VIỆT NAM',
      dia_chi: 'Tầng 3, số 18 ngõ 11 Thái Hà, Phường Trung Liệt, Quận Đống Đa, Hà Nội',
      dai_dien: 'Phạm Khánh Linh',
      tinh_trang: 'Đang hoạt động',
      nguon: 'esgoo'
    },
    '0101243150': {
      mst: '0101243150',
      ten: 'TỔNG CÔNG TY CỔ PHẦN BƯU CHÍNH VIETTEL',
      dia_chi: 'Tòa nhà Viettel, số 1 Giang Văn Minh, Phường Kim Mã, Ba Đình, Hà Nội',
      dai_dien: 'Hoàng Trung Thành',
      tinh_trang: 'Đang hoạt động',
      nguon: 'esgoo'
    },
    '0312144913': {
      mst: '0312144913',
      ten: 'CÔNG TY TNHH GIẢI PHÁP LOGISTICS SMARTLOG',
      dia_chi: '215B32 Nguyễn Văn Hưởng, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh',
      dai_dien: 'Kurt Bình',
      tinh_trang: 'Đang hoạt động',
      nguon: 'esgoo'
    }
  };

  if (knownMst[cleanMst]) {
    return knownMst[cleanMst];
  }

  // Generic fallback if tax code passes algorithm
  return {
    mst: cleanMst,
    ten: 'CÔNG TY CỔ PHẦN GIẢI PHÁP LOGISTICS VIỆT',
    dia_chi: 'Tầng 6, Tòa nhà Saigon Port, Quận 4, TP. Hồ Chí Minh',
    dai_dien: 'Đại diện Doanh nghiệp',
    tinh_trang: 'Đang hoạt động',
    nguon: 'esgoo'
  };
}
