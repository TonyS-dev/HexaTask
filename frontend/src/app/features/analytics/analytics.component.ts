import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-background p-8">
      <header class="max-w-6xl mx-auto mb-10">
        <p class="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Analytics</p>
        <h1 class="text-3xl font-bold text-primary">Performance insights</h1>
        <p class="text-slate-500">Analytics will be enabled once backend metrics endpoints are available.</p>
      </header>

      <main class="max-w-6xl mx-auto">
        <mat-card class="border-none shadow-soft-sm rounded-2xl">
          <mat-card-content class="p-6 flex items-center gap-3">
            <mat-icon class="text-3xl text-slate-300">insights</mat-icon>
            <div>
              <h3 class="text-lg font-semibold text-primary m-0">Analytics pending</h3>
              <p class="text-slate-500 m-0">Waiting for backend support to surface velocity, cycle time, and quality metrics.</p>
            </div>
          </mat-card-content>
        </mat-card>
      </main>
    </div>
  `
})
export class AnalyticsComponent {}
