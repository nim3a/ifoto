package ir.ifoto.dto;

import ir.ifoto.model.Event;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {
    @NotBlank(message = "Event name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Event date is required")
    private LocalDate eventDate;
    
    private String location;
    
    @NotBlank(message = "Slug is required")
    private String slug;
    
    @NotNull(message = "Access type is required")
    private Event.AccessType accessType;
    
    private String accessPassword;
    
    private String coverImageUrl;
    
    private String watermarkUrl;
    
    private String sponsorLogoUrl;
    
    private Boolean published;
}
