package ir.ifoto.dto;

import ir.ifoto.model.Event;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDate eventDate;
    private String location;
    private String slug;
    private Event.AccessType accessType;
    private String coverImageUrl;
    private String watermarkUrl;
    private String sponsorLogoUrl;
    private Boolean published;
    private Integer photoCount;
    private String photographerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
