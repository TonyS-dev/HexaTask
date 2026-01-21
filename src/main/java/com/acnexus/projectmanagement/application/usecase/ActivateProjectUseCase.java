package com.acnexus.projectmanagement.application.usecase;

import com.acnexus.projectmanagement.domain.events.ProjectActivatedEvent;
import com.acnexus.projectmanagement.domain.exception.ResourceNotFoundException;
import com.acnexus.projectmanagement.domain.model.Project;
import com.acnexus.projectmanagement.domain.ports.out.DomainEventPublisher;
import com.acnexus.projectmanagement.domain.ports.out.ProjectRepositoryPort;
import com.acnexus.projectmanagement.domain.ports.out.TaskRepositoryPort;

import java.time.OffsetDateTime;
import java.util.UUID;

public class ActivateProjectUseCase {

    private final ProjectRepositoryPort projectRepository;
    private final TaskRepositoryPort taskRepository;
    private final DomainEventPublisher eventPublisher;

    public ActivateProjectUseCase(ProjectRepositoryPort projectRepository,
            TaskRepositoryPort taskRepository,
            DomainEventPublisher eventPublisher) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.eventPublisher = eventPublisher;
    }

    public void execute(UUID projectId, UUID ownerId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        // Ownership Check Rule
        if (!project.canBeModifiedBy(ownerId)) {
            throw new SecurityException("User " + ownerId + " is not the owner of project " + projectId);
        }

        // Domain Invariant: active tasks count via repository port
        int activeTasks = taskRepository.countActiveTasksByProjectId(projectId);

        // Execute Domain Logic
        project.activate(activeTasks);

        // Save State
        projectRepository.save(project);

        // Publish Side Effect
        eventPublisher.publish(new ProjectActivatedEvent(project.getId(), project.getOwnerId(), OffsetDateTime.now()));
    }
}
