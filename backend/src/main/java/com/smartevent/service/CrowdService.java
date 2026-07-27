package com.smartevent.service;

import com.smartevent.model.Alert;
import com.smartevent.model.CrowdLog;
import com.smartevent.model.Event;
import com.smartevent.repository.AlertRepository;
import com.smartevent.repository.CrowdLogRepository;
import com.smartevent.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CrowdService {

    private final CrowdLogRepository crowdLogRepository;
    private final AlertRepository alertRepository;
    private final EventRepository eventRepository;

    public CrowdService(CrowdLogRepository crowdLogRepository,
                        AlertRepository alertRepository,
                        EventRepository eventRepository) {
        this.crowdLogRepository = crowdLogRepository;
        this.alertRepository = alertRepository;
        this.eventRepository = eventRepository;
    }

    public List<Map<String, Object>> getLiveCrowdData(Long eventId) {
        List<CrowdLog> logs = crowdLogRepository.findByEventIdOrderByTimestampDesc(eventId);

        if (logs.isEmpty()) {
            // Generate real-time synthetic crowd metrics if empty
            Event event = eventRepository.findById(eventId).orElse(null);
            int maxCap = event != null ? event.getMaxCapacity() : 600;

            String[] locations = {"Entrance Gate", "Main Stage Arena", "Food & Beverage Plaza", "VIP Lounge", "North Exit"};
            List<Map<String, Object>> defaultData = new ArrayList<>();
            Random r = new Random();

            for (String loc : locations) {
                int current = r.nextInt(maxCap / 2) + (maxCap / 4);
                double pct = ((double) current / maxCap) * 100.0;

                Map<String, Object> item = new HashMap<>();
                item.put("event_id", eventId);
                item.put("location", loc);
                item.put("current_crowd", current);
                item.put("max_capacity", maxCap);
                item.put("occupancy_pct", Math.round(pct * 10.0) / 10.0);
                item.put("status", pct > 90.0 ? "Critical" : (pct > 75.0 ? "High" : "Normal"));
                defaultData.add(item);
            }
            return defaultData;
        }

        return logs.stream().map(l -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", l.getId());
            item.put("event_id", l.getEvent().getId());
            item.put("location", l.getLocation());
            item.put("current_crowd", l.getCurrentCrowd());
            item.put("max_capacity", l.getMaxCapacity());
            item.put("occupancy_pct", Math.round(l.getOccupancyPct() * 10.0) / 10.0);
            item.put("timestamp", l.getTimestamp().toString());
            return item;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getActiveAlerts() {
        List<Alert> alerts = alertRepository.findAll();
        if (alerts.isEmpty()) {
            List<Map<String, Object>> mockAlerts = new ArrayList<>();
            Map<String, Object> a1 = new HashMap<>();
            a1.put("id", 1);
            a1.put("location", "Main Stage Arena");
            a1.put("severity", "Warning");
            a1.put("message", "High density alert: Occupancy exceeded 85% near front stage barrier");
            a1.put("status", "Active");
            a1.put("timestamp", new Date().toString());
            mockAlerts.add(a1);

            Map<String, Object> a2 = new HashMap<>();
            a2.put("id", 2);
            a2.put("location", "Entrance Gate A");
            a2.put("severity", "Info");
            a2.put("message", "Flow rate normal: 42 check-ins per minute");
            a2.put("status", "Active");
            a2.put("timestamp", new Date().toString());
            mockAlerts.add(a2);

            return mockAlerts;
        }

        return alerts.stream().map(a -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", a.getId());
            item.put("event_id", a.getEvent() != null ? a.getEvent().getId() : null);
            item.put("location", a.getLocation());
            item.put("severity", a.getSeverity());
            item.put("message", a.getMessage());
            item.put("status", a.getStatus());
            item.put("timestamp", a.getTimestamp().toString());
            return item;
        }).collect(Collectors.toList());
    }
}
