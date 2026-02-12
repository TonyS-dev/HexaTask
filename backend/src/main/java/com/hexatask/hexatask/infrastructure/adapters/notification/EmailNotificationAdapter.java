package com.hexatask.hexatask.infrastructure.adapters.notification;

import com.hexatask.hexatask.domain.ports.out.NotificationPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Stub implementation of NotificationPort that logs instead of sending emails.
 * Replace with real email sending when mail server is configured.
 */
@Component
@Slf4j
public class EmailNotificationAdapter implements NotificationPort {

    @Override
    @Async
    public void notifyProjectActivation(UUID ownerId, UUID projectId) {
        log.info("[NOTIFICATION STUB] Project activation email to owner {} for project {}", ownerId, projectId);
    }

    @Override
    @Async
    public void notifyTaskCreated(UUID assigneeId, UUID taskId) {
        log.info("[NOTIFICATION STUB] Task assignment email to assignee {} for task {}", assigneeId, taskId);
    }

    @Override
    @Async
    public void notifyTaskCompleted(UUID assigneeId, UUID taskId) {
        log.info("[NOTIFICATION STUB] Task completion email for task {}", taskId);
    }
}
