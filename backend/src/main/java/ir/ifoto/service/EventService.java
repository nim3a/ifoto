package ir.ifoto.service;

import ir.ifoto.dto.EventRequest;
import ir.ifoto.dto.EventResponse;
import ir.ifoto.model.Event;
import ir.ifoto.model.User;
import ir.ifoto.repository.EventRepository;
import ir.ifoto.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {
    
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public EventResponse createEvent(EventRequest request, String username) {
        User photographer = userRepository.findByUsername(username)
                .orElseThrow(() -> new ir.ifoto.exception.ResourceNotFoundException("User not found"));
        
        if (eventRepository.existsBySlug(request.getSlug())) {
            throw new ir.ifoto.exception.DuplicateResourceException("Event slug already exists");
        }
        
        Event event = new Event();
        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setSlug(request.getSlug());
        event.setAccessType(request.getAccessType());
        event.setAccessPassword(request.getAccessPassword());
        event.setCoverImageUrl(request.getCoverImageUrl());
        event.setWatermarkUrl(request.getWatermarkUrl());
        event.setSponsorLogoUrl(request.getSponsorLogoUrl());
        event.setPublished(request.getPublished() != null ? request.getPublished() : false);
        event.setPhotographer(photographer);
        
        event = eventRepository.save(event);
        return mapToResponse(event);
    }
    
    public EventResponse getEventBySlug(String slug) {
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new ir.ifoto.exception.ResourceNotFoundException("Event not found"));
        return mapToResponse(event);
    }
    
    public List<EventResponse> getPublishedEvents() {
        return eventRepository.findByPublishedTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<EventResponse> getMyEvents(String username) {
        User photographer = userRepository.findByUsername(username)
                .orElseThrow(() -> new ir.ifoto.exception.ResourceNotFoundException("User not found"));
        return eventRepository.findByPhotographerId(photographer.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public EventResponse updateEvent(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ir.ifoto.exception.ResourceNotFoundException("Event not found"));
        
        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setAccessType(request.getAccessType());
        event.setAccessPassword(request.getAccessPassword());
        event.setCoverImageUrl(request.getCoverImageUrl());
        event.setWatermarkUrl(request.getWatermarkUrl());
        event.setSponsorLogoUrl(request.getSponsorLogoUrl());
        if (request.getPublished() != null) {
            event.setPublished(request.getPublished());
        }
        
        event = eventRepository.save(event);
        return mapToResponse(event);
    }
    
    private EventResponse mapToResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setName(event.getName());
        response.setDescription(event.getDescription());
        response.setEventDate(event.getEventDate());
        response.setLocation(event.getLocation());
        response.setSlug(event.getSlug());
        response.setAccessType(event.getAccessType());
        response.setCoverImageUrl(event.getCoverImageUrl());
        response.setWatermarkUrl(event.getWatermarkUrl());
        response.setSponsorLogoUrl(event.getSponsorLogoUrl());
        response.setPublished(event.getPublished());
        response.setPhotoCount(event.getPhotoCount());
        response.setPhotographerName(event.getPhotographer() != null ? event.getPhotographer().getFullName() : null);
        response.setCreatedAt(event.getCreatedAt());
        response.setUpdatedAt(event.getUpdatedAt());
        return response;
    }
}
