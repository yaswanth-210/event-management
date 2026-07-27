package com.smartevent.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private Integer predictedCrowd;

    @Column(nullable = false, length = 50)
    private String predictedPeakTime;

    @Column(nullable = false)
    private Integer predictedWaitingTimeMin;

    @Column(nullable = false)
    private Double predictedOccupancyPct;

    private LocalDateTime timestamp = LocalDateTime.now();

    public Prediction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public Integer getPredictedCrowd() { return predictedCrowd; }
    public void setPredictedCrowd(Integer predictedCrowd) { this.predictedCrowd = predictedCrowd; }

    public String getPredictedPeakTime() { return predictedPeakTime; }
    public void setPredictedPeakTime(String predictedPeakTime) { this.predictedPeakTime = predictedPeakTime; }

    public Integer getPredictedWaitingTimeMin() { return predictedWaitingTimeMin; }
    public void setPredictedWaitingTimeMin(Integer predictedWaitingTimeMin) { this.predictedWaitingTimeMin = predictedWaitingTimeMin; }

    public Double getPredictedOccupancyPct() { return predictedOccupancyPct; }
    public void setPredictedOccupancyPct(Double predictedOccupancyPct) { this.predictedOccupancyPct = predictedOccupancyPct; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
