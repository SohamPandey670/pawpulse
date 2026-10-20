package com.pawpulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "referrals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_vet_id", nullable = false)
    private Vet fromVet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_vet_id")
    private Vet toVet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_clinic_id")
    private Clinic toClinic;

    @Column(nullable = false)
    @Builder.Default
    private String status = "referred"; // referred, accepted, completed

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime referredAt = LocalDateTime.now();

    private LocalDateTime acceptedAt;

    private LocalDateTime completedAt;

    @Column(columnDefinition = "TEXT")
    private String reason;
}
