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
    <div class="min-h-screen bg-swiss-gray-50 p-swiss-5">
      <header class="max-w-5xl mx-auto flex justify-between items-start mb-swiss-8">
        <div>
          <p class="text-label uppercase tracking-widest text-swiss-gray-600 mb-2">Team</p>
          <h1 class="text-h2 text-swiss-black mb-2">Team Members</h1>
          <p class="text-body text-swiss-gray-600">Manage collaborators and their access</p>
        </div>
        <a routerLink="/team/invite" class="btn-swiss btn-primary">
          <mat-icon class="text-lg">person_add</mat-icon>
          Invite Member
        </a>
      </header>

      <main class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-swiss-3">
        @for (member of members(); track member.id) {
          <div class="card-swiss-simple">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-h4 text-swiss-black mb-1">{{ member.name }}</h3>
                <p class="text-body text-swiss-gray-600 mb-1">{{ member.role }}</p>
                <p class="text-body-sm text-swiss-gray-400 m-0">{{ member.email }}</p>
              </div>
              <div class="flex items-center gap-3">
                <span [class]="member.status === 'ACTIVE' ? 'badge-active' : 'badge-draft'" class="badge-swiss">
                  {{ member.status }}
                </span>
                <a [routerLink]="['/team', member.id, 'profile']" 
                   class="w-10 h-10 flex items-center justify-center border-2 border-swiss-black hover:bg-swiss-black hover:text-white transition-colors">
                  <mat-icon>open_in_new</mat-icon>
                </a>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-full card-swiss-simple text-center py-swiss-10">
            <mat-icon class="text-6xl text-swiss-gray-200 mb-4">group</mat-icon>
            <h3 class="text-h4 text-swiss-gray-400 mb-2">No team members yet</h3>
            <p class="text-body text-swiss-gray-400 mb-6">Invite teammates to collaborate</p>
            <a routerLink="/team/invite" class="btn-swiss btn-primary">Invite Now</a>
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
