package ir.ifoto.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class FaceServiceClient {
    
    private final RestTemplate restTemplate;
    private final String faceServiceUrl;
    
    public FaceServiceClient(
            RestTemplate restTemplate,
            @Value("${ifoto.face-service.url}") String faceServiceUrl) {
        this.restTemplate = restTemplate;
        this.faceServiceUrl = faceServiceUrl;
    }
    
    /**
     * Extract face embeddings from an image
     */
    public FaceExtractionResponse extractEmbeddings(MultipartFile file, Long photoId, Long eventId) {
        try {
            String url = faceServiceUrl + "/api/face/extract";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new MultipartFileResource(file));
            body.add("photo_id", photoId.toString());
            body.add("event_id", eventId.toString());
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            ResponseEntity<FaceExtractionResponse> response = restTemplate.postForEntity(
                    url, 
                    requestEntity, 
                    FaceExtractionResponse.class
            );
            
            return response.getBody();
            
        } catch (Exception e) {
            log.error("Error extracting face embeddings: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to extract face embeddings", e);
        }
    }
    
    /**
     * Search for similar faces
     */
    public FaceSearchResult searchSimilarFaces(MultipartFile file, Long eventId, Integer limit, Float threshold) {
        try {
            String url = faceServiceUrl + "/api/face/search";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new MultipartFileResource(file));
            body.add("event_id", eventId.toString());
            body.add("limit", limit != null ? limit.toString() : "50");
            body.add("threshold", threshold != null ? threshold.toString() : "0.6");
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            ResponseEntity<FaceSearchResult> response = restTemplate.postForEntity(
                    url,
                    requestEntity,
                    FaceSearchResult.class
            );
            
            return response.getBody();
            
        } catch (Exception e) {
            log.error("Error searching faces: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to search faces", e);
        }
    }
    
    /**
     * Delete embeddings for an event
     */
    public void deleteEventEmbeddings(Long eventId) {
        try {
            String url = faceServiceUrl + "/api/face/delete-event";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> body = Map.of("event_id", eventId);
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            restTemplate.exchange(url, HttpMethod.DELETE, requestEntity, Void.class);
            
        } catch (Exception e) {
            log.error("Error deleting event embeddings: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete event embeddings", e);
        }
    }
    
    // Helper class to convert MultipartFile to Resource
    private static class MultipartFileResource extends ByteArrayResource {
        private final String filename;
        
        public MultipartFileResource(MultipartFile multipartFile) throws IOException {
            super(multipartFile.getBytes());
            this.filename = multipartFile.getOriginalFilename();
        }
        
        @Override
        public String getFilename() {
            return this.filename;
        }
    }
    
    // Response DTOs for Face Service
    public record FaceExtractionResponse(
            Integer faceCount,
            List<EmbeddingData> embeddings
    ) {}
    
    public record EmbeddingData(
            String vectorId,
            Integer faceIndex,
            List<Integer> bbox,
            Float confidence
    ) {}
    
    public record FaceSearchResult(
            List<FaceMatch> matches,
            Integer totalMatches
    ) {}
    
    public record FaceMatch(
            String vectorId,
            Float similarity,
            Long photoId,
            Long eventId,
            Integer faceIndex,
            List<Integer> bbox,
            Float confidence
    ) {}
}
