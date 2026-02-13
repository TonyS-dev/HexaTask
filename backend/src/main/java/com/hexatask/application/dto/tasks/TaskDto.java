package com.hexatask.hexatask.application.dto.tasks;

import com.hexatask.hexatask.domain.model.TaskStatus;
import java.time.OffsetDateTime;
import java.util.UUID;

import lombok.Builder;

@Builder
public record TaskDto(
        UUID id,
        UUID projectId,
        String title,
        String description,
        TaskStatus status,
        boolean archived,
        UUID assigneeId,
        OffsetDateTime createdAt) {
}
