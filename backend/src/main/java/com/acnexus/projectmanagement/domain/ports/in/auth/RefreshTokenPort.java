package com.acnexus.projectmanagement.domain.ports.in.auth;

import com.acnexus.projectmanagement.application.dto.auth.AuthResponse;

/**
 * Input port for refreshing access tokens.
 */
public interface RefreshTokenPort {
    AuthResponse execute(String refreshToken);
}
