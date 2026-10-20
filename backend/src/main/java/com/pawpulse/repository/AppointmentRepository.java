package com.pawpulse.repository;

import com.pawpulse.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByVetId(UUID vetId);
    List<Appointment> findByPetOwnerId(UUID ownerId);

    // Consultations count in date range
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = 'completed' AND a.completedAt >= :since")
    Long countCompletedSince(@Param("since") LocalDateTime since);

    // No-show count
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = 'no_show' AND a.scheduledAt >= :since")
    Long countNoShowSince(@Param("since") LocalDateTime since);

    // Total booked
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.scheduledAt >= :since")
    Long countBookedSince(@Param("since") LocalDateTime since);

    // Daily consultations
    @Query("SELECT CAST(a.completedAt AS date), COUNT(a) FROM Appointment a " +
           "WHERE a.status = 'completed' AND a.completedAt >= :since " +
           "GROUP BY CAST(a.completedAt AS date) ORDER BY CAST(a.completedAt AS date)")
    List<Object[]> dailyConsultsSince(@Param("since") LocalDateTime since);

    // By service type
    @Query("SELECT a.serviceType, COUNT(a) FROM Appointment a WHERE a.status = 'completed' AND a.completedAt >= :since " +
           "GROUP BY a.serviceType ORDER BY COUNT(a) DESC")
    List<Object[]> countByServiceType(@Param("since") LocalDateTime since);

    // Best performing clinics
    @Query("SELECT c.name, COUNT(a), COALESCE(SUM(p.amount), 0) " +
           "FROM Appointment a JOIN a.clinic c LEFT JOIN Payment p ON p.appointment = a AND p.status = 'completed' " +
           "WHERE a.status = 'completed' AND a.completedAt >= :since " +
           "GROUP BY c.name ORDER BY COUNT(a) DESC")
    List<Object[]> bestPerformingClinics(@Param("since") LocalDateTime since);
}
