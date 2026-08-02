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
        List<Event> events = eventRepository.findAll().stream()
                .filter(e -> e.getStatus() == null || (!e.getStatus().equalsIgnoreCase("Closed") && !e.getStatus().equalsIgnoreCase("Completed")))
                .collect(Collectors.toList());
        return events.stream().map(EventDTO::fromEntity).collect(Collectors.toList());
    }

    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));
        return EventDTO.fromEntity(event);
    }

    public EventDTO createEvent(Event event) {
        if (event.getName() == null || event.getName().trim().isEmpty()) {
            event.setName("New Event");
        }
        if (event.getStartTime() == null || event.getStartTime().trim().isEmpty()) {
            event.setStartTime("09:00 AM");
        }
        if (event.getEndTime() == null || event.getEndTime().trim().isEmpty()) {
            event.setEndTime("05:00 PM");
        }
        if (event.getCategory() == null || event.getCategory().trim().isEmpty()) {
            event.setCategory("General");
        }
        if (event.getVenue() == null || event.getVenue().trim().isEmpty()) {
            event.setVenue("Main Venue");
        }
        if (event.getDate() == null || event.getDate().trim().isEmpty()) {
            event.setDate("2026-08-30");
        }
        if (event.getMaxCapacity() == null || event.getMaxCapacity() <= 0) {
            event.setMaxCapacity(500);
        }
        if (event.getRemainingSeats() == null) {
            event.setRemainingSeats(event.getMaxCapacity());
        }
        if (event.getTicketPrice() == null) {
            event.setTicketPrice(0.0);
        }
        if (event.getStatus() == null || event.getStatus().trim().isEmpty()) {
            event.setStatus("Active");
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
