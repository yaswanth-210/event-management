package com.smartevent.repository;

import com.smartevent.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByEventId(Long eventId);
    List<Alert> findByStatus(String status);
}
