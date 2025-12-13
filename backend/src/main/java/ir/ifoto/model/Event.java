package ir.ifoto.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(length = 2000)
    private String description;
    
    @Column(nullable = false)
    private LocalDate eventDate;
    
    @Column(length = 200)
    private String location;
    
    @Column(nullable = false, unique = true, length = 100)
    private String slug;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccessType accessType = AccessType.PUBLIC;
    
    @Column(length = 500)
    private String accessPassword;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photographer_id")
    private User photographer;
    
    @Column(length = 500)
    private String coverImageUrl;
    
    @Column(length = 500)
    private String watermarkUrl;
    
    @Column(length = 500)
    private String sponsorLogoUrl;
    
    @Column(nullable = false)
    private Boolean published = false;
    
    @Column(nullable = false)
    private Integer photoCount = 0;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    public enum AccessType {
        PUBLIC,
        PASSWORD_PROTECTED,
        JWT_PROTECTED
    }
}
