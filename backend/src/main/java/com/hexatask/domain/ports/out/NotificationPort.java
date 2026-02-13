package com.hexatask.hexatask.domain.ports.out;

import java.util.UUID;

public interface NotificationPort {
    void notifyProjectActivation(UUID ownerId, UUID projectId);

    void notifyTaskCreated(UUID assigneeId, UUID taskId);

    void notifyTaskCompleted(UUID assigneeId, UUID taskId);
}
