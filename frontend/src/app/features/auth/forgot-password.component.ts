import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-background flex items-center justify-center p-6">
      <mat-card class="w-full max-w-md shadow-soft-md border-none rounded-2xl overflow-hidden">
        <div class="h-2 bg-accent"></div>
        <mat-card-header class="p-8 pb-0">
          <mat-card-title class="text-2xl font-semibold">Reset your password</mat-card-title>
          <p class="text-slate-500">Enter your email to receive a reset link.</p>
        </mat-card-header>

        <mat-card-content class="p-8">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Email Address</mat-label>
              <input matInput formControlName="email" type="email" placeholder="you@company.com">
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <button mat-flat-button color="primary" class="h-12 bg-accent text-lg"
                    [disabled]="form.invalid || isSubmitting()">
              @if (isSubmitting()) { Sending... } @else { Send Reset Link }
            </button>
          </form>
        </mat-card-content>

        <mat-card-footer class="p-8 pt-0 text-center">
          <a routerLink="/auth/login" class="text-accent font-semibold hover:underline">Back to login</a>
        </mat-card-footer>
      </mat-card>
    </div>
  `
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  isSubmitting = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.isSubmitting.set(true);
    // Backend does not yet provide password reset; inform user without mocking a request
    this.isSubmitting.set(false);
    this.snackBar.open('Password reset is not available yet. Please contact an admin.', 'Close', { duration: 5000 });
    this.router.navigate(['/auth/login']);
  }
}
