package com.hexatask.hexatask.domain.ports.in.tasks;

import com.hexatask.hexatask.domain.model.TaskStatus;

import java.util.UUID;

/**
 * Input port for updating task status.
 */
public interface UpdateTaskStatusPort {
    void execute(UUID taskId, TaskStatus status);
}
