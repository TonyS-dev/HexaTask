package com.hexatask.hexatask.domain.ports.in.projects;

import java.util.UUID;

/**
 * Input port for activating a project.
 */
public interface ActivateProjectPort {
    void execute(UUID projectId);
}
