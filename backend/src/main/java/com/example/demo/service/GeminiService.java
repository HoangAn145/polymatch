package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    @SuppressWarnings("null")
    public String getAdvisorRecommendation(String assessmentPayload) {
        String systemPrompt = """
            Bạn là chuyên gia tư vấn Chuyển đổi số doanh nghiệp theo Khung chỉ số DBI (Bộ Thông tin và Truyền thông).
            Dữ liệu đánh giá doanh nghiệp: %s
            
            Hãy trả về tư vấn chuyên sâu gồm:
            1. Đánh giá tổng quan mức độ sẵn sàng CĐS.
            2. Điểm mạnh và điểm yếu cần cải thiện theo các trụ cột.
            3. Top 3 hành động ưu tiên ngắn hạn và dài hạn.
            Trả lời theo dạng Markdown rõ ràng, chuyên nghiệp.
            """.formatted(assessmentPayload);

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", systemPrompt)))
            )
        );

        try {
            return restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Objects.requireNonNull(body))
                    .retrieve()
                    .body(String.class);
        } catch (Exception e) {
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }
}