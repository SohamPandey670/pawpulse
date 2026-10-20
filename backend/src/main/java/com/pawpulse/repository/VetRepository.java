package com.pawpulse.repository;

import com.pawpulse.entity.Vet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VetRepository extends JpaRepository<Vet, UUID> {
    Optional<Vet> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Vet> findByClinicId(UUID clinicId);

    @Query("SELECT v.name, v.specialization, v.rating, COUNT(a), v.clinic.name " +
           "FROM Vet v LEFT JOIN Appointment a ON a.vet = v AND a.status = 'completed' " +
           "GROUP BY v.id, v.name, v.specialization, v.rating, v.clinic.name " +
           "ORDER BY COUNT(a) DESC")
    List<Object[]> findTopPerformingVets();
}
