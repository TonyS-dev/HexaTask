export enum TaskStatus {
    TO_DO = 'TO_DO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE'
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description: string;
    status: TaskStatus;
    archived?: boolean;
    assigneeId?: string | null;
    dueDate?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateTaskCommand {
    projectId: string;
    title: string;
    description: string;
    assigneeId?: string;
}

export interface UpdateTaskCommand {
    title?: string;
    description?: string;
    status?: TaskStatus;
    assigneeId?: string | null;
    dueDate?: string;
}
