package com.smartevent.controller;

import com.smartevent.dto.EventDTO;
import com.smartevent.model.Event;
import com.smartevent.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(eventService.getAllEvents(status));
    }

    @GetMapping("/active")
    public ResponseEntity<List<EventDTO>> getActiveEvents() {
        return ResponseEntity.ok(eventService.getActiveEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping(consumes = {org.springframework.http.MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8", org.springframework.http.MediaType.ALL_VALUE})
    public ResponseEntity<EventDTO> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    @PutMapping(value = "/{id}", consumes = {org.springframework.http.MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8", org.springframework.http.MediaType.ALL_VALUE})
    public ResponseEntity<EventDTO> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        return ResponseEntity.ok(eventService.updateEvent(id, event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
