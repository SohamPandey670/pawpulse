package com.pawpulse.controller;

import com.pawpulse.entity.Appointment;
import com.pawpulse.repository.AppointmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;

    public AppointmentController(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAll() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @GetMapping("/vet/{vetId}")
    public ResponseEntity<List<Appointment>> getByVet(@PathVariable UUID vetId) {
        return ResponseEntity.ok(appointmentRepository.findByVetId(vetId));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Appointment>> getByOwner(@PathVariable UUID ownerId) {
        return ResponseEntity.ok(appointmentRepository.findByPetOwnerId(ownerId));
    }

    @PostMapping
    public ResponseEntity<Appointment> create(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable UUID id, @RequestParam String status) {
        return appointmentRepository.findById(id)
                .map(appt -> {
                    appt.setStatus(status);
                    if ("completed".equals(status)) {
                        appt.setCompletedAt(java.time.LocalDateTime.now());
                    }
                    return ResponseEntity.ok(appointmentRepository.save(appt));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
