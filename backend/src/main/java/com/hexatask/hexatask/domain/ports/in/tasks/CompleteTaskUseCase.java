package com.hexatask.hexatask.domain.ports.in.tasks;

import java.util.UUID;

public interface CompleteTaskUseCase {
    void execute(UUID taskId);
}
