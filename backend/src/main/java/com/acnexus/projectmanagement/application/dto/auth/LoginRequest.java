package com.acnexus.projectmanagement.application.dto.auth;

public record LoginRequest(
        String email,
        String password) {
}
