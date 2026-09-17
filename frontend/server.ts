import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { matchTechSolutionsLocally, AdvisorRequest } from "./src/services/geminiTechAdvisorService";
import { QUY_TAC_SUA_GIA } from "./src/data/geminiTechKnowledgeBase";

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI Gemini Tech Advisor Endpoint
  app.post("/api/gemini/advisor", async (req, res) => {
    const request: AdvisorRequest = req.body;
    
    const fallbackResponse = matchTechSolutionsLocally(request);
    const ai = getGenAI();

    if (!ai) {
      return res.json(fallbackResponse);
    }

    try {
      const weakestPillarsText = request.weakestPillars && request.weakestPillars.length > 0
        ? request.weakestPillars.map(w => `${w.pillarName || w.pillarId} (đạt ${w.score}%)`).join(', ')
        : 'Chưa xác định';

      const gapsText = request.diagnosedGaps && request.diagnosedGaps.length > 0
        ? request.diagnosedGaps.map(g => `- Lỗ hổng: ${g.issue} -> Khuyến nghị: ${g.recommendation}`).join('\n')
        : 'Không có ghi nhận lỗ hổng nghiêm trọng';

      const prompt = `
Bạn là Chuyên gia Tư vấn Cấp cao về Chuyển đổi số Doanh nghiệp (Bộ Khoa học & Công nghệ / Đề án DBI theo QĐ 1567/QĐ-BKHCN).
Bạn được cung cấp bộ hồ sơ thu thập tự động từ kết quả làm bài Đánh giá Chỉ số Chuyển đổi số (DBI) của chính doanh nghiệp này:

=== HỒ SƠ DỮ LIỆU THU THẬP TỰ ĐỘNG TỪ BÀI ĐÁNH GIÁ DBI ===
- Tên Doanh nghiệp: ${request.companyName || 'Doanh nghiệp'}
- Mã số thuế: ${request.mst || 'Chưa cập nhật'}
- Phân loại quy mô: ${request.isLargeEnterprise || request.enterpriseType === 'LARGE' ? 'Doanh nghiệp Lớn / Tập đoàn (thang 695 điểm)' : 'Doanh nghiệp Vừa và Nhỏ (SME, thang 100 điểm)'}
- Ngành nghề hoạt động: ${request.industry || 'Bán lẻ'}
- Nhóm ngành chuyên biệt lựa chọn: ${request.industrySector || request.industry || 'Chung'}
- Quy mô nhân sự: ${request.employeeCount || 35} người (${request.companySize || 'SME'})
- Điểm đánh giá DBI đạt được: ${request.totalScore || 45}/${request.scaleMax || 100} điểm (${request.percentageScore || 45}%)
- Cấp độ DBI hiện tại: Mức ${request.currentDbiLevel || 2} (${request.levelTitle || 'Bắt đầu kết nối'})
- Trụ cột điểm nghẽn / yếu nhất phát hiện từ bài đánh giá: ${weakestPillarsText}
- Các lỗ hổng cụ thể từ câu trả lời khảo sát:
${gapsText}
- Ngân sách đầu tư dự kiến: ${request.budgetRange || 'Linh hoạt'}
- Kế hoạch triển khai: ${request.timeline || 'Năm 2026'}

=== BỘ QUY TẮC THẨM ĐỊNH GIÁ & TIÊU CHUẨN ĐỀ ÁN ===
${JSON.stringify(QUY_TAC_SUA_GIA, null, 2)}

=== DANH MỤC GIẢI PHÁP CÔNG NGHỆ ĐÃ KHỚP NỐI THEO LỖ HỔNG DBI ===
${JSON.stringify(fallbackResponse.recommendedSolutions, null, 2)}

YÊU CẦU:
Hãy phân tích trực tiếp hiện trạng của doanh nghiệp dựa trên bài đánh giá DBI đã thu thập được ở trên:
1. Đoạn Tóm tắt chiến lược (summary): Nhắc rõ tên doanh nghiệp, ngành nghề, số điểm/cấp độ đạt được, chỉ rõ điểm nghẽn nguy hiểm nhất và tại sao các giải pháp được chọn giải quyết đúng bệnh của doanh nghiệp.
2. Ba giai đoạn hành động cụ thể (strategicRoadmap): Giai đoạn 1 (0-3 tháng), Giai đoạn 2 (3-6 tháng), Giai đoạn 3 (6-12 tháng) gắn với việc tháo gỡ điểm nghẽn và thăng hạng DBI lên Cấp độ ${Math.min(5, (request.currentDbiLevel || 2) + 1)}.
3. Lưu ý thẩm định giá (pricingGovernanceNotice): Khẳng định việc quản trị chi phí minh bạch.

Trả về định dạng JSON thuần túy:
{
  "summary": "Tóm tắt phân tích chiến lược...",
  "strategicRoadmap": ["Giai đoạn 1...", "Giai đoạn 2...", "Giai đoạn 3..."],
  "pricingGovernanceNotice": "Lưu ý quy tắc giá..."
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({
          summary: parsed.summary || fallbackResponse.summary,
          strategicRoadmap: parsed.strategicRoadmap || fallbackResponse.strategicRoadmap,
          recommendedSolutions: fallbackResponse.recommendedSolutions,
          pricingGovernanceNotice: parsed.pricingGovernanceNotice || fallbackResponse.pricingGovernanceNotice,
          isAiGenerated: true,
          harvestedProfile: fallbackResponse.harvestedProfile
        });
      } catch (parseError) {
        return res.json(fallbackResponse);
      }
    } catch (err: any) {
      console.warn("Gemini API call failed, falling back to local dataset:", err?.message || err);
      return res.json(fallbackResponse);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
