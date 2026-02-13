import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectService, Project } from '../../core/services/project.service';
import { TaskService, Task, TaskStatus } from '../../core/services/task.service';

@Component({
    selector: 'app-project-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSnackBarModule
    ],
    template: `
    <div class="min-h-screen bg-swiss-gray-50 p-4 lg:p-swiss-5">
      <!-- Back Navigation -->
      <nav class="max-w-5xl mx-auto mb-swiss-4">
        <a routerLink="/projects" 
           class="inline-flex items-center gap-2 text-body text-swiss-gray-600 hover:text-swiss-black transition-colors no-underline">
          <mat-icon>arrow_back</mat-icon>
          Back to Projects
        </a>
      </nav>

      @if (project(); as p) {
        <!-- Project Header -->
        <header class="max-w-5xl mx-auto mb-swiss-8">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div class="flex flex-wrap items-center gap-3 mb-2">
                <h1 class="text-h2 text-swiss-black">{{ p.name }}</h1>
                <span [class]="p.status === 'ACTIVE' ? 'badge-active' : 'badge-draft'" class="badge-swiss">
                  {{ p.status }}
                </span>
              </div>
              <p class="text-body-lg text-swiss-gray-600">{{ p.description }}</p>
            </div>
          </div>
        </header>

        <main class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-swiss-4">
          <!-- Task List Column -->
          <div class="lg:col-span-2">
            <div class="card-swiss-simple">
              <!-- Section Header -->
              <div class="section-header">
                <div class="flex items-center gap-3">
                  <mat-icon class="text-swiss-black">assignment</mat-icon>
                  <h2 class="text-h4 text-swiss-black">Tasks</h2>
                </div>
                <span class="badge-swiss badge-draft">{{ tasks().length }} items</span>
              </div>

              <!-- Loading State -->
              @if (isLoadingTasks()) {
                <div class="space-y-4">
                  @for (i of [1, 2, 3]; track i) {
                    <div class="task-item">
                      <div class="skeleton-swiss w-7 h-7"></div>
                      <div class="flex-1">
                        <div class="skeleton-line w-2/3 h-5 mb-2"></div>
                        <div class="skeleton-line w-1/3 h-4"></div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <!-- Task Items -->
                @for (task of tasks(); track task.id) {
                  <div class="task-item flex-col sm:flex-row items-start sm:items-center">
                    <div class="flex items-center gap-3 w-full sm:w-auto sm:flex-1">
                      <div class="task-checkbox flex-shrink-0" 
                           [class.checked]="task.status === 'DONE'"
                           (click)="task.status !== 'DONE' && onComplete(task)">
                      </div>
                      <div class="flex-1 min-w-0">
                        <span [class.line-through]="task.status === 'DONE'" 
                              [class.text-swiss-gray-400]="task.status === 'DONE'"
                              class="text-body-lg font-medium text-swiss-black break-words">
                          {{ task.title }}
                        </span>
                        @if (task.description) {
                          <p class="text-body-sm text-swiss-gray-600 mt-1 break-words">{{ task.description }}</p>
                        }
                      </div>
                    </div>
                    <div class="flex items-center gap-2 mt-3 sm:mt-0 sm:ml-3 flex-shrink-0">
                      @if (task.status === 'TO_DO') {
                        <button (click)="onStartProgress(task)" 
                                class="btn-swiss btn-secondary !py-1 !px-3 text-label">
                          Start
                        </button>
                      }
                      @if (task.status === 'IN_PROGRESS') {
                        <button (click)="onComplete(task)" 
                                class="btn-swiss btn-primary !py-1 !px-3 text-label">
                          Complete
                        </button>
                      }
                      <span [class]="getTaskStatusClass(task.status)" class="badge-swiss">
                        {{ task.status === 'TO_DO' ? 'TO DO' : (task.status === 'IN_PROGRESS' ? 'IN PROGRESS' : 'DONE') }}
                      </span>
                    </div>
                  </div>
                } @empty {
                  <div class="py-swiss-8 text-center">
                    <mat-icon class="text-5xl text-swiss-gray-200 mb-4">checklist</mat-icon>
                    <p class="text-body text-swiss-gray-400">No tasks yet for this project</p>
                  </div>
                }
              }
            </div>
          </div>

          <!-- Actions Column -->
          <div class="space-y-swiss-4">
            <!-- Add Task Card -->
            <div class="card-swiss-simple bg-swiss-black !border-0">
              <h3 class="text-h4 text-white mb-swiss-4">Add Quick Task</h3>
              <form (ngSubmit)="onAddTask()" class="space-y-swiss-3">
                <div>
                  <label class="input-label text-swiss-gray-400">Task Title</label>
                  <input type="text" 
                         [(ngModel)]="newTaskTitle" 
                         name="title" 
                         required 
                         placeholder="e.g. Design Wireframes"
                         class="input-swiss w-full">
                </div>

                <div>
                  <label class="input-label text-swiss-gray-400">Description</label>
                  <textarea [(ngModel)]="newTaskDescription" 
                            name="description" 
                            rows="3"
                            placeholder="Optional description..."
                            class="input-swiss w-full resize-none"></textarea>
                </div>

                <button type="submit" 
                        class="btn-swiss w-full !bg-white !text-swiss-black !border-white hover:!bg-swiss-gray-100"
                        [disabled]="!newTaskTitle.trim() || isAddingTask()">
                  @if (isAddingTask()) {
                    Adding...
                  } @else {
                    Add Task
                  }
                </button>
              </form>
            </div>

            <!-- Quick Stats -->
            <div class="card-swiss-simple">
              <h3 class="text-h4 text-swiss-black mb-swiss-3">Statistics</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-swiss-gray-200">
                  <span class="text-body text-swiss-gray-600">Total Tasks</span>
                  <span class="text-body font-bold text-swiss-black">{{ tasks().length }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-swiss-gray-200">
                  <span class="text-body text-swiss-gray-600">Completed</span>
                  <span class="text-body font-bold text-success">{{ getCompletedCount() }}</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-body text-swiss-gray-600">In Progress</span>
                  <span class="text-body font-bold text-warning">{{ getInProgressCount() }}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      } @else {
        <!-- Loading Project -->
        <div class="flex flex-col items-center justify-center py-swiss-10">
          <div class="skeleton-swiss w-16 h-16 mb-4"></div>
          <p class="text-body text-swiss-gray-400">Loading project...</p>
        </div>
      }
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class ProjectDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private projectService = inject(ProjectService);
    private taskService = inject(TaskService);
    private snackBar = inject(MatSnackBar);

    project = signal<Project | null>(null);
    tasks = signal<Task[]>([]);
    isLoadingTasks = signal(true);
    isAddingTask = signal(false);

    newTaskTitle = '';
    newTaskDescription = '';

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadProject(id);
            this.loadTasks(id);
        }
    }

    loadProject(id: string) {
        this.projectService.getProject(id).subscribe(p => this.project.set(p));
    }

    loadTasks(projectId: string) {
        this.isLoadingTasks.set(true);
        this.taskService.getTasks(projectId).subscribe({
            next: (val) => {
                this.tasks.set(val);
                this.isLoadingTasks.set(false);
            },
            error: () => this.isLoadingTasks.set(false)
        });
    }

    getTaskStatusClass(status: TaskStatus): string {
        switch (status) {
            case TaskStatus.DONE: return 'badge-completed';
            case TaskStatus.IN_PROGRESS: return 'badge-progress';
            case TaskStatus.TO_DO:
            default: return 'badge-draft';
        }
    }

    getCompletedCount(): number {
        return this.tasks().filter(t => t.status === TaskStatus.DONE).length;
    }

    getInProgressCount(): number {
        return this.tasks().filter(t => t.status === TaskStatus.IN_PROGRESS).length;
    }

    onAddTask() {
        const p = this.project();
        if (!p || !this.newTaskTitle.trim()) return;

        this.isAddingTask.set(true);
        this.taskService.createTask({
            projectId: p.id,
            title: this.newTaskTitle,
            description: this.newTaskDescription
        }).subscribe({
            next: () => {
                this.isAddingTask.set(false);
                this.snackBar.open(`Task "${this.newTaskTitle}" created successfully!`, 'Close', {
                    duration: 3500
                });
                this.newTaskTitle = '';
                this.newTaskDescription = '';
                this.loadTasks(p.id);
            },
            error: () => {
                this.isAddingTask.set(false);
                this.snackBar.open('Failed to create task.', 'Close', { duration: 3500 });
            }
        });
    }

    onComplete(task: Task) {
        this.taskService.updateTaskStatus(task.id, TaskStatus.DONE).subscribe({
            next: () => {
                this.snackBar.open(`Task "${task.title}" marked as complete!`, 'Close', {
                    duration: 3500
                });
                this.loadTasks(task.projectId);
            },
            error: () => {
                this.snackBar.open('Failed to update task status.', 'Close', { duration: 3500 });
            }
        });
    }

    onStartProgress(task: Task) {
        this.taskService.updateTaskStatus(task.id, TaskStatus.IN_PROGRESS).subscribe({
            next: () => {
                this.snackBar.open(`Task "${task.title}" is now in progress!`, 'Close', {
                    duration: 3500
                });
                this.loadTasks(task.projectId);
            },
            error: () => {
                this.snackBar.open('Failed to update task status.', 'Close', { duration: 3500 });
            }
        });
    }
}
