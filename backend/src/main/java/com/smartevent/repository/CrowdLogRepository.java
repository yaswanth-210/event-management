package com.smartevent.repository;

import com.smartevent.model.CrowdLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CrowdLogRepository extends JpaRepository<CrowdLog, Long> {
    List<CrowdLog> findByEventIdOrderByTimestampDesc(Long eventId);
}
