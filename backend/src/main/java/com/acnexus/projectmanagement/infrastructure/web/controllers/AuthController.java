package com.acnexus.projectmanagement.infrastructure.web.controllers;

import com.acnexus.projectmanagement.application.dto.auth.AuthResponse;
import com.acnexus.projectmanagement.application.dto.auth.LoginRequest;
import com.acnexus.projectmanagement.application.dto.auth.RefreshTokenRequest;
import com.acnexus.projectmanagement.application.dto.auth.RegisterRequest;
import com.acnexus.projectmanagement.domain.ports.in.auth.LoginUserPort;
import com.acnexus.projectmanagement.domain.ports.in.auth.RefreshTokenPort;
import com.acnexus.projectmanagement.domain.ports.in.auth.RegisterUserPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Authentication controller handling user registration, login, and token
 * refresh.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final RegisterUserPort registerUserPort;
    private final LoginUserPort loginUserPort;
    private final RefreshTokenPort refreshTokenPort;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(registerUserPort.execute(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(loginUserPort.execute(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(refreshTokenPort.execute(request.refreshToken()));
    }
}
