package com.hexatask.hexatask.application.usecase.auth;

import com.hexatask.hexatask.application.dto.auth.AuthResponse;
import com.hexatask.hexatask.domain.exception.DomainException;
import com.hexatask.hexatask.domain.model.RefreshToken;
import com.hexatask.hexatask.domain.model.User;
import com.hexatask.hexatask.domain.ports.in.auth.RefreshTokenPort;
import com.hexatask.hexatask.domain.ports.out.RefreshTokenRepositoryPort;
import com.hexatask.hexatask.infrastructure.security.TokenProvider;
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

        String newAccessToken = tokenProvider.createAccessToken(user.getEmail(), user.getId(), user.getFullName(), authorities);
        String newRefreshToken = tokenProvider.createRefreshToken(user.getEmail(), user.getId(), user.getFullName(), authorities);

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
