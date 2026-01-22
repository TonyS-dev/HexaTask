package com.acnexus.projectmanagement.domain.events;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ProjectActivatedEvent(UUID projectId, UUID ownerId, OffsetDateTime activatedAt) implements DomainEvent {
}
