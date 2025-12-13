package ir.ifoto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaceSearchResponse {
    private List<PhotoMatch> matches;
    private Integer totalMatches;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PhotoMatch {
        private Long photoId;
        private String photoUrl;
        private String thumbnailUrl;
        private Float similarity;
        private FaceLocation faceLocation;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FaceLocation {
        private Integer x;
        private Integer y;
        private Integer width;
        private Integer height;
    }
}
