package com.acnexus.projectmanagement.application.usecase.projects;

import com.acnexus.projectmanagement.domain.common.PageResult;
import com.acnexus.projectmanagement.domain.model.Project;
import com.acnexus.projectmanagement.domain.ports.in.projects.ListProjectsPort;
import com.acnexus.projectmanagement.domain.ports.out.CurrentUserPort;
import com.acnexus.projectmanagement.domain.ports.out.ProjectRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ListProjectsUseCaseImpl implements ListProjectsPort {

    private final ProjectRepositoryPort projectRepository;
    private final CurrentUserPort currentUserPort;

    public ListProjectsUseCaseImpl(ProjectRepositoryPort projectRepository, CurrentUserPort currentUserPort) {
        this.projectRepository = projectRepository;
        this.currentUserPort = currentUserPort;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<Project> execute(int page, int size) {
        UUID ownerId = currentUserPort.getCurrentUserId();
        return projectRepository.findByOwnerId(ownerId, page, size);
    }
}
