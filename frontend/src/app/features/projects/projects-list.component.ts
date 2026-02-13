import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ProjectService, Project, ProjectStatus } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';

interface ProjectWithTasks extends Project {
  taskCount: number;
}

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
    MatProgressBarModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-swiss-gray-50">
      <!-- Mobile Header -->
      <header class="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b-2 border-swiss-black z-40 flex items-center justify-between px-4">
        <button (click)="toggleMobileMenu()" class="p-2 -ml-2">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="text-lg font-bold uppercase tracking-widest text-swiss-black">HexaTask</span>
        <div class="w-10"></div>
      </header>

      <!-- Mobile Overlay -->
      @if (mobileMenuOpen()) {
        <div class="lg:hidden fixed inset-0 bg-black/50 z-40" (click)="toggleMobileMenu()"></div>
      }

      <!-- Sidebar -->
      <aside [class]="'fixed left-0 top-0 w-60 min-h-screen bg-white border-r-2 border-swiss-black p-swiss-5 flex flex-col z-50 transition-transform duration-300 ' + (mobileMenuOpen() ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')">
        <div class="text-xl font-bold uppercase tracking-widest text-swiss-black mb-swiss-5">
          HexaTask
        </div>
        
        <nav class="space-y-1 flex-1">
          <a routerLink="/dashboard" (click)="closeMobileMenu()"
             class="flex items-center gap-3 px-4 py-3 text-body font-medium text-swiss-gray-600 border-l-4 border-transparent hover:border-swiss-black hover:bg-swiss-gray-50 -ml-1 transition-all duration-200 no-underline">
            <mat-icon class="text-lg">dashboard</mat-icon>
            Dashboard
          </a>
          <a routerLink="/projects" (click)="closeMobileMenu()"
             class="flex items-center gap-3 px-4 py-3 text-body font-medium text-swiss-black border-l-4 border-swiss-black bg-swiss-gray-100 -ml-1 no-underline">
            <mat-icon class="text-lg">folder</mat-icon>
            Projects
          </a>
        </nav>

        <div class="pb-swiss-3">
          <button (click)="onLogout()" 
                  class="flex items-center gap-3 px-4 py-3 text-body font-medium text-swiss-gray-600 hover:text-swiss-black w-full transition-colors">
            <mat-icon class="text-lg">logout</mat-icon>
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="lg:ml-60 p-4 lg:p-swiss-5 pt-18 lg:pt-swiss-5">
        <div class="max-w-6xl">
          <!-- Header -->
          <header class="mb-swiss-8">
            <p class="text-label uppercase tracking-widest text-swiss-gray-600 mb-2">Projects</p>
            <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 class="text-h2 text-swiss-black mb-2">All Projects</h1>
                <p class="text-body text-swiss-gray-600">Browse and manage every initiative in one place</p>
              </div>
              <a routerLink="/projects/new" class="btn-swiss btn-primary w-full sm:w-auto text-center">
                <mat-icon class="text-lg">add</mat-icon>
                New Project
              </a>
            </div>
          </header>

          <!-- Loading State -->
          @if (isLoading()) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-swiss-3">
              @for (i of [1, 2, 3]; track i) {
                <div class="card-swiss-simple p-swiss-5">
                  <div class="skeleton-line w-3/4 h-6 mb-4"></div>
                  <div class="skeleton-line w-full h-4 mb-2"></div>
                  <div class="skeleton-line w-2/3 h-4"></div>
                </div>
              }
            </div>
          } @else {
            <!-- Projects Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-swiss-3">
              @for (project of projects(); track project.id) {
                <div class="card-swiss cursor-pointer" [routerLink]="['/projects', project.id]">
                  <div class="pl-4">
                    <!-- Header -->
                    <div class="flex justify-between items-start mb-4">
                      <h3 class="text-h4 text-swiss-black pr-4">{{ project.name }}</h3>
                      <span [class]="getStatusClass(project.status)" class="badge-swiss flex-shrink-0">
                        {{ project.status }}
                      </span>
                    </div>
                    
                    <!-- Description -->
                    <p class="text-body text-swiss-gray-600 line-clamp-2 mb-4">{{ project.description }}</p>
                    
                    <!-- Task Count -->
                    <div class="flex items-center gap-2 text-body-sm text-swiss-gray-600 mb-4">
                      <mat-icon class="text-sm">task</mat-icon>
                      <span>{{ project.taskCount }} {{ project.taskCount === 1 ? 'task' : 'tasks' }}</span>
                    </div>
                    
                    <!-- Metadata -->
                    <hr class="divider-swiss">
                    <div class="flex items-center justify-between text-body-sm text-swiss-gray-400">
                      <div class="flex items-center">
                        <mat-icon class="text-sm mr-1">schedule</mat-icon>
                        Updated {{ project.updatedAt | date:'mediumDate' }}
                      </div>
                      @if (project.status === 'DRAFT') {
                        <button (click)="$event.stopPropagation(); $event.preventDefault(); onActivate(project)" 
                                class="btn-swiss btn-secondary !py-2 !px-4 text-label">
                          Activate
                        </button>
                      }
                    </div>
                  </div>
                </div>
              } @empty {
                <!-- Empty State -->
                <div class="col-span-full card-swiss-simple text-center py-swiss-10">
                  <mat-icon class="text-6xl text-swiss-gray-200 mb-4">folder_open</mat-icon>
                  <h3 class="text-h4 text-swiss-gray-400 mb-2">No projects yet</h3>
                  <p class="text-body text-swiss-gray-400 mb-6">Create your first project to get started</p>
                  <a routerLink="/projects/new" class="btn-swiss btn-primary">
                    Create Project
                  </a>
                </div>
              }
            </div>
          }
        </div>
      </main>
    </div>
  `
})
export class ProjectsListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  projects = signal<ProjectWithTasks[]>([]);
  isLoading = signal(true);
  mobileMenuOpen = signal(false);

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading.set(true);
    this.projectService.getProjects().pipe(
      switchMap((result) => {
        const projects = result.content;
        
        if (projects.length === 0) {
          return of([]);
        }

        // Fetch task count for each project
        const taskRequests = projects.map(p => 
          this.taskService.getTasks(p.id).pipe(
            catchError(() => of([]))
          )
        );

        return forkJoin(taskRequests).pipe(
          switchMap((allTasks) => {
            const projectsWithTasks: ProjectWithTasks[] = projects.map((project, index) => ({
              ...project,
              taskCount: allTasks[index].length
            }));
            return of(projectsWithTasks);
          })
        );
      })
    ).subscribe({
      next: (projectsWithTasks) => {
        this.projects.set(projectsWithTasks);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getStatusClass(status: ProjectStatus) {
    switch (status) {
      case ProjectStatus.ACTIVE: return 'badge-active';
      case ProjectStatus.DRAFT: return 'badge-draft';
      case ProjectStatus.ARCHIVED:
      default: return 'badge-error';
    }
  }

  onActivate(project: ProjectWithTasks) {
    if (project.taskCount === 0) {
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
  }

  onLogout() {
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
