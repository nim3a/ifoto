package ir.ifoto.repository;

import ir.ifoto.model.FaceEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FaceEmbeddingRepository extends JpaRepository<FaceEmbedding, Long> {
    List<FaceEmbedding> findByPhotoId(Long photoId);
    Optional<FaceEmbedding> findByVectorId(String vectorId);
    long countByPhotoEventId(Long eventId);
}
