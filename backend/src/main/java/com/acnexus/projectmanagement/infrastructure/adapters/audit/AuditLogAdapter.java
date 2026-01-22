package com.acnexus.projectmanagement.infrastructure.adapters.audit;

import com.acnexus.projectmanagement.domain.ports.out.AuditLogPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Slf4j
public class AuditLogAdapter implements AuditLogPort {

    @Override
    public void register(String action, UUID entityId) {
        log.info("AUDIT_LOG: Action={} EntityId={}", action, entityId);
    }
}
