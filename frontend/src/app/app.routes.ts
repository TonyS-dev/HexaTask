import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'projects',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/projects/projects-list.component').then(m => m.ProjectsListComponent)
            },
            {
                path: 'new',
                loadComponent: () => import('./features/projects/create-project.component').then(m => m.CreateProjectComponent)
            },
            {
                path: ':id',
                loadComponent: () => import('./features/project-details/project-details.component').then(m => m.ProjectDetailsComponent)
            },
            {
                path: ':id/tasks',
                loadComponent: () => import('./features/tasks/tasks-page.component').then(m => m.TasksPageComponent)
            },
            {
                path: ':id/board',
                loadComponent: () => import('./features/tasks/kanban-board.component').then(m => m.KanbanBoardComponent)
            }
        ]
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
