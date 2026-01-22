package com.acnexus.projectmanagement.application.dto.projects;

import com.acnexus.projectmanagement.domain.model.ProjectStatus;
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
