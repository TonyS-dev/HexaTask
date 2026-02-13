package com.hexatask.hexatask.domain.ports.in.tasks;

import com.hexatask.hexatask.domain.model.Task;

import java.util.List;
import java.util.UUID;

/**
 * Input port for listing tasks by project ID.
 */
public interface ListTasksPort {
    List<Task> execute(UUID projectId);
}
