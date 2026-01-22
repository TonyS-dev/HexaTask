import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'ACTIVE' | 'INVITED';
}

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="min-h-screen bg-background p-8">
      <header class="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Team</p>
          <h1 class="text-3xl font-bold text-primary">Team members</h1>
          <p class="text-slate-500">Manage collaborators and their access.</p>
        </div>
        <a mat-flat-button color="primary" class="bg-accent rounded-xl" routerLink="/team/invite">
          <mat-icon class="text-base mr-2">person_add</mat-icon>
          Invite member
        </a>
      </header>

      <main class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (member of members(); track member.id) {
          <mat-card class="border-none shadow-soft-sm rounded-2xl overflow-hidden">
            <div class="p-4 flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-primary m-0">{{ member.name }}</h3>
                <p class="text-sm text-slate-500 m-0">{{ member.role }}</p>
                <p class="text-sm text-slate-400 m-0">{{ member.email }}</p>
              </div>
              <div class="flex items-center gap-3">
                <mat-chip [color]="member.status === 'ACTIVE' ? 'primary' : 'warn'" selected>{{ member.status }}</mat-chip>
                <a mat-icon-button [routerLink]="['/team', member.id, 'profile']" aria-label="View profile">
                  <mat-icon>open_in_new</mat-icon>
                </a>
              </div>
            </div>
          </mat-card>
        } @empty {
          <div class="py-16 text-center bg-white rounded-3xl shadow-soft-sm">
            <mat-icon class="text-5xl text-slate-200 mb-3">group</mat-icon>
            <h3 class="text-lg font-semibold text-slate-500">No team members yet</h3>
            <p class="text-slate-400 mb-4">Invite teammates to collaborate.</p>
            <a mat-flat-button color="primary" class="bg-accent rounded-xl" routerLink="/team/invite">Invite now</a>
          </div>
        }
      </main>
    </div>
  `
})
export class TeamMembersComponent {
  members = signal<Member[]>([
    { id: 'u1', name: 'Alex Carter', role: 'Product Owner', email: 'alex@example.com', status: 'ACTIVE' },
    { id: 'u2', name: 'Priya Sharma', role: 'Engineering Lead', email: 'priya@example.com', status: 'ACTIVE' },
    { id: 'u3', name: 'Jamie Lee', role: 'Designer', email: 'jamie@example.com', status: 'INVITED' }
  ]);
}
