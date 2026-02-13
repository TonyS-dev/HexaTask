package com.hexatask.hexatask.application.usecase.auth;

import com.hexatask.hexatask.application.dto.auth.AuthResponse;
import com.hexatask.hexatask.application.dto.auth.RegisterRequest;
import com.hexatask.hexatask.domain.exception.DomainException;
import com.hexatask.hexatask.domain.model.RefreshToken;
import com.hexatask.hexatask.domain.model.Role;
import com.hexatask.hexatask.domain.model.User;
import com.hexatask.hexatask.domain.ports.in.auth.RegisterUserPort;
import com.hexatask.hexatask.domain.ports.out.RefreshTokenRepositoryPort;
import com.hexatask.hexatask.domain.ports.out.UserRepositoryPort;
import com.hexatask.hexatask.infrastructure.security.TokenProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.UUID;

@Service
public class RegisterUserUseCaseImpl implements RegisterUserPort {

    private final UserRepositoryPort userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepositoryPort refreshTokenRepository;

    public RegisterUserUseCaseImpl(UserRepositoryPort userRepository, PasswordEncoder passwordEncoder,
            TokenProvider tokenProvider, RefreshTokenRepositoryPort refreshTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Override
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
                Role.ROLE_MEMBER,
                true,
                OffsetDateTime.now(),
                OffsetDateTime.now(),
                null);

        User savedUser = userRepository.save(user);

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                savedUser.getEmail(),
                savedUser.getId(),
                Collections.singletonList(new SimpleGrantedAuthority(savedUser.getRole().name())));

        String accessToken = tokenProvider.createAccessToken(savedUser.getEmail(), savedUser.getId(),
                savedUser.getFullName(), auth.getAuthorities());
        String refreshToken = tokenProvider.createRefreshToken(savedUser.getEmail(), savedUser.getId(),
                savedUser.getFullName(), auth.getAuthorities());

        // Store refresh token in database
        RefreshToken refreshTokenModel = new RefreshToken(
                null,
                savedUser,
                refreshToken,
                Instant.now().plusMillis(tokenProvider.getRefreshTokenValidityInMilliseconds())
        );
        refreshTokenRepository.save(refreshTokenModel);

        return new AuthResponse(accessToken, refreshToken, "Bearer", 900L);
    }
}
