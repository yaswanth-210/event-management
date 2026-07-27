package com.smartevent.repository;

import com.smartevent.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketCode(String ticketCode);
    List<Ticket> findByUserId(Long userId);
    List<Ticket> findByEventId(Long eventId);
    Optional<Ticket> findByUserIdAndEventId(Long userId, Long eventId);
}
