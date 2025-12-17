package ir.ifoto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GalleryPhotoResponse {
    private Long id;
    private String fileName;
    private String storagePath;
    private String thumbnailPath;
    private Integer faceCount;
    private LocalDateTime uploadedAt;
}
