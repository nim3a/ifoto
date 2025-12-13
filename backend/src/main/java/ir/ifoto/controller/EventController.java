package ir.ifoto.controller;

import ir.ifoto.dto.EventRequest;
import ir.ifoto.dto.EventResponse;
import ir.ifoto.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    
    private final EventService eventService;
    
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request,
            Authentication authentication) {
        EventResponse response = eventService.createEvent(request, authentication.getName());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/public")
    public ResponseEntity<List<EventResponse>> getPublishedEvents() {
        List<EventResponse> events = eventService.getPublishedEvents();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/public/{slug}")
    public ResponseEntity<EventResponse> getEventBySlug(@PathVariable String slug) {
        EventResponse event = eventService.getEventBySlug(slug);
        return ResponseEntity.ok(event);
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<EventResponse>> getMyEvents(Authentication authentication) {
        List<EventResponse> events = eventService.getMyEvents(authentication.getName());
        return ResponseEntity.ok(events);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request) {
        EventResponse response = eventService.updateEvent(id, request);
        return ResponseEntity.ok(response);
    }
}
