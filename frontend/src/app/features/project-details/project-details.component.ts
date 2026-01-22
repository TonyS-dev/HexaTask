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
    <div class="min-h-screen bg-background p-8">
      <nav class="max-w-5xl mx-auto mb-8">
        <a routerLink="/dashboard" class="flex items-center text-slate-400 hover:text-accent transition-colors gap-2 no-underline font-medium">
          <mat-icon>arrow_back</mat-icon>
          Back to Dashboard
        </a>
      </nav>

      @if (project(); as p) {
        <header class="max-w-5xl mx-auto mb-12 flex justify-between items-start">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-4xl font-bold text-primary m-0">{{ p.name }}</h1>
              <span [class]="p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'" 
                    class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {{ p.status }}
              </span>
            </div>
            <p class="text-slate-500 text-lg">{{ p.description }}</p>
          </div>
        </header>

        <main class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Task List Column -->
          <div class="lg:col-span-2 flex flex-col gap-6">
            <mat-card class="border-none shadow-soft-md rounded-2xl overflow-hidden">
              <mat-card-header class="p-6 border-b border-slate-50">
                <mat-card-title class="text-xl font-bold text-primary flex items-center gap-2">
                  <mat-icon class="text-accent">assignment</mat-icon>
                  Tasks
                </mat-card-title>
              </mat-card-header>

              <mat-card-content class="p-0">
                @if (isLoadingTasks()) {
                  <mat-progress-bar mode="indeterminate"></mat-progress-bar>
                }

                <mat-selection-list [multiple]="false">
                  @for (task of tasks(); track task.id) {
                    <mat-list-option class="h-auto py-4 border-b border-slate-50 last:border-none"
                                     [disabled]="task.status === 'DONE'"
                                     [selected]="task.status === 'DONE'">
                      <div class="flex items-center justify-between w-full">
                        <div class="flex flex-col gap-1">
                          <span [class.line-through]="task.status === 'DONE'" 
                                [class.text-slate-400]="task.status === 'DONE'"
                                class="text-lg font-semibold text-primary">
                            {{ task.title }}
                          </span>
                          <span class="text-sm text-slate-500">{{ task.description }}</span>
                        </div>
                        
                        <div class="flex items-center gap-4">
                          @if (task.status !== 'DONE') {
                            <button mat-icon-button color="accent" (click)="$event.stopPropagation(); onComplete(task)">
                              <mat-icon>check_circle_outline</mat-icon>
                            </button>
                          } @else {
                            <mat-icon class="text-emerald-500">check_circle</mat-icon>
                          }
                        </div>
                      </div>
                    </mat-list-option>
                  } @empty {
                    <div class="p-20 text-center">
                      <p class="text-slate-400 italic">No tasks yet for this project.</p>
                    </div>
                  }
                </mat-selection-list>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Actions Column -->
          <div class="flex flex-col gap-6">
            <mat-card class="border-none shadow-soft-md rounded-2xl bg-primary text-white p-6">
              <h3 class="text-lg font-bold mb-4">Add Quick Task</h3>
              <form (ngSubmit)="onAddTask()" class="flex flex-col gap-4">
                <mat-form-field appearance="fill" class="dark-form-field">
                  <mat-label class="text-slate-400">Task Title</mat-label>
                  <input matInput [(ngModel)]="newTaskTitle" name="title" required placeholder="e.g. Design Wireframes">
                </mat-form-field>

                <mat-form-field appearance="fill" class="dark-form-field">
                  <mat-label class="text-slate-400">Description</mat-label>
                  <textarea matInput [(ngModel)]="newTaskDescription" name="description" rows="2"></textarea>
                </mat-form-field>

                <button mat-flat-button class="bg-accent h-12 rounded-xl text-lg font-bold hover:bg-accent-dark transition-colors"
                        [disabled]="!newTaskTitle.trim() || isAddingTask()">
                  @if (isAddingTask()) {
                    <mat-icon class="animate-spin">sync</mat-icon>
                  } @else {
                    Add Task
                  }
                </button>
              </form>
            </mat-card>
          </div>
        </main>
      } @else {
        <div class="flex justify-center py-40">
          <mat-spinner diameter="50" color="accent"></mat-spinner>
        </div>
      }
    </div>
  `,
    styles: [`
    :host { display: block; }
    .dark-form-field {
      ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
        background-color: rgba(255, 255, 255, 0.05);
      }
      ::ng-deep .mdc-floating-label { color: rgba(255, 255, 255, 0.5); }
      ::ng-deep .mdc-text-field__input { color: white; }
    }
    ::ng-deep .mat-mdc-selection-list .mat-mdc-list-item-selected {
      background-color: transparent !important;
    }
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
}
