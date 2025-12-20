package ir.ifoto.controller;

import ir.ifoto.dto.FaceSearchResponse;
import ir.ifoto.dto.GalleryPhotoResponse;
import ir.ifoto.dto.PhotoUploadResponse;
import ir.ifoto.service.FaceSearchService;
import ir.ifoto.service.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {
    
    private final PhotoService photoService;
    private final FaceSearchService faceSearchService;
    
    @PostMapping("/upload")
    public ResponseEntity<PhotoUploadResponse> uploadPhoto(
            @RequestParam("eventId") Long eventId,
            @RequestParam("file") MultipartFile file) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        PhotoUploadResponse response = photoService.uploadPhoto(eventId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/events/{eventId}")
    public ResponseEntity<List<GalleryPhotoResponse>> getEventPhotos(@PathVariable Long eventId) {
        List<GalleryPhotoResponse> photos = photoService.getPhotosByEvent(eventId);
        return ResponseEntity.ok(photos);
    } 
    @PostMapping("/search-by-face")
    public ResponseEntity<FaceSearchResponse> searchByFace(
            @RequestParam("eventId") Long eventId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "threshold", required = false) Float threshold) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        FaceSearchResponse response = faceSearchService.searchByFace(eventId, file, limit, threshold);
        return ResponseEntity.ok(response);
    }
}

