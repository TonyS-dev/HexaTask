package com.hexatask.hexatask.domain.events;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ProjectActivatedEvent(UUID projectId, UUID ownerId, OffsetDateTime activatedAt) implements DomainEvent {
}
