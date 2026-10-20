package com.pawpulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id", nullable = false)
    private Vet vet;

    @Column(nullable = false)
    private String medication;

    private String dosage;

    private Integer durationDays;

    @Column(nullable = false)
    @Builder.Default
    private Boolean uploaded = false;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime prescribedAt = LocalDateTime.now();

    private LocalDateTime uploadedAt;
}
