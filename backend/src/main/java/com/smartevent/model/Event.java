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
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category = "General";

    @Column(nullable = false, length = 150)
    private String venue;

    @Column(nullable = false, length = 20)
    private String date;

    @JsonProperty("start_time")
    @JsonAlias({"startTime", "start_time"})
    @Column(nullable = false, length = 20)
    private String startTime;

    @JsonProperty("end_time")
    @JsonAlias({"endTime", "end_time"})
    @Column(nullable = false, length = 20)
    private String endTime;

    @JsonProperty("max_capacity")
    @JsonAlias({"maxCapacity", "max_capacity"})
    @Column(nullable = false)
    private Integer maxCapacity = 500;

    @JsonProperty("remaining_seats")
    @JsonAlias({"remainingSeats", "remaining_seats"})
    @Column(nullable = false)
    private Integer remainingSeats = 500;

    @JsonProperty("ticket_price")
    @JsonAlias({"ticketPrice", "ticket_price"})
    @Column(nullable = false)
    private Double ticketPrice = 0.0;

    @JsonProperty("banner_image")
    @JsonAlias({"bannerImage", "banner_image"})
    @Column(length = 256)
    private String bannerImage;

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

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }

    public Integer getRemainingSeats() { return remainingSeats; }
    public void setRemainingSeats(Integer remainingSeats) { this.remainingSeats = remainingSeats; }

    public Double getTicketPrice() { return ticketPrice; }
    public void setTicketPrice(Double ticketPrice) { this.ticketPrice = ticketPrice; }

    public String getBannerImage() { return bannerImage; }
    public void setBannerImage(String bannerImage) { this.bannerImage = bannerImage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
