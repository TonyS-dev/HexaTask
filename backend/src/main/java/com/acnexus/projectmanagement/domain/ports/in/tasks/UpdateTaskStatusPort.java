package com.acnexus.projectmanagement.domain.ports.in.tasks;

import com.acnexus.projectmanagement.domain.model.TaskStatus;

import java.util.UUID;

/**
 * Input port for updating task status.
 */
public interface UpdateTaskStatusPort {
    void execute(UUID taskId, TaskStatus status);
}
