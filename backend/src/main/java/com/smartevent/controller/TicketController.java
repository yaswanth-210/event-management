package com.smartevent.controller;

import com.smartevent.dto.TicketDTO;
import com.smartevent.model.User;
import com.smartevent.repository.UserRepository;
import com.smartevent.service.AuthService;
import com.smartevent.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TicketController(TicketService ticketService,
                            AuthService authService,
                            UserRepository userRepository,
                            PasswordEncoder passwordEncoder) {
        this.ticketService = ticketService;
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<TicketDTO> registerTicket(@RequestBody Map<String, Object> body, Authentication authentication) {
        if (!body.containsKey("event_id") || body.get("event_id") == null) {
            throw new RuntimeException("Event ID is required");
        }
        Long eventId = Long.valueOf(body.get("event_id").toString());
        Long userId = null;

        if (body.containsKey("user_id") && body.get("user_id") != null) {
            userId = Long.valueOf(body.get("user_id").toString());
        } else if (authentication != null && authentication.getName() != null && !authentication.getName().equals("anonymousUser")) {
            userId = authService.getUserByEmail(authentication.getName()).getId();
        } else if (body.containsKey("email") && body.get("email") != null && !body.get("email").toString().isBlank()) {
            String email = body.get("email").toString().trim();
            String name = body.containsKey("name") && body.get("name") != null ? body.get("name").toString().trim() : "Visitor";
            String phone = body.containsKey("phone") && body.get("phone") != null ? body.get("phone").toString().trim() : "";

            userId = userRepository.findByEmail(email)
                    .map(User::getId)
                    .orElseGet(() -> {
                        User u = new User();
                        u.setName(name);
                        u.setEmail(email);
                        u.setPasswordHash(passwordEncoder.encode("visitor123"));
                        u.setPhone(phone);
                        u.setRole("visitor");
                        return userRepository.save(u).getId();
                    });
        } else {
            throw new RuntimeException("Please provide your email address to register for this event.");
        }

        return ResponseEntity.ok(ticketService.registerTicket(userId, eventId));
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<List<TicketDTO>> getMyTickets(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        Long userId = authService.getUserByEmail(authentication.getName()).getId();
        return ResponseEntity.ok(ticketService.getTicketsByUser(userId));
    }

    @GetMapping("/{code}")
    public ResponseEntity<TicketDTO> getTicketByCode(@PathVariable String code) {
        return ResponseEntity.ok(ticketService.getTicketByCode(code));
    }
}
