import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ProjectService, Project, ProjectStatus } from '../../core/services/project.service';
import { TaskService, TaskStatus } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';

interface DashboardStats {
    totalProjects: number;
    activeProjects: number;
    draftProjects: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
}

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
             class="flex items-center gap-3 px-4 py-3 text-body font-medium text-swiss-black border-l-4 border-swiss-black bg-swiss-gray-100 -ml-1 no-underline">
            <mat-icon class="text-lg">dashboard</mat-icon>
            Dashboard
          </a>
          <a routerLink="/projects" (click)="closeMobileMenu()"
             class="flex items-center gap-3 px-4 py-3 text-body font-medium text-swiss-gray-600 border-l-4 border-transparent hover:border-swiss-black hover:bg-swiss-gray-50 -ml-1 transition-all duration-200 no-underline">
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
            <p class="text-label uppercase tracking-widest text-swiss-gray-600 mb-2">Dashboard</p>
            <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 class="text-h2 text-swiss-black mb-2">Welcome back{{ userName() ? ', ' + userName() : '' }}!</h1>
                <p class="text-body text-swiss-gray-600">Here's an overview of your workspace</p>
              </div>
              <button (click)="onCreateProject()" 
                      class="btn-swiss btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
                <mat-icon class="text-lg">add</mat-icon>
                New Project
              </button>
            </div>
          </header>

          <!-- Loading State -->
          @if (isLoading()) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-swiss-3 mb-swiss-8">
              @for (i of [1, 2, 3, 4]; track i) {
                <div class="card-swiss-simple p-swiss-5">
                  <div class="skeleton-line w-1/2 h-4 mb-4"></div>
                  <div class="skeleton-line w-3/4 h-8"></div>
                </div>
              }
            </div>
          } @else {
            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-swiss-3 mb-swiss-8">
              <!-- Total Projects -->
              <div class="card-swiss-simple p-swiss-5">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-label uppercase tracking-widest text-swiss-gray-600">Total Projects</span>
                  <mat-icon class="text-swiss-gray-400">folder</mat-icon>
                </div>
                <p class="text-h2 text-swiss-black">{{ stats().totalProjects }}</p>
              </div>
              
              <!-- Active Projects -->
              <div class="card-swiss-simple p-swiss-5">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-label uppercase tracking-widest text-swiss-gray-600">Active</span>
                  <mat-icon class="text-green-600">check_circle</mat-icon>
                </div>
                <p class="text-h2 text-swiss-black">{{ stats().activeProjects }}</p>
              </div>
              
              <!-- Draft Projects -->
              <div class="card-swiss-simple p-swiss-5">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-label uppercase tracking-widest text-swiss-gray-600">Drafts</span>
                  <mat-icon class="text-swiss-gray-400">edit_note</mat-icon>
                </div>
                <p class="text-h2 text-swiss-black">{{ stats().draftProjects }}</p>
              </div>
              
              <!-- Total Tasks -->
              <div class="card-swiss-simple p-swiss-5">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-label uppercase tracking-widest text-swiss-gray-600">Total Tasks</span>
                  <mat-icon class="text-swiss-gray-400">task</mat-icon>
                </div>
                <p class="text-h2 text-swiss-black">{{ stats().totalTasks }}</p>
              </div>
            </div>

            <!-- Task Progress Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-swiss-3 mb-swiss-8">
              <!-- Task Progress -->
              <div class="card-swiss-simple p-swiss-5">
                <h3 class="text-h4 text-swiss-black mb-4">Task Progress</h3>
                @if (stats().totalTasks > 0) {
                  <div class="space-y-4">
                    <div>
                      <div class="flex justify-between text-body-sm mb-2">
                        <span class="text-swiss-gray-600">Completed</span>
                        <span class="text-swiss-black font-medium">{{ stats().completedTasks }} / {{ stats().totalTasks }}</span>
                      </div>
                      <div class="w-full bg-swiss-gray-100 h-3 border border-swiss-black">
                        <div class="bg-swiss-black h-full transition-all duration-300" 
                             [style.width.%]="completionPercentage()"></div>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-4 sm:gap-6">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 bg-swiss-black border border-swiss-black"></div>
                        <span class="text-body-sm text-swiss-gray-600">Done ({{ stats().completedTasks }})</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 bg-swiss-gray-300 border border-swiss-black"></div>
                        <span class="text-body-sm text-swiss-gray-600">In Progress ({{ stats().inProgressTasks }})</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 bg-white border border-swiss-black"></div>
                        <span class="text-body-sm text-swiss-gray-600">To Do ({{ stats().totalTasks - stats().completedTasks - stats().inProgressTasks }})</span>
                      </div>
                    </div>
                  </div>
                } @else {
                  <p class="text-body text-swiss-gray-400">No tasks yet. Create a project and add some tasks to track progress.</p>
                }
              </div>

              <!-- Quick Actions -->
              <div class="card-swiss-simple p-swiss-5">
                <h3 class="text-h4 text-swiss-black mb-4">Quick Actions</h3>
                <div class="space-y-3">
                  <a routerLink="/projects/new" class="flex items-center gap-3 p-3 border-2 border-swiss-black hover:bg-swiss-gray-50 transition-colors no-underline">
                    <mat-icon class="text-swiss-black">add</mat-icon>
                    <span class="text-body text-swiss-black">Create new project</span>
                  </a>
                  <a routerLink="/projects" class="flex items-center gap-3 p-3 border-2 border-swiss-black hover:bg-swiss-gray-50 transition-colors no-underline">
                    <mat-icon class="text-swiss-black">folder_open</mat-icon>
                    <span class="text-body text-swiss-black">View all projects</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Recent Projects -->
            @if (recentProjects().length > 0) {
              <div class="mb-swiss-8">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-h4 text-swiss-black">Recent Projects</h3>
                  <a routerLink="/projects" class="text-body text-swiss-gray-600 hover:text-swiss-black no-underline">View all</a>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-swiss-3">
                  @for (project of recentProjects(); track project.id) {
                    <div class="card-swiss cursor-pointer" [routerLink]="['/projects', project.id]">
                      <div class="pl-4">
                        <div class="flex justify-between items-start mb-4">
                          <h3 class="text-h4 text-swiss-black pr-4">{{ project.name }}</h3>
                          <span [class]="getStatusClass(project.status)" class="badge-swiss flex-shrink-0">
                            {{ project.status }}
                          </span>
                        </div>
                        <p class="text-body text-swiss-gray-600 line-clamp-2 mb-4">{{ project.description }}</p>
                        <hr class="divider-swiss">
                        <div class="flex items-center text-body-sm text-swiss-gray-400">
                          <mat-icon class="text-sm mr-1">schedule</mat-icon>
                          Updated {{ project.updatedAt | date:'mediumDate' }}
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            } @else {
              <!-- Empty State -->
              <div class="card-swiss-simple text-center py-swiss-10">
                <mat-icon class="text-6xl text-swiss-gray-200 mb-4">folder_open</mat-icon>
                <h3 class="text-h4 text-swiss-gray-400 mb-2">No projects yet</h3>
                <p class="text-body text-swiss-gray-400 mb-6">Start by creating your first project</p>
                <button (click)="onCreateProject()" class="btn-swiss btn-primary">
                  Create Project
                </button>
              </div>
            }
          }
        </div>
      </main>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class DashboardComponent implements OnInit {
    private projectService = inject(ProjectService);
    private taskService = inject(TaskService);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);
    authService = inject(AuthService);

    projects = signal<Project[]>([]);
    stats = signal<DashboardStats>({
        totalProjects: 0,
        activeProjects: 0,
        draftProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0
    });
    isLoading = signal(true);
    mobileMenuOpen = signal(false);

    recentProjects = computed(() => this.projects().slice(0, 3));
    completionPercentage = computed(() => {
        const s = this.stats();
        return s.totalTasks > 0 ? (s.completedTasks / s.totalTasks) * 100 : 0;
    });
    userName = computed(() => {
        const user = this.authService.currentUser();
        if (user?.fullName) {
            return user.fullName.split(' ')[0]; // Get first name
        }
        return '';
    });

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.isLoading.set(true);
        this.projectService.getProjects().pipe(
            switchMap((result) => {
                const projects = result.content;
                this.projects.set(projects);

                // Calculate project stats
                const activeProjects = projects.filter(p => p.status === ProjectStatus.ACTIVE).length;
                const draftProjects = projects.filter(p => p.status === ProjectStatus.DRAFT).length;

                if (projects.length === 0) {
                    this.stats.set({
                        totalProjects: 0,
                        activeProjects: 0,
                        draftProjects: 0,
                        totalTasks: 0,
                        completedTasks: 0,
                        inProgressTasks: 0
                    });
                    return of(null);
                }

                // Fetch tasks for each project
                const taskRequests = projects.map(p => 
                    this.taskService.getTasks(p.id).pipe(catchError(() => of([])))
                );

                return forkJoin(taskRequests).pipe(
                    switchMap((allTasks) => {
                        const flatTasks = allTasks.flat();
                        const completedTasks = flatTasks.filter(t => t.status === TaskStatus.DONE).length;
                        const inProgressTasks = flatTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;

                        this.stats.set({
                            totalProjects: projects.length,
                            activeProjects,
                            draftProjects,
                            totalTasks: flatTasks.length,
                            completedTasks,
                            inProgressTasks
                        });

                        return of(null);
                    })
                );
            })
        ).subscribe({
            next: () => this.isLoading.set(false),
            error: () => this.isLoading.set(false)
        });
    }

    getStatusClass(status: ProjectStatus) {
        switch (status) {
            case ProjectStatus.ACTIVE: return 'badge-active';
            case ProjectStatus.DRAFT: return 'badge-draft';
            case ProjectStatus.ARCHIVED: return 'badge-error';
            default: return 'badge-draft';
        }
    }

    onCreateProject() {
        this.router.navigate(['/projects/new']);
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
