package com.hexatask.hexatask.domain.ports.in.auth;

import com.hexatask.hexatask.application.dto.auth.AuthResponse;
import com.hexatask.hexatask.application.dto.auth.RegisterRequest;

/**
 * Input port for user registration.
 */
public interface RegisterUserPort {
    AuthResponse execute(RegisterRequest request);
}
