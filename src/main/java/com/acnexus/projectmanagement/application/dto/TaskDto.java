package com.acnexus.projectmanagement.application.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TaskDto(
        UUID id,
        UUID projectId,
        String title,
        String description,
        boolean completed,
        boolean archived,
        UUID assigneeId,
        OffsetDateTime createdAt) {
}
