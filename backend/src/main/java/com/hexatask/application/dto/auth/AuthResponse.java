package com.hexatask.hexatask.application.dto.auth;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long expiresIn) {
}
