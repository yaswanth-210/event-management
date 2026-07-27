package com.smartevent.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> root() {
        Map<String, String> res = new HashMap<>();
        res.put("status", "UP");
        res.put("service", "Smart Event Management API Server");
        res.put("version", "1.0.0");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> res = new HashMap<>();
        res.put("status", "UP");
        return ResponseEntity.ok(res);
    }
}
