package com.hexatask.hexatask.domain.ports.in.projects;

import com.hexatask.hexatask.domain.model.Project;

import java.util.UUID;

/**
 * Input port for retrieving a project by ID.
 */
public interface GetProjectPort {
    Project execute(UUID id);
}
