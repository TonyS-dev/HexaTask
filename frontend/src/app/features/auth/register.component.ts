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
    <div class="min-h-screen bg-swiss-gray-50 flex flex-col items-center justify-center p-swiss-5">
      <!-- Logo and tagline -->
      <div class="mb-swiss-8 text-center">
        <h1 class="text-h1 text-swiss-black mb-2">HEXATASK</h1>
        <p class="text-body text-swiss-gray-600">Create your account to get started</p>
      </div>

      <!-- Register Card -->
      <div class="card-swiss-simple w-full max-w-md">
        <!-- Header accent bar -->
        <div class="h-2 bg-success -mx-swiss-5 -mt-swiss-5 mb-swiss-5"></div>
        
        <h2 class="text-h3 text-swiss-black mb-swiss-4">Create Account</h2>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-swiss-3">
          <div>
            <label class="input-label">Full Name</label>
            <input type="text" 
                   formControlName="fullName" 
                   placeholder="John Doe"
                   class="input-swiss w-full">
          </div>

          <div>
            <label class="input-label">Email Address</label>
            <input type="email" 
                   formControlName="email" 
                   placeholder="name&#64;company.com"
                   class="input-swiss w-full">
            @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
              <p class="text-body-sm text-swiss-red mt-1">Please enter a valid email</p>
            }
          </div>

          <div>
            <label class="input-label">Password</label>
            <input type="password" 
                   formControlName="password"
                   class="input-swiss w-full">
            @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
              <p class="text-body-sm text-swiss-red mt-1">Password must be at least 6 characters</p>
            }
          </div>

          <button type="submit" 
                  class="btn-swiss btn-primary w-full"
                  [disabled]="registerForm.invalid || isLoading()">
            @if (isLoading()) {
              Creating account...
            } @else {
              Create Account
            }
          </button>
        </form>

        <hr class="divider-swiss my-swiss-4">

        <p class="text-body text-swiss-gray-600 text-center">
          Already have an account? 
          <a routerLink="/auth/login" class="link-swiss font-bold">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
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
          const errorMessage = err.error?.detail || err.error?.message || 'Registration failed. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000
          });
        }
      });
    }
  }
}
