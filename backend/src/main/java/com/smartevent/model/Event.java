package com.smartevent.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name = "New Event";

    @Column(columnDefinition = "TEXT")
    private String description = "";

    @Column(nullable = true, length = 50)
    private String category = "General";

    @Column(nullable = true, length = 150)
    private String venue = "Main Venue";

    @Column(nullable = true, length = 20)
    private String date = "2026-08-30";

    @JsonProperty("start_time")
    @JsonAlias({"startTime", "start_time"})
    @Column(nullable = true, length = 20)
    private String startTime = "09:00 AM";

    @JsonProperty("end_time")
    @JsonAlias({"endTime", "end_time"})
    @Column(nullable = true, length = 20)
    private String endTime = "05:00 PM";

    @JsonProperty("max_capacity")
    @JsonAlias({"maxCapacity", "max_capacity"})
    @Column(nullable = true)
    private Integer maxCapacity = 500;

    @JsonProperty("remaining_seats")
    @JsonAlias({"remainingSeats", "remaining_seats"})
    @Column(nullable = true)
    private Integer remainingSeats = 500;

    @JsonProperty("ticket_price")
    @JsonAlias({"ticketPrice", "ticket_price"})
    @Column(nullable = true)
    private Double ticketPrice = 0.0;

    @JsonProperty("banner_image")
    @JsonAlias({"bannerImage", "banner_image"})
    @Column(length = 256)
    private String bannerImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80";

    @Column(length = 20)
    private String status = "Active"; // "Upcoming", "Active", "Completed", "Closed"

    private LocalDateTime createdAt = LocalDateTime.now();

    public Event() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    @JsonProperty("start_time")
    public String getStartTime() { return startTime; }
    @JsonProperty("start_time")
    @JsonAlias({"startTime", "start_time"})
    public void setStartTime(String startTime) { if (startTime != null) this.startTime = startTime; }

    @JsonProperty("end_time")
    public String getEndTime() { return endTime; }
    @JsonProperty("end_time")
    @JsonAlias({"endTime", "end_time"})
    public void setEndTime(String endTime) { if (endTime != null) this.endTime = endTime; }

    @JsonProperty("max_capacity")
    public Integer getMaxCapacity() { return maxCapacity; }
    @JsonProperty("max_capacity")
    @JsonAlias({"maxCapacity", "max_capacity"})
    public void setMaxCapacity(Integer maxCapacity) { if (maxCapacity != null) this.maxCapacity = maxCapacity; }

    @JsonProperty("remaining_seats")
    public Integer getRemainingSeats() { return remainingSeats; }
    @JsonProperty("remaining_seats")
    @JsonAlias({"remainingSeats", "remaining_seats"})
    public void setRemainingSeats(Integer remainingSeats) { if (remainingSeats != null) this.remainingSeats = remainingSeats; }

    @JsonProperty("ticket_price")
    public Double getTicketPrice() { return ticketPrice; }
    @JsonProperty("ticket_price")
    @JsonAlias({"ticketPrice", "ticket_price"})
    public void setTicketPrice(Double ticketPrice) { if (ticketPrice != null) this.ticketPrice = ticketPrice; }

    @JsonProperty("banner_image")
    public String getBannerImage() { return bannerImage; }
    @JsonProperty("banner_image")
    @JsonAlias({"bannerImage", "banner_image"})
    public void setBannerImage(String bannerImage) { if (bannerImage != null) this.bannerImage = bannerImage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
