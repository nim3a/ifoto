package ir.ifoto.service;

import ir.ifoto.client.FaceServiceClient;
import ir.ifoto.dto.GalleryPhotoResponse;
import ir.ifoto.dto.PhotoUploadResponse;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PhotoService {
    
    private final PhotoRepository photoRepository;
    private final EventRepository eventRepository;
    private final FaceServiceClient faceServiceClient;
    private final StorageService storageService;
    
    @Transactional
    public PhotoUploadResponse uploadPhoto(Long eventId, MultipartFile file) {
        log.info("Uploading photo for event: {}", eventId);
        
        // Validate event exists
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String uniqueFilename = UUID.randomUUID().toString() + extension;
            
            // Store file
            String storagePath = storageService.store(file, "events/" + eventId, uniqueFilename);
            
            // Create photo entity
            Photo photo = new Photo();
            photo.setEvent(event);
            photo.setFileName(originalFilename);
            photo.setStoragePath(storagePath);
            photo.setFileSize(file.getSize());
            photo.setFileType(file.getContentType());
            photo.setFaceCount(0);
            photo.setProcessed(false);
            photo.setUploadedAt(LocalDateTime.now());
            
            Photo savedPhoto = photoRepository.save(photo);
            
            // Extract face embeddings asynchronously
            try {
                FaceServiceClient.FaceExtractionResponse faceResponse = 
                        faceServiceClient.extractEmbeddings(file, savedPhoto.getId(), eventId);
                
                // Update face count
                savedPhoto.setFaceCount(faceResponse.faceCount());
                savedPhoto.setProcessed(true);
                photoRepository.save(savedPhoto);
                
                log.info("Extracted {} faces from photo {}", faceResponse.faceCount(), savedPhoto.getId());
                
            } catch (Exception e) {
                log.error("Failed to extract face embeddings for photo {}: {}", savedPhoto.getId(), e.getMessage());
                // Continue even if face extraction fails
            }
            
            // Build response
            return new PhotoUploadResponse(
                    savedPhoto.getId(),
                    savedPhoto.getFileName(),
                    savedPhoto.getStoragePath(),
                    savedPhoto.getFileSize(),
                    savedPhoto.getFaceCount(),
                    savedPhoto.getUploadedAt()
            );
            
        } catch (Exception e) {
            log.error("Error uploading photo: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload photo", e);
        }
    }
    
    @Transactional(readOnly = true)
    public List<GalleryPhotoResponse> getPhotosByEvent(Long eventId) {
        log.info("Getting photos for event: {}", eventId);
        
        // Validate event exists
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with id: " + eventId);
        }
        
        List<Photo> photos = photoRepository.findByEventId(eventId, org.springframework.data.domain.Pageable.unpaged())
                .getContent();
        
        return photos.stream()
                .map(photo -> new GalleryPhotoResponse(
                        photo.getId(),
                        photo.getFileName(),
                        photo.getStoragePath(),
                        photo.getThumbnailPath(),
                        photo.getFaceCount(),
                        photo.getUploadedAt()
                ))
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Photo getPhotoById(Long photoId) {
        return photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found with id: " + photoId));
    }
    
    @Transactional
    public void deletePhoto(Long photoId) {
        log.info("Deleting photo: {}", photoId);
        
        Photo photo = getPhotoById(photoId);
        
        // Delete from storage
        try {
            storageService.delete(photo.getStoragePath());
            if (photo.getThumbnailPath() != null) {
                storageService.delete(photo.getThumbnailPath());
            }
        } catch (Exception e) {
            log.error("Error deleting photo files: {}", e.getMessage());
        }
        
        // Delete from database
        photoRepository.delete(photo);
    }
}
