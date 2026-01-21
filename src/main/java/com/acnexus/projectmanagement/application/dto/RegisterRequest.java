package com.acnexus.projectmanagement.application.dto;

public record RegisterRequest(
        String fullName,
        String email,
        String password) {
}
