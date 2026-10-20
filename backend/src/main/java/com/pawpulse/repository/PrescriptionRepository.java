package com.pawpulse.repository;

import com.pawpulse.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {

    // Rx compliance: uploaded / total
    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.uploaded = true AND p.prescribedAt >= :since")
    Long countUploadedSince(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.prescribedAt >= :since")
    Long countTotalSince(@Param("since") LocalDateTime since);

    List<Prescription> findByAppointmentId(UUID appointmentId);
}
