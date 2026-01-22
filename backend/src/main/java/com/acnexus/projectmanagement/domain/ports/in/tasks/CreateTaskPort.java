package com.acnexus.projectmanagement.domain.ports.in.tasks;

import com.acnexus.projectmanagement.application.dto.tasks.CreateTaskCommand;
import com.acnexus.projectmanagement.domain.model.Task;

/**
 * Input port for creating a new task.
 */
public interface CreateTaskPort {
    Task execute(CreateTaskCommand command);
}
