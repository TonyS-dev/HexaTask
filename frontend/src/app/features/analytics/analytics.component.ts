import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-swiss-gray-50 p-swiss-5">
      <header class="max-w-5xl mx-auto mb-swiss-8">
        <p class="text-label uppercase tracking-widest text-swiss-gray-600 mb-2">Analytics</p>
        <h1 class="text-h2 text-swiss-black mb-2">Performance Insights</h1>
        <p class="text-body text-swiss-gray-600">Analytics will be enabled once backend metrics endpoints are available</p>
      </header>

      <main class="max-w-5xl mx-auto">
        <div class="card-swiss-simple">
          <div class="flex items-center gap-4">
            <mat-icon class="text-4xl text-swiss-gray-200">insights</mat-icon>
            <div>
              <h3 class="text-h4 text-swiss-black mb-1">Analytics Pending</h3>
              <p class="text-body text-swiss-gray-600 m-0">Waiting for backend support to surface velocity, cycle time, and quality metrics.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class AnalyticsComponent {}
