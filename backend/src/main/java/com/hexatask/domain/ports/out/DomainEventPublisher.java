package com.hexatask.hexatask.domain.ports.out;

import com.hexatask.hexatask.domain.events.DomainEvent;

public interface DomainEventPublisher {
    void publish(DomainEvent event);
}
