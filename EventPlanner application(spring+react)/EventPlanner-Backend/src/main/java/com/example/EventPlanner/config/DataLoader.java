package com.example.EventPlanner.config;

import com.example.EventPlanner.model.Event;
import com.example.EventPlanner.Repository.EventRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner init(EventRepository repo) {
        return args -> {
            repo.save(new Event("Tech Meetup", "Bangalore", LocalDate.now().plusDays(7), "A meetup about Java & Spring"));
            repo.save(new Event("Startup Pitch", "Mumbai", LocalDate.now().plusDays(14), "Pitch your startup idea"));
            repo.save(new Event("Workshop: React", "Pune", LocalDate.now().plusDays(21), "Hands-on React workshop"));
        };
    }
}
