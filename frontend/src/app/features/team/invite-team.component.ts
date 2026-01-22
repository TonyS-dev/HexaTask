import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-background p-8">
      <div class="max-w-3xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Team</p>
            <h1 class="text-3xl font-bold text-primary">Invite teammate</h1>
            <p class="text-slate-500">Send a collaboration invite with a role.</p>
          </div>
          <a mat-stroked-button routerLink="/team" class="rounded-xl">Back to team</a>
        </div>

        <mat-card class="border-none shadow-soft-md rounded-2xl overflow-hidden">
          <mat-card-content class="p-8 flex flex-col gap-6">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-5">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" placeholder="teammate@company.com">
                @if (form.get('email')?.invalid && form.get('email')?.touched) {
                  <mat-error>Valid email required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Role</mat-label>
                <input matInput formControlName="role" placeholder="Designer, Engineer, PM">
              </mat-form-field>

              <div class="flex gap-3 justify-end">
                <a mat-stroked-button routerLink="/team" class="rounded-xl">Cancel</a>
                <button mat-flat-button color="primary" class="bg-accent rounded-xl px-6"
                        [disabled]="form.invalid || isSubmitting()">
                  @if (isSubmitting()) { Sending... } @else { Send invite }
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
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
