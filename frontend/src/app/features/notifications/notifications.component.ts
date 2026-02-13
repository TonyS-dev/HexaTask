import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'alert';
  time: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="min-h-screen bg-swiss-gray-50 p-swiss-5">
      <header class="max-w-5xl mx-auto mb-swiss-8 flex items-start justify-between">
        <div>
          <p class="text-label uppercase tracking-widest text-swiss-gray-600 mb-2">Notifications</p>
          <h1 class="text-h2 text-swiss-black mb-2">Inbox</h1>
          <p class="text-body text-swiss-gray-600">Updates from projects, tasks, and team activity</p>
        </div>
        <button class="btn-swiss btn-secondary" (click)="markAllRead()">Mark All Read</button>
      </header>

      <main class="max-w-5xl mx-auto space-y-swiss-2">
        @for (item of notifications(); track item.id) {
          <div class="card-swiss-simple !p-0 overflow-hidden">
            <div class="flex">
              <!-- Type indicator bar -->
              <div [class]="item.type === 'alert' ? 'bg-swiss-red' : 'bg-swiss-black'" 
                   class="w-2 flex-shrink-0"></div>
              
              <div class="flex items-start gap-4 p-swiss-4 flex-1">
                <mat-icon [class]="item.type === 'alert' ? 'text-swiss-red' : 'text-swiss-black'">
                  {{ item.type === 'alert' ? 'warning' : 'notifications' }}
                </mat-icon>
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-1">
                    <h3 class="text-body-lg font-bold text-swiss-black m-0">{{ item.title }}</h3>
                    <span [class]="item.type === 'alert' ? 'badge-error' : 'badge-active'" class="badge-swiss">
                      {{ item.type === 'alert' ? 'ALERT' : 'INFO' }}
                    </span>
                    <span class="text-body-sm text-swiss-gray-400">{{ item.time }}</span>
                  </div>
                  <p class="text-body text-swiss-gray-600 m-0">{{ item.body }}</p>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="card-swiss-simple text-center py-swiss-10">
            <mat-icon class="text-6xl text-swiss-gray-200 mb-4">notifications_off</mat-icon>
            <h3 class="text-h4 text-swiss-gray-400 mb-2">No notifications</h3>
            <p class="text-body text-swiss-gray-400">You are all caught up</p>
          </div>
        }
      </main>
    </div>
  `
})
export class NotificationsComponent {
  notifications = signal<NotificationItem[]>([
    { id: 'n1', title: 'Task assigned', body: 'You were assigned to "Create wireframes" in Discovery Sprint.', type: 'info', time: '2h ago' },
    { id: 'n2', title: 'Build failed', body: 'CI pipeline failed for Design System. Needs attention.', type: 'alert', time: '5h ago' }
  ]);

  markAllRead() {
    this.notifications.set([]);
  }
}
