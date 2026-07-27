package com.smartevent.service;

import com.smartevent.model.Attendance;
import com.smartevent.model.Ticket;
import com.smartevent.repository.AttendanceRepository;
import com.smartevent.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScannerService {

    private final TicketRepository ticketRepository;
    private final AttendanceRepository attendanceRepository;

    public ScannerService(TicketRepository ticketRepository, AttendanceRepository attendanceRepository) {
        this.ticketRepository = ticketRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @Transactional
    public Map<String, Object> processScan(String qrContent, String gateNumber) {
        Map<String, Object> response = new HashMap<>();

        // Extract ticket code from payload or raw string
        String ticketCode = qrContent;
        if (qrContent.contains("TICKET:")) {
            String[] parts = qrContent.split("\\|");
            for (String part : parts) {
                if (part.startsWith("TICKET:")) {
                    ticketCode = part.replace("TICKET:", "");
                }
            }
        }

        Optional<Ticket> ticketOpt = ticketRepository.findByTicketCode(ticketCode);
        if (ticketOpt.isEmpty()) {
            response.put("valid", false);
            response.put("access", false);
            response.put("message", "INVALID TICKET CODE: Ticket does not exist");
            return response;
        }

        Ticket ticket = ticketOpt.get();

        if ("Used".equalsIgnoreCase(ticket.getStatus())) {
            response.put("valid", false);
            response.put("access", false);
            response.put("result", "TICKET_ALREADY_USED");
            response.put("message", "TICKET ALREADY USED: Access Denied");
            response.put("ticket_code", ticket.getTicketCode());
            response.put("ticket_id", ticket.getTicketCode());
            response.put("attendee_name", ticket.getUser() != null ? ticket.getUser().getName() : "Unknown");
            response.put("visitor_name", ticket.getUser() != null ? ticket.getUser().getName() : "Unknown");
            return response;
        }

        if ("Cancelled".equalsIgnoreCase(ticket.getStatus())) {
            response.put("valid", false);
            response.put("access", false);
            response.put("message", "TICKET CANCELLED: Access Denied");
            return response;
        }

        // Mark ticket as Used
        ticket.setStatus("Used");
        ticketRepository.save(ticket);

        // Record Attendance
        Attendance attendance = new Attendance();
        attendance.setTicket(ticket);
        attendance.setEvent(ticket.getEvent());
        attendance.setUser(ticket.getUser());
        attendance.setGateNumber(gateNumber != null ? gateNumber : "Gate 1");
        attendance.setStatus("Present");
        Attendance savedAttendance = attendanceRepository.save(attendance);

        response.put("valid", true);
        response.put("access", true);
        response.put("message", "ACCESS GRANTED: Ticket Validated Successfully!");
        response.put("ticket_code", ticket.getTicketCode());
        response.put("ticket_id", ticket.getTicketCode());
        response.put("attendee_name", ticket.getUser() != null ? ticket.getUser().getName() : "Guest");
        response.put("visitor_name", ticket.getUser() != null ? ticket.getUser().getName() : "Guest");
        response.put("event_name", ticket.getEvent() != null ? ticket.getEvent().getName() : "Event");
        response.put("gate_number", savedAttendance.getGateNumber());
        response.put("entry_time", savedAttendance.getEntryTime() != null ? savedAttendance.getEntryTime().toString() : "Now");

        return response;
    }

    public List<Map<String, Object>> getScanLogs() {
        return attendanceRepository.findAll().stream().map(a -> {
            Map<String, Object> log = new HashMap<>();
            log.put("id", a.getId());
            log.put("ticket_code", a.getTicket() != null ? a.getTicket().getTicketCode() : "");
            log.put("event_name", a.getEvent() != null ? a.getEvent().getName() : "");
            log.put("user_name", a.getUser() != null ? a.getUser().getName() : "");
            log.put("entry_time", a.getEntryTime() != null ? a.getEntryTime().toString() : "");
            log.put("gate_number", a.getGateNumber());
            log.put("status", a.getStatus());
            return log;
        }).collect(Collectors.toList());
    }
}
