package com.hexatask.hexatask.application.dto.auth;

public record LoginRequest(
        String email,
        String password) {
}
