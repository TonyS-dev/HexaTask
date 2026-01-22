package com.acnexus.projectmanagement.application.dto.tasks;

import java.util.UUID;

public record CreateTaskCommand(
        UUID projectId,
        String title,
        String description,
        UUID assigneeId) {
}
