package com.hexatask.hexatask.infrastructure.aspects;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * AOP Aspect for performance logging and metrics collection.
 * 
 * <p>
 * This aspect automatically intercepts use case executions and controller
 * methods
 * to log execution times and record metrics via Micrometer.
 * </p>
 */
@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class PerformanceLoggingAspect {

    private final MeterRegistry meterRegistry;

    /**
     * Pointcut for all use case implementations in the application layer.
     */
    @Pointcut("execution(* com.hexatask.hexatask.application.usecase..*.*(..))")
    public void useCaseExecution() {
    }

    /**
     * Pointcut for all REST controller methods.
     */
    @Pointcut("execution(* com.hexatask.hexatask.infrastructure.web.controllers..*.*(..))")
    public void controllerExecution() {
    }

    /**
     * Pointcut for all repository adapter methods.
     */
    @Pointcut("execution(* com.hexatask.hexatask.infrastructure.adapters.persistence..*.*(..))")
    public void repositoryExecution() {
    }

    /**
     * Logs execution time for use case methods and records metrics.
     */
    @Around("useCaseExecution()")
    public Object logUseCaseExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        return logAndMeasure(joinPoint, "usecase");
    }

    /**
     * Logs execution time for controller methods and records metrics.
     */
    @Around("controllerExecution()")
    public Object logControllerExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        return logAndMeasure(joinPoint, "controller");
    }

    /**
     * Logs execution time for repository adapter methods and records metrics.
     */
    @Around("repositoryExecution()")
    public Object logRepositoryExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        return logAndMeasure(joinPoint, "repository");
    }

    /**
     * Common method to log execution and record metrics.
     */
    private Object logAndMeasure(ProceedingJoinPoint joinPoint, String layer) throws Throwable {
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        String fullMethod = className + "." + methodName;

        long startTime = System.currentTimeMillis();
        boolean success = true;

        try {
            log.debug("[{}] Starting: {}", layer.toUpperCase(), fullMethod);
            Object result = joinPoint.proceed();
            log.debug("[{}] Completed: {} in {} ms", layer.toUpperCase(), fullMethod,
                    System.currentTimeMillis() - startTime);
            return result;
        } catch (Throwable ex) {
            success = false;
            log.warn("[{}] Failed: {} after {} ms - {}", layer.toUpperCase(), fullMethod,
                    System.currentTimeMillis() - startTime, ex.getMessage());
            throw ex;
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            recordMetrics(layer, className, methodName, duration, success);
        }
    }

    /**
     * Records execution metrics using Micrometer.
     */
    private void recordMetrics(String layer, String className, String methodName,
            long durationMs, boolean success) {
        Timer.builder("app.method.execution")
                .tag("layer", layer)
                .tag("class", className)
                .tag("method", methodName)
                .tag("status", success ? "success" : "error")
                .description("Method execution time")
                .register(meterRegistry)
                .record(durationMs, TimeUnit.MILLISECONDS);

        // Increment counter for method calls
        meterRegistry.counter("app.method.calls",
                "layer", layer,
                "class", className,
                "method", methodName,
                "status", success ? "success" : "error").increment();
    }
}
