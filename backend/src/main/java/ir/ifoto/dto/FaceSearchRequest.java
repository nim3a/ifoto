package ir.ifoto.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaceSearchRequest {
    @NotNull(message = "Event ID is required")
    private Long eventId;
    
    private Integer limit = 50;
    
    private Float threshold = 0.6f;
}
