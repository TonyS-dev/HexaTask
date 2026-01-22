package com.acnexus.projectmanagement.domain.ports.in.tasks;

import com.acnexus.projectmanagement.domain.model.Task;

import java.util.List;
import java.util.UUID;

/**
 * Input port for listing tasks by project ID.
 */
public interface ListTasksPort {
    List<Task> execute(UUID projectId);
}
