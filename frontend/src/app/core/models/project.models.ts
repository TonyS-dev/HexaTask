export enum ProjectStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    PAUSED = 'PAUSED',
    ARCHIVED = 'ARCHIVED',
    COMPLETED = 'COMPLETED',
    CLOSED = 'CLOSED'
}

export interface Project {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    status: ProjectStatus;
    deleted?: boolean;
    createdAt: string;
    updatedAt: string;
    version?: number;
}

export interface CreateProjectCommand {
    ownerId: string;
    name: string;
    description: string;
}

export interface UpdateProjectCommand {
    name?: string;
    description?: string;
    status?: ProjectStatus;
}
