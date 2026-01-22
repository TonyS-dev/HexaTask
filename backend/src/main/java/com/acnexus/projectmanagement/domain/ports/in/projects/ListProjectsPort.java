package com.acnexus.projectmanagement.domain.ports.in.projects;

import com.acnexus.projectmanagement.domain.common.PageResult;
import com.acnexus.projectmanagement.domain.model.Project;

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
