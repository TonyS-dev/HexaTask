package com.acnexus.projectmanagement.domain.ports.in.projects;

import com.acnexus.projectmanagement.domain.model.Project;

import java.util.UUID;

/**
 * Input port for retrieving a project by ID.
 */
public interface GetProjectPort {
    Project execute(UUID id);
}
