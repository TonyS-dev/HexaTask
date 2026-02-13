package com.hexatask.hexatask.domain.ports.out;

import com.hexatask.hexatask.domain.model.Task;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskRepositoryPort {
    Task save(Task task);

    Optional<Task> findById(UUID id);

    List<Task> findByProjectId(UUID projectId);

    int countActiveTasksByProjectId(UUID projectId);
}
