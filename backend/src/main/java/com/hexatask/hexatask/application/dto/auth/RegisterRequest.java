package com.hexatask.hexatask.application.dto.auth;

public record RegisterRequest(
        String fullName,
        String email,
        String password) {
}
