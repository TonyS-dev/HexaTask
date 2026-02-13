package com.hexatask.hexatask.domain.ports.in.auth;

import com.hexatask.hexatask.application.dto.auth.AuthResponse;

/**
 * Input port for refreshing access tokens.
 */
public interface RefreshTokenPort {
    AuthResponse execute(String refreshToken);
}
