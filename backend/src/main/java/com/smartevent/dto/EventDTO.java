package com.smartevent.dto;

import com.smartevent.model.Event;

public class EventDTO {
    private Long id;
    private String name;
    private String description;
    private String category;
    private String venue;
    private String date;
    private String start_time;
    private String end_time;
    private Integer max_capacity;
    private Integer remaining_seats;
    private Double ticket_price;
    private String banner_image;
    private String status;
    private String created_at;

    public static EventDTO fromEntity(Event e) {
        EventDTO dto = new EventDTO();
        dto.id = e.getId();
        dto.name = e.getName();
        dto.description = e.getDescription();
        dto.category = e.getCategory();
        dto.venue = e.getVenue();
        dto.date = e.getDate();
        dto.start_time = e.getStartTime();
        dto.end_time = e.getEndTime();
        dto.max_capacity = e.getMaxCapacity();
        dto.remaining_seats = e.getRemainingSeats();
        dto.ticket_price = e.getTicketPrice();
        dto.banner_image = e.getBannerImage();
        dto.status = e.getStatus();
        dto.created_at = e.getCreatedAt() != null ? e.getCreatedAt().toString() : null;
        return dto;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getVenue() { return venue; }
    public String getDate() { return date; }
    public String getStart_time() { return start_time; }
    public String getEnd_time() { return end_time; }
    public Integer getMax_capacity() { return max_capacity; }
    public Integer getRemaining_seats() { return remaining_seats; }
    public Double getTicket_price() { return ticket_price; }
    public String getBanner_image() { return banner_image; }
    public String getStatus() { return status; }
    public String getCreated_at() { return created_at; }
}
