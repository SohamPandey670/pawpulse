package com.pawpulse.repository;

import com.pawpulse.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PetRepository extends JpaRepository<Pet, UUID> {
    List<Pet> findByOwnerId(UUID ownerId);

    @Query("SELECT p.species, COUNT(p) FROM Pet p GROUP BY p.species ORDER BY COUNT(p) DESC")
    List<Object[]> countBySpecies();
}
