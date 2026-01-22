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
    <div class="min-h-screen bg-background p-8">
      <div class="max-w-4xl mx-auto flex items-center justify-between mb-6">
        <a routerLink="/team" class="flex items-center gap-2 text-slate-500 hover:text-accent">
          <mat-icon>arrow_back</mat-icon>
          Back to team
        </a>
        <mat-chip color="primary" selected>Active</mat-chip>
      </div>

      <mat-card class="max-w-4xl mx-auto border-none shadow-soft-md rounded-2xl overflow-hidden">
        <mat-card-header class="p-6 pb-2">
          <mat-card-title class="text-2xl font-bold text-primary">Member {{ userId }}</mat-card-title>
          <p class="text-slate-500">Profile, contact, and role details.</p>
        </mat-card-header>
        <mat-card-content class="p-6 pt-0 flex flex-col gap-4">
          <section class="bg-slate-50 rounded-xl p-4">
            <h3 class="text-sm uppercase tracking-wide text-slate-500 mb-2">Contact</h3>
            <p class="text-slate-600 mb-0">Email and messaging channels appear here.</p>
          </section>

          <section class="bg-slate-50 rounded-xl p-4">
            <h3 class="text-sm uppercase tracking-wide text-slate-500 mb-2">Role & access</h3>
            <p class="text-slate-600 mb-0">Role, permissions, and recent activity.</p>
          </section>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class UserProfileComponent {
  private route = inject(ActivatedRoute);
  userId = this.route.snapshot.paramMap.get('userId');
}
