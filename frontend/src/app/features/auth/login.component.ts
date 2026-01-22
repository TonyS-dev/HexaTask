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
  selector: 'app-login',
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
        <p class="text-slate-500">Log in to manage your projects</p>
      </div>

      <mat-card class="w-full max-w-md shadow-soft-md border-none overflow-hidden">
        <div class="h-2 bg-accent"></div>
        <mat-card-header class="p-8 pb-0">
          <mat-card-title class="text-2xl font-semibold">Welcome back</mat-card-title>
        </mat-card-header>

        <mat-card-content class="p-8">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <mat-form-field appearance="fill" class="w-full">
              <mat-label>Email Address</mat-label>
              <input matInput formControlName="email" type="email" placeholder="name@company.com">
              @if (loginForm.get('email')?.hasError('email')) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="fill" class="w-full">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password">
            </mat-form-field>

            <button mat-flat-button color="primary" 
                    class="h-12 text-lg bg-accent hover:bg-accent-dark transition-colors"
                    [disabled]="loginForm.invalid || isLoading()">
              <div class="flex items-center justify-center gap-2">
                @if (isLoading()) {
                  <mat-spinner diameter="20" color="accent"></mat-spinner>
                  <span>Authenticating...</span>
                } @else {
                  <span>Sign In</span>
                }
              </div>
            </button>
          </form>
        </mat-card-content>

        <mat-card-footer class="p-8 pt-0 text-center">
          <p class="text-slate-500 text-sm">
            Don't have an account? 
            <a routerLink="/auth/register" class="text-accent font-semibold hover:underline">Get started</a>
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading.set(false);
          // Small delay ensures auth state is fully propagated before navigation
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 0);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackBar.open('Invalid credentials. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['bg-slate-900', 'text-white']
          });
        }
      });
    }
  }
}
