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
    <div class="min-h-screen bg-swiss-gray-50 flex items-center justify-center p-swiss-5">
      <div class="card-swiss-simple w-full max-w-md">
        <!-- Header accent bar -->
        <div class="h-2 bg-swiss-black -mx-swiss-5 -mt-swiss-5 mb-swiss-5"></div>
        
        <h2 class="text-h3 text-swiss-black mb-2">Reset Your Password</h2>
        <p class="text-body text-swiss-gray-600 mb-swiss-4">Enter your email to receive a reset link</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-swiss-3">
          <div>
            <label class="input-label">Email Address</label>
            <input type="email" 
                   formControlName="email" 
                   placeholder="you&#64;company.com"
                   class="input-swiss w-full">
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <p class="text-body-sm text-swiss-red mt-1">Please enter a valid email</p>
            }
          </div>

          <button type="submit" 
                  class="btn-swiss btn-primary w-full"
                  [disabled]="form.invalid || isSubmitting()">
            @if (isSubmitting()) { Sending... } @else { Send Reset Link }
          </button>
        </form>

        <hr class="divider-swiss my-swiss-4">

        <p class="text-body text-swiss-gray-600 text-center">
          <a routerLink="/auth/login" class="link-swiss font-bold">Back to login</a>
        </p>
      </div>
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
