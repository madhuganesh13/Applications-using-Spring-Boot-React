package com.example.student_management.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class CorsConfig {

text
// Comma-separated list; supports wildcard patterns when using setAllowedOriginPatterns
@Value("${app.cors.allowed-origin-patterns}")
private String allowedOriginPatterns;

@Bean
public CorsFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();

    // Allow cookies/credentials if you need them; if not, set to false
    config.setAllowCredentials(true);

    // Use patterns so wildcard subdomains like *.vercel.app are accepted
    List<String> patterns = Arrays.stream(allowedOriginPatterns.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .collect(Collectors.toList());
    config.setAllowedOriginPatterns(patterns);

    // Allow typical headers and methods
    config.setAllowedHeaders(List.of("*"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

    // Optionally expose headers if your frontend needs to read them
    // config.setExposedHeaders(List.of("Location"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    // Apply to all endpoints
    source.registerCorsConfiguration("/**", config);
    return new CorsFilter(source);
}
}
