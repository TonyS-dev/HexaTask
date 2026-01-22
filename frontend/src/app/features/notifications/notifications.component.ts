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
    <div class="min-h-screen bg-background p-8">
      <header class="max-w-5xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Notifications</p>
          <h1 class="text-3xl font-bold text-primary">Inbox</h1>
          <p class="text-slate-500">Updates from projects, tasks, and team activity.</p>
        </div>
        <button mat-stroked-button class="rounded-xl" (click)="markAllRead()">Mark all read</button>
      </header>

      <main class="max-w-5xl mx-auto flex flex-col gap-3">
        @for (item of notifications(); track item.id) {
          <mat-card class="border-none shadow-soft-sm rounded-2xl">
            <div class="p-4 flex items-start gap-3">
              <mat-icon [color]="item.type === 'alert' ? 'warn' : 'primary'">notifications</mat-icon>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-base font-semibold text-primary m-0">{{ item.title }}</h3>
                  <mat-chip [color]="item.type === 'alert' ? 'warn' : 'primary'" selected>
                    {{ item.type === 'alert' ? 'Alert' : 'Info' }}
                  </mat-chip>
                  <span class="text-xs text-slate-400">{{ item.time }}</span>
                </div>
                <p class="text-slate-600 m-0">{{ item.body }}</p>
              </div>
            </div>
          </mat-card>
        } @empty {
          <div class="py-16 text-center bg-white rounded-3xl shadow-soft-sm">
            <mat-icon class="text-5xl text-slate-200 mb-3">notifications_off</mat-icon>
            <h3 class="text-lg font-semibold text-slate-500">No notifications</h3>
            <p class="text-slate-400">You are all caught up.</p>
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
