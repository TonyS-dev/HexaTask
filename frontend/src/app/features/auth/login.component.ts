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
    <div class="min-h-screen bg-swiss-gray-50 flex flex-col items-center justify-center p-swiss-5">
      <!-- Logo and tagline -->
      <div class="mb-swiss-8 text-center">
        <h1 class="text-h1 text-swiss-black mb-2">HEXATASK</h1>
        <p class="text-body text-swiss-gray-600">Log in to manage your projects</p>
      </div>

      <!-- Login Card -->
      <div class="card-swiss-simple w-full max-w-md">
        <!-- Header accent bar -->
        <div class="h-2 bg-swiss-black -mx-swiss-5 -mt-swiss-5 mb-swiss-5"></div>
        
        <h2 class="text-h3 text-swiss-black mb-swiss-4">Welcome back</h2>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-swiss-3">
          <div>
            <label class="input-label">Email Address</label>
            <input type="email" 
                   formControlName="email" 
                   placeholder="name&#64;company.com"
                   class="input-swiss w-full">
            @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
              <p class="text-body-sm text-swiss-red mt-1">Please enter a valid email</p>
            }
          </div>

          <div>
            <label class="input-label">Password</label>
            <input type="password" 
                   formControlName="password"
                   class="input-swiss w-full">
          </div>

          <button type="submit" 
                  class="btn-swiss btn-primary w-full"
                  [disabled]="loginForm.invalid || isLoading()">
            @if (isLoading()) {
              Authenticating...
            } @else {
              Sign In
            }
          </button>
        </form>

        <hr class="divider-swiss my-swiss-4">

        <p class="text-body text-swiss-gray-600 text-center">
          Don't have an account? 
          <a routerLink="/auth/register" class="link-swiss font-bold">Get started</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
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
