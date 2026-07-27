package com.smartevent.service;

import com.smartevent.dto.TicketDTO;
import com.smartevent.model.Event;
import com.smartevent.model.Registration;
import com.smartevent.model.Ticket;
import com.smartevent.model.User;
import com.smartevent.repository.EventRepository;
import com.smartevent.repository.RegistrationRepository;
import com.smartevent.repository.TicketRepository;
import com.smartevent.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final QrCodeService qrCodeService;

    public TicketService(TicketRepository ticketRepository,
                         UserRepository userRepository,
                         EventRepository eventRepository,
                         RegistrationRepository registrationRepository,
                         QrCodeService qrCodeService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.qrCodeService = qrCodeService;
    }

    @Transactional
    public TicketDTO registerTicket(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (registrationRepository.existsByUserIdAndEventId(userId, eventId)) {
            Optional<Ticket> existingTicket = ticketRepository.findByUserIdAndEventId(userId, eventId);
            if (existingTicket.isPresent()) {
                return TicketDTO.fromEntity(existingTicket.get());
            }
        }

        if (event.getRemainingSeats() <= 0) {
            throw new RuntimeException("Event is sold out");
        }

        Registration registration = new Registration(user, event, event.getTicketPrice());
        Registration savedReg = registrationRepository.save(registration);

        // Decrease remaining seats
        event.setRemainingSeats(event.getRemainingSeats() - 1);
        eventRepository.save(event);

        String ticketCode = "TICK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String qrPath = qrCodeService.generateQrCode(ticketCode, user.getId(), event.getId());

        Ticket ticket = new Ticket();
        ticket.setTicketCode(ticketCode);
        ticket.setUser(user);
        ticket.setEvent(event);
        ticket.setRegistration(savedReg);
        ticket.setQrImagePath(qrPath);
        ticket.setStatus("Valid");

        Ticket savedTicket = ticketRepository.save(ticket);
        return TicketDTO.fromEntity(savedTicket);
    }

    public List<TicketDTO> getTicketsByUser(Long userId) {
        return ticketRepository.findByUserId(userId).stream()
                .map(TicketDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public TicketDTO getTicketByCode(String ticketCode) {
        Ticket ticket = ticketRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Ticket not found with code: " + ticketCode));
        return TicketDTO.fromEntity(ticket);
    }
}
