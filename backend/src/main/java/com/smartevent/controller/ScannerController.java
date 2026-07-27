package com.smartevent.controller;

import com.smartevent.service.ScannerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scanner")
public class ScannerController {

    private final ScannerService scannerService;

    public ScannerController(ScannerService scannerService) {
        this.scannerService = scannerService;
    }

    @PostMapping("/scan")
    public ResponseEntity<Map<String, Object>> scanTicket(@RequestBody Map<String, String> body) {
        String qrContent = body.get("qr_content");
        String gateNumber = body.getOrDefault("gate_number", "Gate 1");
        return ResponseEntity.ok(scannerService.processScan(qrContent, gateNumber));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<Map<String, Object>>> getLogs() {
        return ResponseEntity.ok(scannerService.getScanLogs());
    }
}
