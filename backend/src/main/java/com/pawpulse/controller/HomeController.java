package com.pawpulse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        return ResponseEntity.ok(Map.of(
                "service", "PawPulse Pet Healthcare API",
                "status", "UP",
                "version", "1.0.0",
                "message", "Spring Boot backend is live and operational!",
                "endpoints", Map.of(
                        "health", "/api/auth/health",
                        "login", "/api/auth/login",
                        "dashboard", "/api/dashboard/kpi"
                )
        ));
    }
}
