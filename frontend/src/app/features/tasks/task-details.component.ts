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
    <div class="min-h-screen bg-swiss-gray-50 p-swiss-5">
      <div class="max-w-4xl mx-auto">
        <!-- Back Navigation -->
        <div class="flex items-center justify-between mb-swiss-4">
          <a routerLink="/tasks" class="inline-flex items-center gap-2 text-body text-swiss-gray-600 hover:text-swiss-black transition-colors no-underline">
            <mat-icon>arrow_back</mat-icon>
            Back to tasks
          </a>
          <span class="badge-swiss badge-progress">In Progress</span>
        </div>

        <!-- Task Card -->
        <div class="card-swiss-simple">
          <h1 class="text-h2 text-swiss-black mb-2">Task {{ taskId }}</h1>
          <p class="text-body text-swiss-gray-600 mb-swiss-5">Detailed view with description, comments, attachments, and activity</p>

          <div class="space-y-swiss-3">
            <section class="bg-swiss-gray-50 border-2 border-swiss-gray-200 p-swiss-4">
              <h3 class="text-label text-swiss-gray-600 mb-2">Description</h3>
              <p class="text-body text-swiss-gray-600 m-0">Add a rich description, acceptance criteria, and links here.</p>
            </section>

            <section class="bg-swiss-gray-50 border-2 border-swiss-gray-200 p-swiss-4">
              <h3 class="text-label text-swiss-gray-600 mb-2">Subtasks</h3>
              <p class="text-body text-swiss-gray-600 m-0">Subtasks and checklists will be listed here.</p>
            </section>

            <section class="bg-swiss-gray-50 border-2 border-swiss-gray-200 p-swiss-4">
              <h3 class="text-label text-swiss-gray-600 mb-2">Comments</h3>
              <p class="text-body text-swiss-gray-600 m-0">Conversation and mentions appear here.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TaskDetailsComponent {
  private route = inject(ActivatedRoute);
  taskId = this.route.snapshot.paramMap.get('id');
}
