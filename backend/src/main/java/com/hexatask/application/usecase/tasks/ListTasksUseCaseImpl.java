package com.hexatask.hexatask.application.usecase.tasks;

import com.hexatask.hexatask.domain.exception.ResourceNotFoundException;
import com.hexatask.hexatask.domain.model.Task;
import com.hexatask.hexatask.domain.ports.in.tasks.ListTasksPort;
import com.hexatask.hexatask.domain.ports.out.ProjectRepositoryPort;
import com.hexatask.hexatask.domain.ports.out.TaskRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ListTasksUseCaseImpl implements ListTasksPort {

    private final TaskRepositoryPort taskRepository;
    private final ProjectRepositoryPort projectRepository;

    public ListTasksUseCaseImpl(TaskRepositoryPort taskRepository,
            ProjectRepositoryPort projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Task> execute(UUID projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException(
                    "Project not found with id: " + projectId);
        }
        return taskRepository.findByProjectId(projectId);
    }
}
