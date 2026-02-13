import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen bg-swiss-gray-50 p-swiss-5">
      <div class="max-w-4xl mx-auto">
        <!-- Back Navigation -->
        <div class="flex items-center justify-between mb-swiss-4">
          <a routerLink="/team" class="inline-flex items-center gap-2 text-body text-swiss-gray-600 hover:text-swiss-black transition-colors no-underline">
            <mat-icon>arrow_back</mat-icon>
            Back to team
          </a>
          <span class="badge-swiss badge-active">Active</span>
        </div>

        <!-- Profile Card -->
        <div class="card-swiss-simple">
          <h1 class="text-h2 text-swiss-black mb-2">Member {{ userId }}</h1>
          <p class="text-body text-swiss-gray-600 mb-swiss-5">Profile, contact, and role details</p>

          <div class="space-y-swiss-3">
            <section class="bg-swiss-gray-50 border-2 border-swiss-gray-200 p-swiss-4">
              <h3 class="text-label text-swiss-gray-600 mb-2">Contact</h3>
              <p class="text-body text-swiss-gray-600 m-0">Email and messaging channels appear here.</p>
            </section>

            <section class="bg-swiss-gray-50 border-2 border-swiss-gray-200 p-swiss-4">
              <h3 class="text-label text-swiss-gray-600 mb-2">Role & Access</h3>
              <p class="text-body text-swiss-gray-600 m-0">Role, permissions, and recent activity.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserProfileComponent {
  private route = inject(ActivatedRoute);
  userId = this.route.snapshot.paramMap.get('userId');
}
