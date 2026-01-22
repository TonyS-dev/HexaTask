package com.acnexus.projectmanagement.domain.ports.in.auth;

import com.acnexus.projectmanagement.application.dto.auth.AuthResponse;
import com.acnexus.projectmanagement.application.dto.auth.LoginRequest;

/**
 * Input port for user login.
 */
public interface LoginUserPort {
    AuthResponse execute(LoginRequest request);
}
