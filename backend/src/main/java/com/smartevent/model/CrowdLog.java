package com.smartevent.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crowd_logs")
public class CrowdLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false, length = 50)
    private String location; // Entrance, Main Stage, Food Court, Parking, Exit Gate

    @Column(nullable = false)
    private Integer currentCrowd = 0;

    @Column(nullable = false)
    private Integer maxCapacity = 500;

    @Column(nullable = false)
    private Double occupancyPct = 0.0;

    private LocalDateTime timestamp = LocalDateTime.now();

    public CrowdLog() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getCurrentCrowd() { return currentCrowd; }
    public void setCurrentCrowd(Integer currentCrowd) { this.currentCrowd = currentCrowd; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }

    public Double getOccupancyPct() { return occupancyPct; }
    public void setOccupancyPct(Double occupancyPct) { this.occupancyPct = occupancyPct; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
