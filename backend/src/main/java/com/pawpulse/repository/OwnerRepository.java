package com.pawpulse.repository;

import com.pawpulse.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, UUID> {
    Optional<Owner> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT o.city, COUNT(o) FROM Owner o GROUP BY o.city ORDER BY COUNT(o) DESC")
    List<Object[]> countByCity();
}
