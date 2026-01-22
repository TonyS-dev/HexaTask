import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-bold tracking-tight text-primary mb-2">ProjectNexus</h1>
        <p class="text-slate-500">Create your account to get started</p>
      </div>

      <mat-card class="w-full max-w-md shadow-soft-md border-none overflow-hidden">
        <div class="h-2 bg-success"></div>
        <mat-card-header class="p-8 pb-0">
          <mat-card-title class="text-2xl font-semibold">Create Account</mat-card-title>
        </mat-card-header>

        <mat-card-content class="p-8">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <mat-form-field appearance="fill" class="w-full">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="fullName" placeholder="John Doe">
            </mat-form-field>

            <mat-form-field appearance="fill" class="w-full">
              <mat-label>Email Address</mat-label>
              <input matInput formControlName="email" type="email" placeholder="name@company.com">
              @if (registerForm.get('email')?.hasError('email')) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="fill" class="w-full">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password">
              @if (registerForm.get('password')?.hasError('minlength')) {
                <mat-error>Password must be at least 6 characters</mat-error>
              }
            </mat-form-field>

            <button mat-flat-button color="primary" 
                    class="h-12 text-lg bg-success hover:bg-success-dark transition-colors"
                    [disabled]="registerForm.invalid || isLoading()">
              <div class="flex items-center justify-center gap-2">
                @if (isLoading()) {
                  <mat-spinner diameter="20" color="accent"></mat-spinner>
                  <span>Creating account...</span>
                } @else {
                  <span>Create Account</span>
                }
              </div>
            </button>
          </form>
        </mat-card-content>

        <mat-card-footer class="p-8 pt-0 text-center">
          <p class="text-slate-500 text-sm">
            Already have an account? 
            <a routerLink="/auth/login" class="text-accent font-semibold hover:underline">Sign in</a>
          </p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    :host { display: block; }
    mat-card { border-radius: 1rem !important; }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .mat-mdc-text-field-wrapper::before { display: none !important; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.snackBar.open('Account created successfully!', 'Close', { duration: 3000 });
          // Small delay ensures auth state is fully propagated before navigation
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 0);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackBar.open(err.error?.message || 'Registration failed. Please try again.', 'Close', {
            duration: 5000
          });
        }
      });
    }
  }
}
