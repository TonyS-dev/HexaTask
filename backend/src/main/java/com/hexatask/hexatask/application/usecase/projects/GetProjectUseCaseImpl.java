package com.hexatask.hexatask.application.usecase.projects;

import com.hexatask.hexatask.domain.model.Project;
import com.hexatask.hexatask.domain.ports.in.projects.GetProjectPort;
import com.hexatask.hexatask.domain.ports.out.CurrentUserPort;
import com.hexatask.hexatask.domain.ports.out.ProjectRepositoryPort;
import com.hexatask.hexatask.domain.exception.ResourceNotFoundException;
import com.hexatask.hexatask.domain.exception.UnauthorizedException;
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
