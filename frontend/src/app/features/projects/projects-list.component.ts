import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProjectService, Project, ProjectStatus } from '../../core/services/project.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  template: `
    <div class="min-h-screen bg-background p-8">
      <header class="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Projects</p>
          <h1 class="text-3xl font-bold text-primary">All projects</h1>
          <p class="text-slate-500">Browse and manage every initiative in one place.</p>
        </div>
        <div class="flex gap-3">
          <a mat-stroked-button color="primary" class="rounded-xl" routerLink="/dashboard">
            <mat-icon class="text-base mr-2">dashboard</mat-icon>
            Dashboard
          </a>
          <a mat-flat-button color="primary" class="bg-accent rounded-xl" routerLink="/projects/new">
            <mat-icon class="text-base mr-2">add</mat-icon>
            New project
          </a>
        </div>
      </header>

      <main class="max-w-7xl mx-auto">
        @if (isLoading()) {
          <mat-progress-bar mode="indeterminate" class="rounded-full mb-6"></mat-progress-bar>
        }

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (project of projects(); track project.id) {
            <mat-card class="border-none shadow-soft-sm hover:shadow-soft-md transition-shadow rounded-2xl overflow-hidden"
                      [routerLink]="['/projects', project.id]">
              <mat-card-header class="p-6 pb-0">
                <div class="flex justify-between items-start">
                  <mat-card-title class="text-xl font-bold text-primary">{{ project.name }}</mat-card-title>
                  <mat-chip-set>
                    <mat-chip [color]="statusColor(project.status)" selected>{{ project.status }}</mat-chip>
                  </mat-chip-set>
                </div>
              </mat-card-header>
              <mat-card-content class="p-6 pt-4">
                <p class="text-slate-600 line-clamp-2 mb-4">{{ project.description }}</p>
                <div class="text-sm text-slate-400 flex items-center gap-2">
                  <mat-icon class="text-base">schedule</mat-icon>
                  Updated {{ project.updatedAt | date:'mediumDate' }}
                </div>
              </mat-card-content>
            </mat-card>
          } @empty {
            <div class="col-span-full py-16 text-center bg-white rounded-3xl shadow-soft-sm">
              <mat-icon class="text-5xl text-slate-200 mb-3">folder_open</mat-icon>
              <h3 class="text-lg font-semibold text-slate-500">No projects yet</h3>
              <p class="text-slate-400 mb-4">Create your first project to get started.</p>
              <a mat-flat-button color="primary" class="bg-accent rounded-xl" routerLink="/projects/new">Create project</a>
            </div>
          }
        </div>
      </main>
    </div>
  `
})
export class ProjectsListComponent implements OnInit {
  private projectService = inject(ProjectService);

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

  statusColor(status: ProjectStatus) {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return 'primary';
      case ProjectStatus.DRAFT:
        return 'warn';
      case ProjectStatus.ARCHIVED:
      default:
        return 'accent';
    }
  }
}
