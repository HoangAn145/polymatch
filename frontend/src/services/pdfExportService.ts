import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportPdfOptions {
  fileName?: string;
  elementId: string;
  onProgress?: (progress: number, stage: string) => void;
}

/**
 * Xuất phần tử HTML chỉ định thành file PDF A4 chất lượng cao
 */
export async function exportElementToPdf({
  elementId,
  fileName = 'Ho-So-Nang-Luc-Chuyen-Doi-So-DBI.pdf',
  onProgress
}: ExportPdfOptions): Promise<boolean> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Không tìm thấy phần tử HTML với ID: ${elementId}`);
      return false;
    }

    onProgress?.(10, 'Đang chuẩn bị dữ liệu hồ sơ năng lực...');

    // Tạm thời mở rộng để chụp toàn bộ chiều cao nếu đang ở chế độ xem cuộn
    const originalStyle = element.style.cssText;
    
    onProgress?.(30, 'Đang kết xuất biểu đồ và đồ họa...');

    const canvas = await html2canvas(element, {
      scale: 2, // Tăng độ phân giải gấp đôi để chữ và biểu đồ sắc nét khi in
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: 1200 // Chiều rộng chuẩn desktop để bố cục không bị co rúm
    });

    onProgress?.(70, 'Đang khởi tạo tài liệu PDF A4...');

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Tính toán chiều cao tương ứng trên trang PDF
    const totalPdfHeight = (canvasHeight * pdfWidth) / canvasWidth;
    let remainingHeight = totalPdfHeight;
    let position = 0;

    // Trang 1
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
    remainingHeight -= pdfHeight;

    // Nếu dài hơn 1 trang A4, tự động thêm trang tiếp theo
    while (remainingHeight > 0) {
      position = position - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
      remainingHeight -= pdfHeight;
    }

    onProgress?.(95, 'Đang lưu file PDF về máy tính...');
    pdf.save(fileName);

    onProgress?.(100, 'Hoàn tất tải xuống!');
    return true;
  } catch (error) {
    console.error('Lỗi khi xuất PDF:', error);
    return false;
  }
}
