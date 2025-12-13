package ir.ifoto.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "photos", indexes = {
    @Index(name = "idx_event_id", columnList = "event_id"),
    @Index(name = "idx_storage_path", columnList = "storagePath")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Photo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @Column(nullable = false, length = 500)
    private String fileName;
    
    @Column(nullable = false, unique = true, length = 500)
    private String storagePath;
    
    @Column(length = 500)
    private String thumbnailPath;
    
    @Column(nullable = false)
    private Long fileSize;
    
    @Column(length = 10)
    private String fileType;
    
    @Column
    private Integer width;
    
    @Column
    private Integer height;
    
    @Column(nullable = false)
    private Integer faceCount = 0;
    
    @Column(nullable = false)
    private Boolean processed = false;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;
}
