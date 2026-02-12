package com.hexatask.hexatask.application.dto.tasks;

import lombok.Builder;

import java.util.UUID;

@Builder
public record CreateTaskCommand(
                UUID projectId,
                String title,
                String description,
                UUID assigneeId) {
}
