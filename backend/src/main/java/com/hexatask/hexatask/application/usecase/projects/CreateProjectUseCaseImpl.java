package com.hexatask.hexatask.application.usecase.projects;

import com.hexatask.hexatask.application.dto.projects.CreateProjectCommand;
import com.hexatask.hexatask.domain.model.Project;
import com.hexatask.hexatask.domain.model.ProjectStatus;
import com.hexatask.hexatask.domain.ports.in.projects.CreateProjectPort;
import com.hexatask.hexatask.domain.ports.out.CurrentUserPort;
import com.hexatask.hexatask.domain.ports.out.ProjectRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class CreateProjectUseCaseImpl implements CreateProjectPort {

    private final ProjectRepositoryPort projectRepository;
    private final CurrentUserPort currentUserPort;

    public CreateProjectUseCaseImpl(ProjectRepositoryPort projectRepository, CurrentUserPort currentUserPort) {
        this.projectRepository = projectRepository;
        this.currentUserPort = currentUserPort;
    }

    @Override
    @Transactional
    public Project execute(CreateProjectCommand command) {
        UUID ownerId = currentUserPort.getCurrentUserId();

        Project project = new Project(
                UUID.randomUUID(),
                ownerId,
                command.getName(),
                command.getDescription(),
                ProjectStatus.DRAFT,
                false,
                OffsetDateTime.now(),
                OffsetDateTime.now(),
                null);
        return projectRepository.save(project);
    }
}
