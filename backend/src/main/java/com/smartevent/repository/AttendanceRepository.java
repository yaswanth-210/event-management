package com.smartevent.repository;

import com.smartevent.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEventId(Long eventId);
    List<Attendance> findByUserId(Long userId);
    long countByEventId(Long eventId);
}
