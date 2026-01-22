package com.acnexus.projectmanagement.infrastructure.adapters.events;

import com.acnexus.projectmanagement.domain.events.DomainEvent;
import com.acnexus.projectmanagement.domain.ports.out.DomainEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SpringEventPublisherAdapter implements DomainEventPublisher {

    private final ApplicationEventPublisher applicationEventPublisher;

    @Override
    public void publish(DomainEvent event) {
        log.info("Publishing domain event: {}", event);
        applicationEventPublisher.publishEvent(event);
    }
}
