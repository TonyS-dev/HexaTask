import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export enum ProjectStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED'
}

export interface Project {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    status: ProjectStatus;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PageResult<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/projects`;

    getProjects(page: number = 0, size: number = 10): Observable<PageResult<Project>> {
        return this.http.get<PageResult<Project>>(`${this.apiUrl}?page=${page}&size=${size}`);
    }

    getProject(id: string): Observable<Project> {
        return this.http.get<Project>(`${this.apiUrl}/${id}`);
    }

    createProject(project: Partial<Project>): Observable<Project> {
        return this.http.post<Project>(this.apiUrl, project);
    }

    activateProject(id: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${id}/activate`, {});
    }
}
