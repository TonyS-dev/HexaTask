package com.acnexus.projectmanagement.application.usecase;

import com.acnexus.projectmanagement.application.dto.AuthResponse;
import com.acnexus.projectmanagement.application.dto.RegisterRequest;
import com.acnexus.projectmanagement.domain.exception.DomainException;
import com.acnexus.projectmanagement.domain.model.Role;
import com.acnexus.projectmanagement.domain.model.User;
import com.acnexus.projectmanagement.domain.ports.out.UserRepositoryPort;
import com.acnexus.projectmanagement.infrastructure.security.TokenProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.UUID;

@Service
public class RegisterUserUseCase {

    private final UserRepositoryPort userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;

    public RegisterUserUseCase(UserRepositoryPort userRepository, PasswordEncoder passwordEncoder,
            TokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse execute(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DomainException("Email already in use") {
            };
        }

        User user = new User(
                UUID.randomUUID(),
                request.email(),
                passwordEncoder.encode(request.password()),
                request.fullName(),
                Role.ROLE_MEMBER, // Default role
                true,
                OffsetDateTime.now(),
                OffsetDateTime.now(),
                null);

        User savedUser = userRepository.save(user);

        // Auto-login logic (generate tokens)
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                savedUser.getEmail(),
                savedUser.getId(),
                Collections.singletonList(new SimpleGrantedAuthority(savedUser.getRole().name())));

        String accessToken = tokenProvider.createAccessToken(savedUser.getEmail(), savedUser.getId(),
                auth.getAuthorities());
        String refreshToken = tokenProvider.createRefreshToken(savedUser.getEmail(), savedUser.getId(),
                auth.getAuthorities());

        // TODO: Persist Refresh Token in DB via RefreshTokenService (needed for
        // Rotation logic)

        return new AuthResponse(accessToken, refreshToken, "Bearer", 900L); // 900s = 15m
    }
}
