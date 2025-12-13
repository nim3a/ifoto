package ir.ifoto.repository;

import ir.ifoto.model.Photo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    Page<Photo> findByEventId(Long eventId, Pageable pageable);
    List<Photo> findByEventIdAndProcessedFalse(Long eventId);
    long countByEventId(Long eventId);
}
