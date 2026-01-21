package com.acnexus.projectmanagement.application.dto;

import java.util.UUID;

public record CreateTaskCommand(
        UUID projectId,
        String title,
        String description,
        UUID assigneeId) {
}
