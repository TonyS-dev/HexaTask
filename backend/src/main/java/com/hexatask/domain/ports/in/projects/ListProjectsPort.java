package com.hexatask.hexatask.domain.ports.in.projects;

import com.hexatask.hexatask.domain.common.PageResult;
import com.hexatask.hexatask.domain.model.Project;

/**
 * Input port for listing projects owned by the authenticated user with pagination.
 */
public interface ListProjectsPort {
    /**
     * Lists projects for the current user with paging.
     * @param page zero-based page number
     * @param size page size
     * @return Paginated projects owned by the user
     */
    PageResult<Project> execute(int page, int size);
}
