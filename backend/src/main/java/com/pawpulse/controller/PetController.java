package com.pawpulse.controller;

import com.pawpulse.entity.Pet;
import com.pawpulse.repository.PetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*")
public class PetController {

    private final PetRepository petRepository;

    public PetController(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllPets() {
        List<Pet> pets = petRepository.findAll();
        List<Map<String, Object>> result = pets.stream().map(this::toMap).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPetById(@PathVariable UUID id) {
        return petRepository.findById(id)
                .map(this::toMap)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Map<String, Object>>> getPetsByOwner(@PathVariable UUID ownerId) {
        List<Pet> pets = petRepository.findByOwnerId(ownerId);
        List<Map<String, Object>> result = pets.stream().map(this::toMap).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    private Map<String, Object> toMap(Pet pet) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", pet.getId().toString());
        map.put("name", pet.getName());
        map.put("species", pet.getSpecies() != null ? pet.getSpecies().toLowerCase() : "dog");
        map.put("breed", pet.getBreed() != null ? pet.getBreed() : "Indie");
        map.put("dob", pet.getDob() != null ? pet.getDob().toString() : "2023-01-01");
        map.put("weightKg", pet.getWeightKg() != null ? pet.getWeightKg() : 10.0);
        if (pet.getOwner() != null) {
            try {
                map.put("ownerId", pet.getOwner().getId().toString());
                map.put("ownerName", pet.getOwner().getName());
            } catch (Exception ignored) {
                // In case of uninitialized lazy proxy
            }
        }
        return map;
    }
}
