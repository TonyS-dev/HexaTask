package com.hexatask.hexatask.domain.ports.in.tasks;

import com.hexatask.hexatask.application.dto.tasks.CreateTaskCommand;
import com.hexatask.hexatask.domain.model.Task;

/**
 * Input port for creating a new task.
 */
public interface CreateTaskPort {
    Task execute(CreateTaskCommand command);
}
