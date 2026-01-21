package com.acnexus.projectmanagement.application.usecase;

import com.acnexus.projectmanagement.application.dto.AuthResponse;
import com.acnexus.projectmanagement.application.dto.RefreshTokenRequest;
import com.acnexus.projectmanagement.domain.exception.DomainException;
import com.acnexus.projectmanagement.domain.model.RefreshToken;
import com.acnexus.projectmanagement.domain.model.User;
import com.acnexus.projectmanagement.domain.ports.out.RefreshTokenRepositoryPort;
import com.acnexus.projectmanagement.infrastructure.security.TokenProvider;
import org.springframework.stereotype.Service;

@Service
public class RefreshTokenUseCase {

    private final RefreshTokenRepositoryPort refreshTokenRepository;
    private final TokenProvider tokenProvider;

    public RefreshTokenUseCase(RefreshTokenRepositoryPort refreshTokenRepository, TokenProvider tokenProvider) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.tokenProvider = tokenProvider;
    }

    @org.springframework.transaction.annotation.Transactional
    public AuthResponse execute(RefreshTokenRequest request) {
        // 1. Validate format/signature
        if (!tokenProvider.validateToken(request.refreshToken())) {
            throw new DomainException("Invalid Refresh Token Signature") {
            };
        }

        // 2. Find in DB
        RefreshToken storedToken = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new DomainException("Refresh Token not found in database") {
                });

        // 3. Check Expiry
        if (storedToken.getExpiryDate().isBefore(java.time.Instant.now())) {
            refreshTokenRepository.deleteByUser(storedToken.getUser());
            throw new DomainException("Refresh Token expired") {
            };
        }

        // 4. Rotation
        User user = storedToken.getUser();

        // Revoke all tokens for user (Strict Rotation)
        refreshTokenRepository.deleteByUser(user);

        // Create new authorities
        java.util.List<org.springframework.security.core.authority.SimpleGrantedAuthority> authorities = java.util.Collections
                .singletonList(
                        new org.springframework.security.core.authority.SimpleGrantedAuthority(user.getRole().name()));

        // Generate new tokens
        String newAccessToken = tokenProvider.createAccessToken(user.getEmail(), user.getId(), authorities);
        String newRefreshToken = tokenProvider.createRefreshToken(user.getEmail(), user.getId(), authorities);

        // Save new Refresh Token
        RefreshToken newTokenModel = new RefreshToken(
                null,
                user,
                newRefreshToken,
                java.time.Instant.now().plusMillis(86400000) // 24 hours (hardcoded matches TokenProvider default)
        // Ideally inject validity from properties, but strictly speaking use cases
        // shouldn't depend on @Value directly easily.
        // For now hardcode or we could expose getRefreshTokenValidity from
        // TokenProvider.
        );
        refreshTokenRepository.save(newTokenModel);

        return new AuthResponse(newAccessToken, newRefreshToken, "Bearer", 900L);
    }
}
