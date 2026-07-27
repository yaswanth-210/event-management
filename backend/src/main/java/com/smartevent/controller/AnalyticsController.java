package com.smartevent.controller;

import com.smartevent.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }

    @GetMapping("/predictions/{eventId}")
    public ResponseEntity<Map<String, Object>> getPredictions(@PathVariable Long eventId) {
        return ResponseEntity.ok(analyticsService.getPredictions(eventId));
    }

    @GetMapping("/chart-data/{eventId}")
    public ResponseEntity<Map<String, Object>> getChartData(@PathVariable Long eventId) {
        return ResponseEntity.ok(analyticsService.getChartData(eventId));
    }
}
