package com.hexatask.hexatask.domain.ports.in.auth;

import com.hexatask.hexatask.application.dto.auth.AuthResponse;
import com.hexatask.hexatask.application.dto.auth.LoginRequest;

/**
 * Input port for user login.
 */
public interface LoginUserPort {
    AuthResponse execute(LoginRequest request);
}
