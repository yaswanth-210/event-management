package com.smartevent.repository;

import com.smartevent.model.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    Optional<Prediction> findTopByEventIdOrderByTimestampDesc(Long eventId);
}
