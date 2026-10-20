package com.pawpulse.service;

import com.pawpulse.config.JwtUtil;
import com.pawpulse.dto.AuthResponse;
import com.pawpulse.dto.LoginRequest;
import com.pawpulse.entity.Owner;
import com.pawpulse.entity.Vet;
import com.pawpulse.repository.OwnerRepository;
import com.pawpulse.repository.VetRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final OwnerRepository ownerRepository;
    private final VetRepository vetRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(OwnerRepository ownerRepository, VetRepository vetRepository,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.ownerRepository = ownerRepository;
        this.vetRepository = vetRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(LoginRequest request) {
        // Try owner login
        var owner = ownerRepository.findByEmail(request.getEmail());
        if (owner.isPresent()) {
            Owner o = owner.get();
            if (passwordEncoder.matches(request.getPassword(), o.getPasswordHash())) {
                String token = jwtUtil.generateToken(o.getEmail(), o.getRole(), o.getName());
                return AuthResponse.builder()
                        .token(token)
                        .role(o.getRole())
                        .name(o.getName())
                        .email(o.getEmail())
                        .build();
            }
        }

        // Try vet/admin/coordinator login
        var vet = vetRepository.findByEmail(request.getEmail());
        if (vet.isPresent()) {
            Vet v = vet.get();
            if (passwordEncoder.matches(request.getPassword(), v.getPasswordHash())) {
                String token = jwtUtil.generateToken(v.getEmail(), v.getRole(), v.getName());
                return AuthResponse.builder()
                        .token(token)
                        .role(v.getRole())
                        .name(v.getName())
                        .email(v.getEmail())
                        .build();
            }
        }

        throw new RuntimeException("Invalid email or password");
    }
}
