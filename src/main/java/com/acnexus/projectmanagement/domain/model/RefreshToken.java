package com.acnexus.projectmanagement.domain.model;

import java.time.Instant;
import java.util.UUID;

public class RefreshToken {
    private UUID id;
    private User user;
    private String token;
    private Instant expiryDate;

    public RefreshToken(UUID id, User user, String token, Instant expiryDate) {
        this.id = id;
        this.user = user;
        this.token = token;
        this.expiryDate = expiryDate;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getToken() {
        return token;
    }

    public Instant getExpiryDate() {
        return expiryDate;
    }
}
