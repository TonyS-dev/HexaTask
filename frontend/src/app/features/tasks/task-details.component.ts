import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen bg-background p-8">
      <div class="max-w-4xl mx-auto flex items-center justify-between mb-6">
        <a routerLink="/tasks" class="flex items-center gap-2 text-slate-500 hover:text-accent">
          <mat-icon>arrow_back</mat-icon>
          Back to tasks
        </a>
        <mat-chip color="primary" selected>In progress</mat-chip>
      </div>

      <mat-card class="max-w-4xl mx-auto border-none shadow-soft-md rounded-2xl overflow-hidden">
        <mat-card-header class="p-6 pb-2">
          <mat-card-title class="text-2xl font-bold text-primary">Task {{ taskId }}</mat-card-title>
          <p class="text-slate-500">Detailed view with description, comments, attachments, and activity.</p>
        </mat-card-header>
        <mat-card-content class="p-6 pt-0 flex flex-col gap-4">
          <section class="bg-slate-50 rounded-xl p-4">
            <h3 class="text-sm uppercase tracking-wide text-slate-500 mb-2">Description</h3>
            <p class="text-slate-600 mb-0">Add a rich description, acceptance criteria, and links here.</p>
          </section>

          <section class="bg-slate-50 rounded-xl p-4">
            <h3 class="text-sm uppercase tracking-wide text-slate-500 mb-2">Subtasks</h3>
            <p class="text-slate-600 mb-0">Subtasks and checklists will be listed here.</p>
          </section>

          <section class="bg-slate-50 rounded-xl p-4">
            <h3 class="text-sm uppercase tracking-wide text-slate-500 mb-2">Comments</h3>
            <p class="text-slate-600 mb-0">Conversation and mentions appear here.</p>
          </section>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class TaskDetailsComponent {
  private route = inject(ActivatedRoute);
  taskId = this.route.snapshot.paramMap.get('id');
}
