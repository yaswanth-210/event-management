package com.smartevent.service;

import com.smartevent.dto.EventDTO;
import com.smartevent.model.Event;
import com.smartevent.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<EventDTO> getAllEvents(String status) {
        List<Event> events;
        if (status != null && !status.isEmpty()) {
            events = eventRepository.findByStatus(status);
        } else {
            events = eventRepository.findAll();
        }
        return events.stream().map(EventDTO::fromEntity).collect(Collectors.toList());
    }

    public List<EventDTO> getActiveEvents() {
        return eventRepository.findByStatus("Active").stream()
                .map(EventDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));
        return EventDTO.fromEntity(event);
    }

    public EventDTO createEvent(Event event) {
        if (event.getRemainingSeats() == null) {
            event.setRemainingSeats(event.getMaxCapacity());
        }
        Event saved = eventRepository.save(event);
        return EventDTO.fromEntity(saved);
    }

    public EventDTO updateEvent(Long id, Event updatedData) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (updatedData.getName() != null) event.setName(updatedData.getName());
        if (updatedData.getDescription() != null) event.setDescription(updatedData.getDescription());
        if (updatedData.getCategory() != null) event.setCategory(updatedData.getCategory());
        if (updatedData.getVenue() != null) event.setVenue(updatedData.getVenue());
        if (updatedData.getDate() != null) event.setDate(updatedData.getDate());
        if (updatedData.getStartTime() != null) event.setStartTime(updatedData.getStartTime());
        if (updatedData.getEndTime() != null) event.setEndTime(updatedData.getEndTime());
        if (updatedData.getMaxCapacity() != null) event.setMaxCapacity(updatedData.getMaxCapacity());
        if (updatedData.getTicketPrice() != null) event.setTicketPrice(updatedData.getTicketPrice());
        if (updatedData.getBannerImage() != null) event.setBannerImage(updatedData.getBannerImage());
        if (updatedData.getStatus() != null) event.setStatus(updatedData.getStatus());

        Event saved = eventRepository.save(event);
        return EventDTO.fromEntity(saved);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
}
