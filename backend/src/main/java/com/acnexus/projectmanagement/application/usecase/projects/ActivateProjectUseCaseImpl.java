package com.acnexus.projectmanagement.application.usecase.projects;

import com.acnexus.projectmanagement.domain.events.ProjectActivatedEvent;
import com.acnexus.projectmanagement.domain.exception.ResourceNotFoundException;
import com.acnexus.projectmanagement.domain.exception.UnauthorizedException;
import com.acnexus.projectmanagement.domain.model.Project;
import com.acnexus.projectmanagement.domain.ports.in.projects.ActivateProjectPort;
import com.acnexus.projectmanagement.domain.ports.out.CurrentUserPort;
import com.acnexus.projectmanagement.domain.ports.out.DomainEventPublisher;
import com.acnexus.projectmanagement.domain.ports.out.ProjectRepositoryPort;
import com.acnexus.projectmanagement.domain.ports.out.TaskRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class ActivateProjectUseCaseImpl implements ActivateProjectPort {

    private final ProjectRepositoryPort projectRepository;
    private final TaskRepositoryPort taskRepository;
    private final DomainEventPublisher eventPublisher;
    private final CurrentUserPort currentUserPort;

    public ActivateProjectUseCaseImpl(ProjectRepositoryPort projectRepository,
            TaskRepositoryPort taskRepository,
            DomainEventPublisher eventPublisher,
            CurrentUserPort currentUserPort) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.eventPublisher = eventPublisher;
        this.currentUserPort = currentUserPort;
    }

    @Override
    @Transactional
    public void execute(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        UUID currentUserId = currentUserPort.getCurrentUserId();
        if (!project.getOwnerId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to activate this project");
        }

        int activeTasks = taskRepository.countActiveTasksByProjectId(projectId);
        project.activate(activeTasks);
        projectRepository.save(project);

        eventPublisher.publish(new ProjectActivatedEvent(project.getId(), project.getOwnerId(), OffsetDateTime.now()));
    }
}
