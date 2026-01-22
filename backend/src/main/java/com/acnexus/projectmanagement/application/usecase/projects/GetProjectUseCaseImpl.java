package com.acnexus.projectmanagement.application.usecase.projects;

import com.acnexus.projectmanagement.domain.model.Project;
import com.acnexus.projectmanagement.domain.ports.in.projects.GetProjectPort;
import com.acnexus.projectmanagement.domain.ports.out.CurrentUserPort;
import com.acnexus.projectmanagement.domain.ports.out.ProjectRepositoryPort;
import com.acnexus.projectmanagement.domain.exception.ResourceNotFoundException;
import com.acnexus.projectmanagement.domain.exception.UnauthorizedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class GetProjectUseCaseImpl implements GetProjectPort {

    private final ProjectRepositoryPort projectRepository;
    private final CurrentUserPort currentUserPort;

    public GetProjectUseCaseImpl(ProjectRepositoryPort projectRepository, CurrentUserPort currentUserPort) {
        this.projectRepository = projectRepository;
        this.currentUserPort = currentUserPort;
    }

    @Override
    @Transactional(readOnly = true)
    public Project execute(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
        UUID currentUserId = currentUserPort.getCurrentUserId();
        if (!project.getOwnerId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to access this project");
        }
        
        return project;
    }
}
