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
    <div class="min-h-screen bg-swiss-gray-50 p-swiss-5">
      <!-- Header -->
      <header class="max-w-5xl mx-auto mb-swiss-8">
        <p class="text-label uppercase tracking-widest text-swiss-gray-600 mb-2">Tasks</p>
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-h2 text-swiss-black mb-2">My Tasks</h1>
            <p class="text-body text-swiss-gray-600">All your work items across projects</p>
          </div>
          <div class="flex gap-3" *ngIf="projectId">
            <a [routerLink]="['/projects', projectId, 'board']" class="btn-swiss btn-secondary">
              <mat-icon class="text-lg">dashboard</mat-icon>
              Board View
            </a>
          </div>
        </div>
      </header>

      <main class="max-w-5xl mx-auto">
        @if (!projectId) {
          <!-- No Project Selected -->
          <div class="card-swiss-simple text-center py-swiss-10">
            <mat-icon class="text-6xl text-swiss-gray-200 mb-4">info</mat-icon>
            <h3 class="text-h4 text-swiss-gray-400 mb-2">Select a project to view tasks</h3>
            <p class="text-body text-swiss-gray-400 mb-6">Tasks are scoped per project. Open a project to see its tasks.</p>
            <a routerLink="/projects" class="btn-swiss btn-primary">Go to Projects</a>
          </div>
        } @else {
          <!-- Loading State -->
          @if (isLoading()) {
            <div class="space-y-4">
              @for (i of [1, 2, 3]; track i) {
                <div class="card-swiss-simple">
                  <div class="flex items-center gap-4">
                    <div class="skeleton-swiss w-7 h-7"></div>
                    <div class="flex-1">
                      <div class="skeleton-line w-1/2 h-5 mb-2"></div>
                      <div class="skeleton-line w-1/4 h-4"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <!-- Task List -->
            <div class="card-swiss-simple">
              @for (task of tasks(); track task.id) {
                <div class="task-item">
                  <div class="task-checkbox" [class.checked]="task.status === TaskStatus.DONE"></div>
                  <div class="flex-1">
                    <h3 class="text-body-lg font-medium text-swiss-black m-0">{{ task.title }}</h3>
                    <p class="text-body-sm text-swiss-gray-600 m-0">Task in project {{ projectId }}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span [class]="getStatusClass(task.status)" class="badge-swiss">{{ task.status }}</span>
                    <a [routerLink]="['/projects', projectId]" 
                       class="w-10 h-10 flex items-center justify-center border-2 border-swiss-black hover:bg-swiss-black hover:text-white transition-colors">
                      <mat-icon>open_in_new</mat-icon>
                    </a>
                  </div>
                </div>
              } @empty {
                <div class="py-swiss-8 text-center">
                  <mat-icon class="text-5xl text-swiss-gray-200 mb-4">checklist</mat-icon>
                  <h3 class="text-h4 text-swiss-gray-400 mb-2">No tasks yet</h3>
                  <p class="text-body text-swiss-gray-400">Create tasks from the project details page.</p>
                </div>
              }
            </div>
          }
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

  getStatusClass(status: TaskStatus) {
    switch (status) {
      case TaskStatus.TO_DO: return 'badge-draft';
      case TaskStatus.IN_PROGRESS: return 'badge-progress';
      case TaskStatus.DONE:
      default: return 'badge-completed';
    }
  }
}
