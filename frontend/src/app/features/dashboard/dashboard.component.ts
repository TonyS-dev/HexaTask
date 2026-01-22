import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { ProjectService, Project, ProjectStatus } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatMenuModule
    ],
    template: `
    <div class="min-h-screen bg-background p-8">
      <header class="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 class="text-3xl font-bold text-primary">Workspace</h1>
          <p class="text-slate-500">Manage your ongoing projects and initiatives</p>
        </div>
        <div class="flex gap-4 items-center">
          <button mat-icon-button [matMenuTriggerFor]="userMenu" class="mr-2">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <div class="px-4 py-2 border-b border-slate-100">
              <p class="font-semibold text-primary m-0">{{ authService.currentUser()?.email || 'User' }}</p>
              <p class="text-xs text-slate-400 m-0">Authenticated</p>
            </div>
            <button mat-menu-item (click)="onLogout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
          <button mat-fab color="primary" class="bg-accent shadow-soft-md" (click)="onCreateProject()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </header>

      <main class="max-w-7xl mx-auto">
        @if (isLoading()) {
          <mat-progress-bar mode="indeterminate" class="rounded-full"></mat-progress-bar>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (project of projects(); track project.id) {
              <mat-card class="border-none shadow-soft-sm hover:shadow-soft-md transition-shadow cursor-pointer rounded-2xl overflow-hidden"
                        [routerLink]="['/projects', project.id]">
                <mat-card-header class="p-6 pb-0">
                  <div class="flex justify-between items-start w-full">
                    <mat-card-title class="text-xl font-bold text-primary">{{ project.name }}</mat-card-title>
                    <span [class]="getStatusClass(project.status)" 
                          class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {{ project.status }}
                    </span>
                  </div>
                </mat-card-header>
                
                <mat-card-content class="p-6">
                  <p class="text-slate-600 line-clamp-2 mb-6">{{ project.description }}</p>
                  
                  <div class="flex items-center justify-between text-slate-400 text-sm">
                    <div class="flex items-center gap-1">
                      <mat-icon class="text-lg w-5 h-5">calendar_today</mat-icon>
                      <span>{{ project.createdAt | date:'shortDate' }}</span>
                    </div>
                  </div>
                </mat-card-content>

                <mat-card-actions class="p-6 pt-0 flex justify-end">
                  @if (project.status === 'DRAFT') {
                    <button mat-stroked-button color="accent" 
                            class="border-accent text-accent rounded-xl px-6"
                            (click)="$event.stopPropagation(); onActivate(project)">
                      Activate
                    </button>
                  } @else {
                    <button mat-flat-button class="bg-slate-100 text-slate-500 rounded-xl px-6" disabled>
                      View Details
                    </button>
                  }
                </mat-card-actions>
              </mat-card>
            } @empty {
              <div class="col-span-full py-20 text-center bg-white rounded-3xl shadow-soft-sm">
                <mat-icon class="text-6xl w-15 h-15 text-slate-200 mb-4">folder_open</mat-icon>
                <h3 class="text-xl font-semibold text-slate-400">No projects found</h3>
                <p class="text-slate-300">Start by creating your first project</p>
              </div>
            }
          </div>
        }
      </main>
    </div>
  `,
    styles: [`
    :host { display: block; }
    mat-card-title { margin-bottom: 0 !important; }
  `]
})
export class DashboardComponent implements OnInit {
    private projectService = inject(ProjectService);
    private taskService = inject(TaskService);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);
    authService = inject(AuthService);

    projects = signal<Project[]>([]);
    isLoading = signal(true);

    ngOnInit() {
        this.loadProjects();
    }

    loadProjects() {
        this.isLoading.set(true);
        this.projectService.getProjects().subscribe({
            next: (result) => {
                this.projects.set(result.content);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    getStatusClass(status: ProjectStatus) {
        switch (status) {
            case ProjectStatus.ACTIVE: return 'bg-emerald-50 text-emerald-600';
            case ProjectStatus.DRAFT: return 'bg-slate-100 text-slate-600';
            case ProjectStatus.ARCHIVED: return 'bg-rose-50 text-rose-600';
            default: return 'bg-slate-100';
        }
    }

    onActivate(project: Project) {
        // Check if project has tasks before activating
        this.taskService.getTasks(project.id).subscribe({
            next: (tasks) => {
                if (tasks.length === 0) {
                    this.snackBar.open('Cannot activate project without tasks. Add at least one task first.', 'Close', {
                        duration: 5000,
                        panelClass: ['bg-slate-900', 'text-white']
                    });
                    return;
                }

                this.projectService.activateProject(project.id).subscribe({
                    next: () => {
                        this.snackBar.open(`Project "${project.name}" activated successfully!`, 'Close', {
                            duration: 3500
                        });
                        this.loadProjects();
                    },
                    error: () => {
                        this.snackBar.open('Failed to activate project.', 'Close', { duration: 3500 });
                    }
                });
            },
            error: () => {
                this.snackBar.open('Could not check project tasks.', 'Close', { duration: 3500 });
            }
        });
    }

    onCreateProject() {
        this.router.navigate(['/projects/new']);
    }

    onLogout() {
        this.authService.logout();
    }
}
