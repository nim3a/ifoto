package ir.ifoto.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {
    
    private final RestTemplate restTemplate;
    
    @Value("${ifoto.face-service.url}")
    private String faceServiceUrl;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "ifoto-backend");
        health.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(health);
    }
    
    @GetMapping("/face-service")
    public ResponseEntity<Map<String, Object>> checkFaceService() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String url = faceServiceUrl + "/health";
            ResponseEntity<Map> faceServiceResponse = restTemplate.getForEntity(url, Map.class);
            
            response.put("status", "UP");
            response.put("faceService", faceServiceResponse.getBody());
            response.put("connected", true);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "DOWN");
            response.put("error", e.getMessage());
            response.put("connected", false);
            
            return ResponseEntity.status(503).body(response);
        }
    }
}
