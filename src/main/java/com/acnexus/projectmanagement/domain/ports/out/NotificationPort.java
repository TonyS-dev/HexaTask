package com.acnexus.projectmanagement.domain.ports.out;

import java.util.UUID;

public interface NotificationPort {
    void notifyProjectActivation(UUID ownerId, UUID projectId);
}
