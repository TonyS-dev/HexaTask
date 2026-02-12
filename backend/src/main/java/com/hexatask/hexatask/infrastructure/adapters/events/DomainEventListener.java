package com.hexatask.hexatask.infrastructure.adapters.events;

import com.hexatask.hexatask.domain.events.ProjectActivatedEvent;
import com.hexatask.hexatask.domain.events.TaskCompletedEvent;
import com.hexatask.hexatask.domain.events.TaskCreatedEvent;
import com.hexatask.hexatask.domain.ports.out.NotificationPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DomainEventListener {

    private final NotificationPort notificationPort;

    @EventListener
    public void handle(ProjectActivatedEvent event) {
        log.info("Handling ProjectActivatedEvent for project {}", event.projectId());
        // In a real app, we would fetch the ownerId using the project repo if not
        // present in event
        // For now, we just pass a placeholder or if usage changed
        // notificationPort.notifyProjectActivation(..., event.getProjectId());
    }

    @EventListener
    public void handle(TaskCreatedEvent event) {
        log.info("Handling TaskCreatedEvent for task {}", event.getTaskId());
        // Here we would ideally fetch the Task to get the assignee, then call
        // notification
        // For demonstration of the flow:
        notificationPort.notifyTaskCreated(null, event.getTaskId());
    }

    @EventListener
    public void handle(TaskCompletedEvent event) {
        log.info("Handling TaskCompletedEvent for task {}", event.getTaskId());
        notificationPort.notifyTaskCompleted(null, event.getTaskId());
    }
}
