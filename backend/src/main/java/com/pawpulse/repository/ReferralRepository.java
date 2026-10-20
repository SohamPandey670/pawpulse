package com.pawpulse.repository;

import com.pawpulse.entity.Referral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReferralRepository extends JpaRepository<Referral, UUID> {

    // Average referral TAT in hours
    @Query("SELECT AVG(FUNCTION('TIMESTAMPDIFF', SECOND, r.referredAt, r.acceptedAt)) / 3600.0 " +
           "FROM Referral r WHERE r.acceptedAt IS NOT NULL AND r.referredAt >= :since")
    Double avgTatHoursSince(@Param("since") LocalDateTime since);

    // Referral TAT by clinic
    @Query("SELECT c.name, AVG(FUNCTION('TIMESTAMPDIFF', SECOND, r.referredAt, r.acceptedAt)) / 3600.0 " +
           "FROM Referral r JOIN r.toClinic c " +
           "WHERE r.acceptedAt IS NOT NULL AND r.referredAt >= :since " +
           "GROUP BY c.name ORDER BY c.name")
    List<Object[]> tatByClinic(@Param("since") LocalDateTime since);

    List<Referral> findByStatus(String status);
}
