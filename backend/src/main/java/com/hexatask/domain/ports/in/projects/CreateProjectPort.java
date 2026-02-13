package com.hexatask.hexatask.domain.ports.in.projects;

import com.hexatask.hexatask.application.dto.projects.CreateProjectCommand;
import com.hexatask.hexatask.domain.model.Project;

/**
 * Input port for creating a new project.
 */
public interface CreateProjectPort {
    Project execute(CreateProjectCommand command);
}
