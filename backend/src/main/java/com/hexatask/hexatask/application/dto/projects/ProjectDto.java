package com.hexatask.hexatask.application.dto.projects;

import com.hexatask.hexatask.domain.model.ProjectStatus;
import java.time.OffsetDateTime;
import java.util.UUID;

import lombok.Builder;

@Builder
public record ProjectDto(
        UUID id,
        UUID ownerId,
        String name,
        String description,
        ProjectStatus status,
        boolean deleted,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt) {
}
