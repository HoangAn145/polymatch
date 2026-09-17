package com.example.demo.controller;

// LƯU Ý: Phải có dòng import này để Spring nhận diện được GeminiService
import com.example.demo.service.GeminiService; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gemini")
@CrossOrigin(origins = "*")
public class GeminiAdvisorController {

    private final GeminiService geminiService;

    // Injection thông qua Constructor
    public GeminiAdvisorController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/advisor")
    public ResponseEntity<?> getAdvice(@RequestBody Map<String, Object> requestData) {
        String result = geminiService.getAdvisorRecommendation(requestData.toString());
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", result
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "Java Spring Boot Backend running successfully!"));
    }
}