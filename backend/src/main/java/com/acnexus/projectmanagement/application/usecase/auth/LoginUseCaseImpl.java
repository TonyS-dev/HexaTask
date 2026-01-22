package com.acnexus.projectmanagement.application.usecase.auth;

import com.acnexus.projectmanagement.application.dto.auth.AuthResponse;
import com.acnexus.projectmanagement.application.dto.auth.LoginRequest;
import com.acnexus.projectmanagement.domain.exception.ResourceNotFoundException;
import com.acnexus.projectmanagement.domain.model.RefreshToken;
import com.acnexus.projectmanagement.domain.model.User;
import com.acnexus.projectmanagement.domain.ports.in.auth.LoginUserPort;
import com.acnexus.projectmanagement.domain.ports.out.RefreshTokenRepositoryPort;
import com.acnexus.projectmanagement.domain.ports.out.UserRepositoryPort;
import com.acnexus.projectmanagement.infrastructure.adapters.security.CustomUserDetails;
import com.acnexus.projectmanagement.infrastructure.security.TokenProvider;
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
