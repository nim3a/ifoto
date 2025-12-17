package ir.ifoto.service;

import ir.ifoto.client.FaceServiceClient;
import ir.ifoto.dto.FaceSearchResponse;
import ir.ifoto.exception.ResourceNotFoundException;
import ir.ifoto.model.Event;
import ir.ifoto.model.Photo;
import ir.ifoto.repository.EventRepository;
import ir.ifoto.repository.PhotoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FaceSearchService {
    
    private final FaceServiceClient faceServiceClient;
    private final PhotoRepository photoRepository;
    private final EventRepository eventRepository;
    private final StorageService storageService;
    
    @Transactional(readOnly = true)
    public FaceSearchResponse searchByFace(Long eventId, MultipartFile file, Integer limit, Float threshold) {
        log.info("Searching faces in event {} with limit {} and threshold {}", eventId, limit, threshold);
        
        // Validate event exists
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        try {
            // Search for similar faces using Face Service
            FaceServiceClient.FaceSearchResult searchResult = faceServiceClient.searchSimilarFaces(
                    file, 
                    eventId, 
                    limit != null ? limit : 50,
                    threshold != null ? threshold : 0.6f
            );
            
            // Convert to response format
            List<FaceSearchResponse.PhotoMatch> matches = new ArrayList<>();
            
            for (FaceServiceClient.FaceMatch match : searchResult.matches()) {
                // Get photo details
                Photo photo = photoRepository.findById(match.photoId())
                        .orElse(null);
                
                if (photo != null) {
                    // Generate photo URL
                    String photoUrl = storageService.getUrl(photo.getStoragePath());
                    String thumbnailUrl = photo.getThumbnailPath() != null 
                            ? storageService.getUrl(photo.getThumbnailPath())
                            : null;
                    
                    // Convert bbox to FaceLocation
                    FaceSearchResponse.FaceLocation faceLocation = null;
                    if (match.bbox() != null && match.bbox().size() == 4) {
                        List<Integer> bbox = match.bbox();
                        faceLocation = new FaceSearchResponse.FaceLocation(
                                bbox.get(0),  // x
                                bbox.get(1),  // y
                                bbox.get(2) - bbox.get(0),  // width
                                bbox.get(3) - bbox.get(1)   // height
                        );
                    }
                    
                    matches.add(new FaceSearchResponse.PhotoMatch(
                            photo.getId(),
                            photoUrl,
                            thumbnailUrl,
                            match.similarity(),
                            faceLocation
                    ));
                }
            }
            
            log.info("Found {} matching photos", matches.size());
            
            return new FaceSearchResponse(matches, matches.size());
            
        } catch (Exception e) {
            log.error("Error searching faces: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to search faces", e);
        }
    }
    
    @Transactional
    public void deleteEventEmbeddings(Long eventId) {
        log.info("Deleting face embeddings for event: {}", eventId);
        
        // Validate event exists
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with id: " + eventId);
        }
        
        try {
            faceServiceClient.deleteEventEmbeddings(eventId);
            log.info("Successfully deleted embeddings for event {}", eventId);
        } catch (Exception e) {
            log.error("Error deleting event embeddings: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete event embeddings", e);
        }
    }
}
