package com.smartevent.controller;

import com.smartevent.service.CrowdService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crowd")
public class CrowdController {

    private final CrowdService crowdService;

    public CrowdController(CrowdService crowdService) {
        this.crowdService = crowdService;
    }

    @GetMapping("/live/{eventId}")
    public ResponseEntity<List<Map<String, Object>>> getLiveCrowdData(@PathVariable Long eventId) {
        return ResponseEntity.ok(crowdService.getLiveCrowdData(eventId));
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<Map<String, Object>>> getAlerts() {
        return ResponseEntity.ok(crowdService.getActiveAlerts());
    }
}
