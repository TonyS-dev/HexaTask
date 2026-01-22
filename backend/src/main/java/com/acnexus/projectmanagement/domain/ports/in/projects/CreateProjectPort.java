package com.acnexus.projectmanagement.domain.ports.in.projects;

import com.acnexus.projectmanagement.application.dto.projects.CreateProjectCommand;
import com.acnexus.projectmanagement.domain.model.Project;

/**
 * Input port for creating a new project.
 */
public interface CreateProjectPort {
    Project execute(CreateProjectCommand command);
}
