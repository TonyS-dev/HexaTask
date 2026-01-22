import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

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
    archived: boolean;
    assigneeId: string | null;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/tasks`;

    getTasks(projectId: string): Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl, { params: { projectId } });
    }

    createTask(task: Partial<Task>): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, task);
    }

    updateTaskStatus(id: string, status: TaskStatus): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { status });
    }
}
