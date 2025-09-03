package com.example.EventPlanner.controller;

import com.example.EventPlanner.dto.EventRequest;
import com.example.EventPlanner.model.Event;
import com.example.EventPlanner.Repository.EventRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = {"http://localhost:3000", "https://applications-using-spring-boot-reac-pink.vercel.app"}) // allow React dev server
public class EventController {

    private final EventRepository repository;

    public EventController(EventRepository repository) {
        this.repository = repository;
    }

    // GET /api/events?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd
    @GetMapping
    public List<Event> getAllEvents(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (startDate != null && endDate != null) {
            return repository.findByDateBetween(startDate, endDate);
        }
        return repository.findAll();
    }

    // GET /api/events/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEvent(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/events
    @PostMapping
    public ResponseEntity<Event> createEvent(@Valid @RequestBody EventRequest req) {
        Event event = new Event(req.getTitle(), req.getLocation(), req.getDate(), req.getDescription());
        Event saved = repository.save(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT /api/events/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @Valid @RequestBody EventRequest req) {
        return repository.findById(id).map(ev -> {
            ev.setTitle(req.getTitle());
            ev.setLocation(req.getLocation());
            ev.setDate(req.getDate());
            ev.setDescription(req.getDescription());
            repository.save(ev);
            return ResponseEntity.ok(ev);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/events/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}








