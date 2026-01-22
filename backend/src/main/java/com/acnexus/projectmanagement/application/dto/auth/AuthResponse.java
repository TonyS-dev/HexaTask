package com.acnexus.projectmanagement.application.dto.auth;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long expiresIn) {
}
