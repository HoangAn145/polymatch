package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Service
public class TaxService {

    private final RestClient restClient = RestClient.create();
    private final ObjectMapper mapper = new ObjectMapper();

    public Map<String, Object> lookupTaxCode(String taxCode) {
        Map<String, Object> result = new HashMap<>();
        String url = "https://api.xinvoice.vn/gdt-api/tax-payer/" + taxCode.trim();

        try {
            String response = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(String.class);

            JsonNode root = mapper.readTree(response);
            
            if (root.has("data") && !root.get("data").isNull()) {
                JsonNode data = root.get("data");
                result.put("valid", true);
                result.put("companyName", data.has("name") ? data.get("name").asText() : (data.has("title") ? data.get("title").asText() : ""));
                result.put("address", data.has("address") ? data.get("address").asText() : "");
            } else {
                result.put("valid", false);
                result.put("message", "MST không tồn tại");
            }
        } catch (Exception e) {
            result.put("valid", false);
            result.put("message", "MST không tồn tại");
        }

        return result;
    }
}