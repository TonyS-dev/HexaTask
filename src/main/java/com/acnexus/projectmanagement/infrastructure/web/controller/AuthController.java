package com.acnexus.projectmanagement.infrastructure.web.controller;

import com.acnexus.projectmanagement.application.dto.*;
import com.acnexus.projectmanagement.application.usecase.LoginUserUseCase;
import com.acnexus.projectmanagement.application.usecase.RefreshTokenUseCase;
import com.acnexus.projectmanagement.application.usecase.RegisterUserUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RegisterUserUseCase registerUserUseCase;
    private final LoginUserUseCase loginUserUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;

    public AuthController(RegisterUserUseCase registerUserUseCase,
            LoginUserUseCase loginUserUseCase,
            RefreshTokenUseCase refreshTokenUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(registerUserUseCase.execute(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(loginUserUseCase.execute(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(refreshTokenUseCase.execute(request));
    }
}
