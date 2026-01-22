package com.acnexus.projectmanagement.application.usecase.auth;

import com.acnexus.projectmanagement.application.dto.auth.AuthResponse;
import com.acnexus.projectmanagement.domain.exception.DomainException;
import com.acnexus.projectmanagement.domain.model.RefreshToken;
import com.acnexus.projectmanagement.domain.model.User;
import com.acnexus.projectmanagement.domain.ports.in.auth.RefreshTokenPort;
import com.acnexus.projectmanagement.domain.ports.out.RefreshTokenRepositoryPort;
import com.acnexus.projectmanagement.infrastructure.security.TokenProvider;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

@Service
public class RefreshTokenUseCaseImpl implements RefreshTokenPort {

    private final RefreshTokenRepositoryPort refreshTokenRepository;
    private final TokenProvider tokenProvider;

    public RefreshTokenUseCaseImpl(RefreshTokenRepositoryPort refreshTokenRepository, TokenProvider tokenProvider) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.tokenProvider = tokenProvider;
    }

    @Override
    @Transactional
    public AuthResponse execute(String refreshTokenString) {
        if (!tokenProvider.validateToken(refreshTokenString)) {
            throw new DomainException("Invalid Refresh Token Signature") {
            };
        }

        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshTokenString)
                .orElseThrow(() -> new DomainException("Refresh Token not found in database") {
                });

        if (storedToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.deleteByUser(storedToken.getUser());
            throw new DomainException("Refresh Token expired") {
            };
        }

        User user = storedToken.getUser();
        refreshTokenRepository.deleteByUser(user);

        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(user.getRole().name()));

        String newAccessToken = tokenProvider.createAccessToken(user.getEmail(), user.getId(), authorities);
        String newRefreshToken = tokenProvider.createRefreshToken(user.getEmail(), user.getId(), authorities);

        RefreshToken newTokenModel = new RefreshToken(
                null,
                user,
                newRefreshToken,
                Instant.now().plusMillis(tokenProvider.getRefreshTokenValidityInMilliseconds())
        );
        refreshTokenRepository.save(newTokenModel);

        return new AuthResponse(newAccessToken, newRefreshToken, "Bearer", 900L);
    }
}
