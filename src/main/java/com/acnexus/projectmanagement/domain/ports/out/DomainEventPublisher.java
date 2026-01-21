package com.acnexus.projectmanagement.domain.ports.out;

import com.acnexus.projectmanagement.domain.events.DomainEvent;

public interface DomainEventPublisher {
    void publish(DomainEvent event);
}
