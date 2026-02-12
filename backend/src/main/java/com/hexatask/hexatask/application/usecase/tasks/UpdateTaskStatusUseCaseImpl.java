package com.hexatask.hexatask.application.usecase.tasks;

import com.hexatask.hexatask.domain.exception.ResourceNotFoundException;
import com.hexatask.hexatask.domain.exception.UnauthorizedException;
import com.hexatask.hexatask.domain.model.Project;
import com.hexatask.hexatask.domain.model.Task;
import com.hexatask.hexatask.domain.model.TaskStatus;
import com.hexatask.hexatask.domain.ports.in.tasks.UpdateTaskStatusPort;
import com.hexatask.hexatask.domain.ports.out.CurrentUserPort;
import com.hexatask.hexatask.domain.ports.out.ProjectRepositoryPort;
import com.hexatask.hexatask.domain.ports.out.TaskRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UpdateTaskStatusUseCaseImpl implements UpdateTaskStatusPort {

    private final TaskRepositoryPort taskRepository;
    private final ProjectRepositoryPort projectRepository;
    private final CurrentUserPort currentUserPort;

    public UpdateTaskStatusUseCaseImpl(TaskRepositoryPort taskRepository,
            ProjectRepositoryPort projectRepository,
            CurrentUserPort currentUserPort) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.currentUserPort = currentUserPort;
    }

    @Override
    @Transactional
    public void execute(UUID taskId, TaskStatus status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        Project project = projectRepository.findById(task.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        UUID currentUserId = currentUserPort.getCurrentUserId();
        if (!project.getOwnerId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to update tasks in this project");
        }

        task.setStatus(status);
        taskRepository.save(task);
    }
}
