import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-invite-team',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen bg-swiss-gray-50 p-swiss-5">
      <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-swiss-8">
          <div>
            <p class="text-label uppercase tracking-widest text-swiss-gray-600 mb-2">Team</p>
            <h1 class="text-h2 text-swiss-black mb-2">Invite Teammate</h1>
            <p class="text-body text-swiss-gray-600">Send a collaboration invite with a role</p>
          </div>
          <a routerLink="/team" class="btn-swiss btn-secondary">
            <mat-icon class="text-lg">arrow_back</mat-icon>
            Back
          </a>
        </div>

        <!-- Form Card -->
        <div class="card-swiss-simple">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-swiss-4">
            <div>
              <label class="input-label">Email</label>
              <input type="email" 
                     formControlName="email" 
                     placeholder="teammate&#64;company.com"
                     class="input-swiss w-full">
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <p class="text-body-sm text-swiss-red mt-1">Valid email required</p>
              }
            </div>

            <div>
              <label class="input-label">Role</label>
              <input type="text" 
                     formControlName="role" 
                     placeholder="Designer, Engineer, PM"
                     class="input-swiss w-full">
            </div>

            <hr class="divider-swiss-bold">

            <div class="flex gap-3 justify-end">
              <a routerLink="/team" class="btn-swiss btn-secondary">Cancel</a>
              <button type="submit" 
                      class="btn-swiss btn-primary"
                      [disabled]="form.invalid || isSubmitting()">
                @if (isSubmitting()) { Sending... } @else { Send Invite }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class InviteTeamComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  isSubmitting = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['']
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.snackBar.open('Invite sent successfully.', 'Close', { duration: 3500 });
      this.router.navigate(['/team']);
    }, 700);
  }
}
