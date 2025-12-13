package ir.ifoto.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "face_embeddings", indexes = {
    @Index(name = "idx_photo_id", columnList = "photo_id"),
    @Index(name = "idx_vector_id", columnList = "vectorId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaceEmbedding {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photo_id", nullable = false)
    private Photo photo;
    
    @Column(nullable = false, unique = true, length = 100)
    private String vectorId;
    
    @Column(nullable = false)
    private Integer faceIndex;
    
    @Column
    private Integer boundingBoxX;
    
    @Column
    private Integer boundingBoxY;
    
    @Column
    private Integer boundingBoxWidth;
    
    @Column
    private Integer boundingBoxHeight;
    
    @Column
    private Float confidence;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
