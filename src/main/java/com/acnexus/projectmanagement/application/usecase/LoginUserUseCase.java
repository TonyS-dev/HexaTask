package com.acnexus.projectmanagement.application.usecase;

import com.acnexus.projectmanagement.application.dto.AuthResponse;
import com.acnexus.projectmanagement.application.dto.LoginRequest;
import com.acnexus.projectmanagement.domain.ports.out.UserRepositoryPort;
import com.acnexus.projectmanagement.infrastructure.persistence.entity.UserEntity;
import com.acnexus.projectmanagement.infrastructure.security.TokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class LoginUserUseCase {

    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    public LoginUserUseCase(AuthenticationManager authenticationManager, TokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse execute(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String accessToken = tokenProvider.createAccessToken(authentication);
        String refreshToken = tokenProvider.createRefreshToken(authentication);

        // TODO: Store refreshToken in DB

        return new AuthResponse(accessToken, refreshToken, "Bearer", 900L);
    }
}
