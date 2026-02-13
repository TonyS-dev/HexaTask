package com.hexatask.hexatask.application.usecase.auth;

import com.hexatask.hexatask.application.dto.auth.AuthResponse;
import com.hexatask.hexatask.application.dto.auth.LoginRequest;
import com.hexatask.hexatask.domain.exception.ResourceNotFoundException;
import com.hexatask.hexatask.domain.model.RefreshToken;
import com.hexatask.hexatask.domain.model.User;
import com.hexatask.hexatask.domain.ports.in.auth.LoginUserPort;
import com.hexatask.hexatask.domain.ports.out.RefreshTokenRepositoryPort;
import com.hexatask.hexatask.domain.ports.out.UserRepositoryPort;
import com.hexatask.hexatask.infrastructure.adapters.security.CustomUserDetails;
import com.hexatask.hexatask.infrastructure.security.TokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class LoginUseCaseImpl implements LoginUserPort {

    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepositoryPort refreshTokenRepository;
    private final UserRepositoryPort userRepository;

    public LoginUseCaseImpl(AuthenticationManager authenticationManager, 
            TokenProvider tokenProvider,
            RefreshTokenRepositoryPort refreshTokenRepository,
            UserRepositoryPort userRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public AuthResponse execute(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String accessToken = tokenProvider.createAccessToken(authentication);
        String refreshToken = tokenProvider.createRefreshToken(authentication);

        // Store refresh token in database
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        RefreshToken refreshTokenModel = new RefreshToken(
                null,
                user,
                refreshToken,
                Instant.now().plusMillis(tokenProvider.getRefreshTokenValidityInMilliseconds())
        );
        refreshTokenRepository.save(refreshTokenModel);

        return new AuthResponse(accessToken, refreshToken, "Bearer", 900L);
    }
}
