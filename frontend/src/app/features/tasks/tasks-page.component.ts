import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TaskService, Task, TaskStatus } from '../../core/services/task.service';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="min-h-screen bg-background p-8">
      <header class="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Tasks</p>
          <h1 class="text-3xl font-bold text-primary">My tasks</h1>
          <p class="text-slate-500">All your work items across projects.</p>
        </div>
        <div class="flex gap-3" *ngIf="projectId">
          <a mat-stroked-button [routerLink]="['/projects', projectId, 'board']" class="rounded-xl">
            <mat-icon class="text-base mr-2">dashboard</mat-icon>
            Board view
          </a>
        </div>
      </header>

      <main class="max-w-6xl mx-auto">
        @if (!projectId) {
          <div class="py-16 text-center bg-white rounded-3xl shadow-soft-sm">
            <mat-icon class="text-5xl text-slate-200 mb-3">info</mat-icon>
            <h3 class="text-lg font-semibold text-slate-500">Select a project to view tasks</h3>
            <p class="text-slate-400 mb-4">Tasks are scoped per project. Open a project to see its tasks.</p>
            <a mat-flat-button color="primary" class="bg-accent rounded-xl" routerLink="/projects">Go to projects</a>
          </div>
        } @else {
          @if (isLoading()) {
            <mat-progress-bar mode="indeterminate" class="rounded-full mb-4"></mat-progress-bar>
          }

          <div class="grid grid-cols-1 gap-4">
            @for (task of tasks(); track task.id) {
              <mat-card class="border-none shadow-soft-sm rounded-2xl overflow-hidden">
                <div class="p-4 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <mat-checkbox [checked]="task.status === TaskStatus.DONE"></mat-checkbox>
                    <div>
                      <h3 class="text-lg font-semibold text-primary m-0">{{ task.title }}</h3>
                      <p class="text-sm text-slate-500 m-0">Task in project {{ projectId }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <mat-chip [color]="statusColor(task.status)" selected>{{ task.status }}</mat-chip>
                    <a mat-icon-button [routerLink]="['/projects', projectId]" aria-label="Open project">
                      <mat-icon>open_in_new</mat-icon>
                    </a>
                  </div>
                </div>
              </mat-card>
            } @empty {
              <div class="py-16 text-center bg-white rounded-3xl shadow-soft-sm">
                <mat-icon class="text-5xl text-slate-200 mb-3">checklist</mat-icon>
                <h3 class="text-lg font-semibold text-slate-500">No tasks yet</h3>
                <p class="text-slate-400 mb-4">Create tasks from the project details page.</p>
              </div>
            }
          </div>
        }
      </main>
    </div>
  `
})
export class TasksPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  projectId: string | null = null;
  tasks = signal<Task[]>([]);
  isLoading = signal(false);

  TaskStatus = TaskStatus;

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.loadTasks(this.projectId);
    }
  }

  loadTasks(projectId: string) {
    this.isLoading.set(true);
    this.taskService.getTasks(projectId).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  statusColor(status: TaskStatus) {
    switch (status) {
      case TaskStatus.TO_DO: return 'warn';
      case TaskStatus.IN_PROGRESS: return 'primary';
      case TaskStatus.DONE:
      default: return 'accent';
    }
  }
}
