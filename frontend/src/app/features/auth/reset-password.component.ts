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
    <div class="min-h-screen bg-background flex items-center justify-center p-6">
      <mat-card class="w-full max-w-md shadow-soft-md border-none rounded-2xl overflow-hidden">
        <div class="h-2 bg-accent"></div>
        <mat-card-header class="p-8 pb-0">
          <mat-card-title class="text-2xl font-semibold">Choose a new password</mat-card-title>
          <p class="text-slate-500">We detected your reset link token. Enter your new password below.</p>
        </mat-card-header>

        <mat-card-content class="p-8">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>New password</mat-label>
              <input matInput formControlName="password" type="password" placeholder="••••••••">
              @if (form.get('password')?.invalid && form.get('password')?.touched) {
                <mat-error>Minimum 6 characters</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Confirm password</mat-label>
              <input matInput formControlName="confirm" type="password" placeholder="••••••••">
              @if (form.hasError('mismatch') && form.get('confirm')?.touched) {
                <mat-error>Passwords must match</mat-error>
              }
            </mat-form-field>

            <button mat-flat-button color="primary" class="h-12 bg-accent text-lg"
                    [disabled]="form.invalid || isSubmitting()">
              @if (isSubmitting()) { Updating... } @else { Update Password }
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
