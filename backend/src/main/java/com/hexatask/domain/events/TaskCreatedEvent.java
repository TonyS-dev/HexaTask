package com.hexatask.hexatask.domain.events;

import java.time.Instant;
import java.util.UUID;

public class TaskCreatedEvent implements DomainEvent {
    private final UUID taskId;
    private final Instant occurredOn;

    public TaskCreatedEvent(UUID taskId) {
        this.taskId = taskId;
        this.occurredOn = Instant.now();
    }

    public UUID getTaskId() {
        return taskId;
    }

    public Instant occurredOn() {
        return occurredOn;
    }
}
