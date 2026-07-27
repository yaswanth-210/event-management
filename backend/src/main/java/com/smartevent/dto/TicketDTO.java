package com.smartevent.dto;

import com.smartevent.model.Ticket;

public class TicketDTO {
    private Long id;
    private String ticket_code;
    private Long user_id;
    private String user_name;
    private String user_email;
    private String user_phone;
    private Long event_id;
    private String event_name;
    private String event_date;
    private String event_venue;
    private Long registration_id;
    private String qr_image_path;
    private String status;
    private String created_at;

    public static TicketDTO fromEntity(Ticket t) {
        TicketDTO dto = new TicketDTO();
        dto.id = t.getId();
        dto.ticket_code = t.getTicketCode();
        dto.user_id = t.getUser() != null ? t.getUser().getId() : null;
        dto.user_name = t.getUser() != null ? t.getUser().getName() : "";
        dto.user_email = t.getUser() != null ? t.getUser().getEmail() : "";
        dto.user_phone = t.getUser() != null ? t.getUser().getPhone() : "";
        dto.event_id = t.getEvent() != null ? t.getEvent().getId() : null;
        dto.event_name = t.getEvent() != null ? t.getEvent().getName() : "";
        dto.event_date = t.getEvent() != null ? t.getEvent().getDate() : "";
        dto.event_venue = t.getEvent() != null ? t.getEvent().getVenue() : "";
        dto.registration_id = t.getRegistration() != null ? t.getRegistration().getId() : null;
        dto.qr_image_path = t.getQrImagePath();
        dto.status = t.getStatus();
        dto.created_at = t.getCreatedAt() != null ? t.getCreatedAt().toString() : null;
        return dto;
    }

    public Long getId() { return id; }
    public String getTicket_code() { return ticket_code; }
    public Long getUser_id() { return user_id; }
    public String getUser_name() { return user_name; }
    public String getUser_email() { return user_email; }
    public String getUser_phone() { return user_phone; }
    public Long getEvent_id() { return event_id; }
    public String getEvent_name() { return event_name; }
    public String getEvent_date() { return event_date; }
    public String getEvent_venue() { return event_venue; }
    public Long getRegistration_id() { return registration_id; }
    public String getQr_image_path() { return qr_image_path; }
    public String getStatus() { return status; }
    public String getCreated_at() { return created_at; }
}
