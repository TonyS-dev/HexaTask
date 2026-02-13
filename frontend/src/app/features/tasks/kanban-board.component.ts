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
    <div class="min-h-screen bg-swiss-gray-50 p-swiss-5">
      <!-- Header -->
      <header class="max-w-6xl mx-auto mb-swiss-8">
        <p class="text-label uppercase tracking-widest text-swiss-gray-600 mb-2">Tasks</p>
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-h2 text-swiss-black mb-2">Kanban Board</h1>
            <p class="text-body text-swiss-gray-600">Visualize progress across the team</p>
          </div>
          <a [routerLink]="['/projects', projectId, 'tasks']" class="btn-swiss btn-secondary" *ngIf="projectId">
            <mat-icon class="text-lg">view_list</mat-icon>
            List View
          </a>
        </div>
      </header>

      <main class="max-w-6xl mx-auto">
        @if (!projectId) {
          <!-- No Project Selected -->
          <div class="card-swiss-simple text-center py-swiss-10">
            <mat-icon class="text-6xl text-swiss-gray-200 mb-4">info</mat-icon>
            <h3 class="text-h4 text-swiss-gray-400 mb-2">Select a project to view the board</h3>
            <p class="text-body text-swiss-gray-400 mb-6">Kanban view is scoped to a single project.</p>
            <a routerLink="/projects" class="btn-swiss btn-primary">Go to Projects</a>
          </div>
        } @else {
          <!-- Loading State -->
          @if (isLoading()) {
            <div class="grid grid-cols-1 md:grid-cols-3 gap-swiss-3">
              @for (i of [1, 2, 3]; track i) {
                <div class="card-swiss-simple">
                  <div class="skeleton-line w-1/2 h-6 mb-4"></div>
                  <div class="skeleton-line w-full h-20 mb-3"></div>
                  <div class="skeleton-line w-full h-20"></div>
                </div>
              }
            </div>
          } @else {
            <!-- Kanban Columns -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-swiss-3">
              @for (column of columns(); track column.key) {
                <div class="card-swiss-simple !p-0">
                  <!-- Column Header -->
                  <div class="section-header !mb-0 p-swiss-4 border-b-2 border-swiss-black">
                    <h2 class="text-h4 text-swiss-black">{{ column.name }}</h2>
                    <span class="badge-swiss badge-draft">{{ column.items.length }}</span>
                  </div>
                  
                  <!-- Column Content -->
                  <div class="p-swiss-3 space-y-swiss-2 min-h-[200px]">
                    @for (item of column.items; track item.id) {
                      <div class="bg-swiss-gray-50 border-2 border-swiss-gray-200 p-swiss-3 hover:border-swiss-black transition-colors cursor-pointer">
                        <div class="flex justify-between items-start mb-2">
                          <h3 class="text-body font-bold text-swiss-black m-0">{{ item.title }}</h3>
                        </div>
                        <p class="text-body-sm text-swiss-gray-600 m-0">ID: {{ item.id.slice(0, 8) }}...</p>
                      </div>
                    } @empty {
                      <div class="py-swiss-4 text-center">
                        <p class="text-body-sm text-swiss-gray-400 m-0">No items</p>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          }
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
}
