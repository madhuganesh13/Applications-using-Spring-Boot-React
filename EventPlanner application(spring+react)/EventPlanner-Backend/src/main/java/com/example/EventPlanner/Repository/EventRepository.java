package com.example.EventPlanner.Repository;

import com.example.EventPlanner.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDateBetween(LocalDate start, LocalDate end);
}
