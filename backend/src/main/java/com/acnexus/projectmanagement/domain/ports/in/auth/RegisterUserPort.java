package com.acnexus.projectmanagement.domain.ports.in.auth;

import com.acnexus.projectmanagement.application.dto.auth.AuthResponse;
import com.acnexus.projectmanagement.application.dto.auth.RegisterRequest;

/**
 * Input port for user registration.
 */
public interface RegisterUserPort {
    AuthResponse execute(RegisterRequest request);
}
