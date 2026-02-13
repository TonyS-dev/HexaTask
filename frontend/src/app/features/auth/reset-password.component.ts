import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
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
        
        <h2 class="text-h3 text-swiss-black mb-2">Choose a New Password</h2>
        <p class="text-body text-swiss-gray-600 mb-swiss-4">We detected your reset link token. Enter your new password below.</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-swiss-3">
          <div>
            <label class="input-label">New Password</label>
            <input type="password" 
                   formControlName="password" 
                   placeholder="••••••••"
                   class="input-swiss w-full">
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
              <p class="text-body-sm text-swiss-red mt-1">Minimum 6 characters</p>
            }
          </div>

          <div>
            <label class="input-label">Confirm Password</label>
            <input type="password" 
                   formControlName="confirm" 
                   placeholder="••••••••"
                   class="input-swiss w-full">
            @if (form.hasError('mismatch') && form.get('confirm')?.touched) {
              <p class="text-body-sm text-swiss-red mt-1">Passwords must match</p>
            }
          </div>

          <button type="submit" 
                  class="btn-swiss btn-primary w-full"
                  [disabled]="form.invalid || isSubmitting()">
            @if (isSubmitting()) { Updating... } @else { Update Password }
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
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isSubmitting = signal(false);
  token = this.route.snapshot.paramMap.get('token');

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', [Validators.required]]
  }, { validators: this.matchPasswords });

  matchPasswords(group: any) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirm')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isSubmitting.set(true);
    // Backend does not yet provide password reset; inform user without simulating success
    this.isSubmitting.set(false);
    this.snackBar.open('Password reset is not available yet. Please contact an admin.', 'Close', { duration: 5000 });
    this.router.navigate(['/auth/login']);
  }
}
