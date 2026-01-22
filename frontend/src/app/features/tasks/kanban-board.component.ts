import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TaskService, Task, TaskStatus } from '../../core/services/task.service';

@Component({
  selector: 'app-kanban-board',
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
      <header class="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Tasks</p>
          <h1 class="text-3xl font-bold text-primary">Kanban board</h1>
          <p class="text-slate-500">Visualize progress across the team.</p>
        </div>
        <a mat-stroked-button [routerLink]="['/projects', projectId, 'tasks']" class="rounded-xl" *ngIf="projectId">
          <mat-icon class="text-base mr-2">view_list</mat-icon>
          List view
        </a>
      </header>

      <main class="max-w-6xl mx-auto">
        @if (!projectId) {
          <div class="py-16 text-center bg-white rounded-3xl shadow-soft-sm">
            <mat-icon class="text-5xl text-slate-200 mb-3">info</mat-icon>
            <h3 class="text-lg font-semibold text-slate-500">Select a project to view the board</h3>
            <p class="text-slate-400 mb-4">Kanban view is scoped to a single project.</p>
            <a mat-flat-button color="primary" class="bg-accent rounded-xl" routerLink="/projects">Go to projects</a>
          </div>
        } @else {
          @if (isLoading()) {
            <mat-progress-bar mode="indeterminate" class="rounded-full mb-4"></mat-progress-bar>
          }

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @for (column of columns(); track column.key) {
              <mat-card class="border-none shadow-soft-sm rounded-2xl overflow-hidden">
                <mat-card-header class="p-4 border-b border-slate-100 flex justify-between items-center">
                  <mat-card-title class="text-lg font-bold text-primary">{{ column.name }}</mat-card-title>
                  <span class="text-sm text-slate-400">{{ column.items.length }}</span>
                </mat-card-header>
                <mat-card-content class="p-4 flex flex-col gap-3">
                  @for (item of column.items; track item.id) {
                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                      <div class="flex justify-between items-start">
                        <h3 class="text-base font-semibold text-primary m-0">{{ item.title }}</h3>
                        <mat-chip [color]="priorityColor(item.status)" selected>{{ item.status }}</mat-chip>
                      </div>
                      <p class="text-sm text-slate-500 m-0">Task ID: {{ item.id }}</p>
                    </div>
                  } @empty {
                    <p class="text-sm text-slate-400 m-0">No items in this column.</p>
                  }
                </mat-card-content>
              </mat-card>
            }
          </div>
        }
      </main>
    </div>
  `
})
export class KanbanBoardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  projectId: string | null = null;
  tasks = signal<Task[]>([]);
  isLoading = signal(false);

  columns = computed(() => {
    const items = this.tasks();
    return [
      { key: 'todo', name: 'Backlog', items: items.filter(t => t.status === TaskStatus.TO_DO) },
      { key: 'doing', name: 'In Progress', items: items.filter(t => t.status === TaskStatus.IN_PROGRESS) },
      { key: 'done', name: 'Done', items: items.filter(t => t.status === TaskStatus.DONE) }
    ];
  });

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

  priorityColor(status: TaskStatus) {
    switch (status) {
      case TaskStatus.TO_DO: return 'warn';
      case TaskStatus.IN_PROGRESS: return 'primary';
      case TaskStatus.DONE:
      default: return 'accent';
    }
  }
}
