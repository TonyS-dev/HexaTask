package com.acnexus.projectmanagement.application.dto;

public record LoginRequest(
        String email,
        String password) {
}
