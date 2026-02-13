package com.hexatask.hexatask.application.usecase.tasks;

import com.hexatask.hexatask.application.dto.tasks.CreateTaskCommand;
import com.hexatask.hexatask.domain.events.TaskCreatedEvent;
import com.hexatask.hexatask.domain.exception.ResourceNotFoundException;
import com.hexatask.hexatask.domain.exception.UnauthorizedException;
import com.hexatask.hexatask.domain.model.Project;
import com.hexatask.hexatask.domain.model.Task;
import com.hexatask.hexatask.domain.model.TaskStatus;
import com.hexatask.hexatask.domain.ports.in.tasks.CreateTaskPort;
import com.hexatask.hexatask.domain.ports.out.CurrentUserPort;
import com.hexatask.hexatask.domain.ports.out.DomainEventPublisher;
import com.hexatask.hexatask.domain.ports.out.ProjectRepositoryPort;
import com.hexatask.hexatask.domain.ports.out.TaskRepositoryPort;
import com.hexatask.hexatask.domain.ports.out.UserRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class CreateTaskUseCaseImpl implements CreateTaskPort {

    private final TaskRepositoryPort taskRepository;
    private final ProjectRepositoryPort projectRepository;
    private final UserRepositoryPort userRepository;
    private final DomainEventPublisher eventPublisher;
    private final CurrentUserPort currentUserPort;

    public CreateTaskUseCaseImpl(TaskRepositoryPort taskRepository,
            ProjectRepositoryPort projectRepository,
            UserRepositoryPort userRepository,
            DomainEventPublisher eventPublisher,
            CurrentUserPort currentUserPort) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
        this.currentUserPort = currentUserPort;
    }

    @Override
    @Transactional
    public Task execute(CreateTaskCommand command) {
        Project project = projectRepository.findById(command.projectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + command.projectId()));

        UUID currentUserId = currentUserPort.getCurrentUserId();
        if (!project.getOwnerId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to create tasks in this project");
        }

        if (command.assigneeId() != null && !userRepository.existsById(command.assigneeId())) {
            throw new ResourceNotFoundException("Assignee not found with id: " + command.assigneeId());
        }

        Task task = new Task(
                UUID.randomUUID(),
                command.projectId(),
                command.title(),
                command.description(),
                TaskStatus.TO_DO,
                false,
                false,
                command.assigneeId(),
                OffsetDateTime.now(),
                OffsetDateTime.now(),
                0L);

        Task savedTask = taskRepository.save(task);
        eventPublisher.publish(new TaskCreatedEvent(savedTask.getId()));

        return savedTask;
    }
}
