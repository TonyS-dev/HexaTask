package com.hexatask.hexatask.infrastructure.web.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Component
public class MdcLoggingFilter extends OncePerRequestFilter {

    private static final String TRACE_ID_HEADER = "X-Trace-Id";
    private static final String MDC_TRACE_ID_KEY = "traceId";
    private static final String MDC_ENDPOINT_KEY = "endpoint";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // 1. Trace ID
            String traceId = request.getHeader(TRACE_ID_HEADER);
            if (!StringUtils.hasText(traceId)) {
                traceId = UUID.randomUUID().toString();
            }
            MDC.put(MDC_TRACE_ID_KEY, traceId);

            // 2. Endpoint
            MDC.put(MDC_ENDPOINT_KEY, request.getRequestURI());

            // 3. Add to response
            response.addHeader(TRACE_ID_HEADER, traceId);

        } catch (Exception e) {
            log.warn("Failed to set MDC context", e);
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}
