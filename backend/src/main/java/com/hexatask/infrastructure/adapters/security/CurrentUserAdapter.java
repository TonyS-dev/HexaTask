package com.hexatask.hexatask.infrastructure.adapters.security;

import com.hexatask.hexatask.domain.ports.out.CurrentUserPort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Adapter to retrieve the currently authenticated user from Spring Security
 * context.
 */
@Component
public class CurrentUserAdapter implements CurrentUserPort {

    @Override
    public UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.getId();
        }

        throw new IllegalStateException("No authenticated user found or invalid principal type");
    }
}
