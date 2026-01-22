package com.acnexus.projectmanagement.application.dto.auth;

public record RegisterRequest(
        String fullName,
        String email,
        String password) {
}
