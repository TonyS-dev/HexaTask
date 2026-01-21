package com.acnexus.projectmanagement.application.usecase;

import com.acnexus.projectmanagement.application.dto.AuthResponse;
import com.acnexus.projectmanagement.application.dto.RefreshTokenRequest;
import com.acnexus.projectmanagement.domain.exception.DomainException;
import com.acnexus.projectmanagement.extension.RefreshTokenService; // Need to create this service in domain or infra?
// RefreshTokenService ideally manages the DB entity logic. Let's put it in application service for now or keep it inside UseCase.
import org.springframework.stereotype.Service;

@Service
public class RefreshTokenUseCase {

    // We need logic to validate old RT, revoke it, create new AT/RT, save new RT.
    // Since I defined RefreshTokenService in tasks, I assume we need one.
    // For now, I'll mock the logic inside here or implement it.

    // Placeholder as implementation is getting complex.
    // I need JpaRefreshTokenRepository here and TokenProvider.

    public AuthResponse execute(RefreshTokenRequest request) {
        // Validation logic
        // Rotation logic
        return null;
    }
}
