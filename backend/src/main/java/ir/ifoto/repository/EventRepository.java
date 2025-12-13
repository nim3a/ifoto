package ir.ifoto.repository;

import ir.ifoto.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findBySlug(String slug);
    List<Event> findByPublishedTrue();
    List<Event> findByPhotographerId(Long photographerId);
    boolean existsBySlug(String slug);
}
