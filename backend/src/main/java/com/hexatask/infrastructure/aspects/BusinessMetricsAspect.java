package com.hexatask.hexatask.infrastructure.aspects;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * AOP Aspect for business metrics.
 * 
 * <p>
 * Tracks key business metrics for projects and tasks:
 * - Projects created
 * - Tasks created
 * - Tasks completed
 * </p>
 */
@Aspect
@Component
@Slf4j
public class BusinessMetricsAspect {

    private final Counter projectsCreatedCounter;
    private final Counter tasksCreatedCounter;

    public BusinessMetricsAspect(MeterRegistry meterRegistry) {
        this.projectsCreatedCounter = Counter.builder("business.projects.created")
                .description("Total number of projects created")
                .register(meterRegistry);

        this.tasksCreatedCounter = Counter.builder("business.tasks.created")
                .description("Total number of tasks created")
                .register(meterRegistry);
    }

    /**
     * Pointcut for CreateProjectUseCase execution.
     */
    @Pointcut("execution(* com.hexatask.hexatask.application.usecase.projects.CreateProjectUseCaseImpl.execute(..))")
    public void createProjectExecution() {
    }

    /**
     * Pointcut for CreateTaskUseCase execution.
     */
    @Pointcut("execution(* com.hexatask.hexatask.application.usecase.tasks.CreateTaskUseCaseImpl.execute(..))")
    public void createTaskExecution() {
    }

    /**
     * Increments the projects created counter after successful creation.
     */
    @AfterReturning("createProjectExecution()")
    public void afterProjectCreated() {
        projectsCreatedCounter.increment();
        log.info("[METRICS] Project created - Total: {}", projectsCreatedCounter.count());
    }

    /**
     * Increments the tasks created counter after successful creation.
     */
    @AfterReturning("createTaskExecution()")
    public void afterTaskCreated() {
        tasksCreatedCounter.increment();
        log.info("[METRICS] Task created - Total: {}", tasksCreatedCounter.count());
    }
}
