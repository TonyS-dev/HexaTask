import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'app-create-project',
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
            <p class="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Create</p>
            <h1 class="text-3xl font-bold text-primary">New project</h1>
            <p class="text-slate-500">Define the essentials to get your initiative started.</p>
          </div>
          <a mat-stroked-button color="primary" routerLink="/dashboard" class="rounded-xl">Back to dashboard</a>
        </div>

        <mat-card class="border-none shadow-soft-md rounded-2xl overflow-hidden">
          <mat-card-content class="p-8 flex flex-col gap-6">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-6">
              <mat-form-field appearance="fill" class="w-full">
                <mat-label>Project name</mat-label>
                <input matInput formControlName="name" placeholder="e.g. Apollo Redesign">
                @if (form.get('name')?.invalid && form.get('name')?.touched) {
                  <mat-error>Name is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="fill" class="w-full">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="4" placeholder="What are we trying to accomplish?"></textarea>
                @if (form.get('description')?.invalid && form.get('description')?.touched) {
                  <mat-error>Description is required</mat-error>
                }
              </mat-form-field>

              <div class="flex gap-3 justify-end">
                <a mat-stroked-button routerLink="/dashboard" class="rounded-xl">Cancel</a>
                <button mat-flat-button color="primary" class="bg-accent rounded-xl px-6"
                        [disabled]="form.invalid || isSubmitting()">
                  @if (isSubmitting()) { Creating... } @else { Create project }
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class CreateProjectComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private projectService = inject(ProjectService);

  isSubmitting = signal(false);

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.isSubmitting.set(true);
    const payload = {
      name: this.form.value.name ?? '',
      description: this.form.value.description ?? ''
    };

    this.projectService.createProject(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.snackBar.open('Project created successfully.', 'Close', { duration: 3500 });
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.snackBar.open('Could not create project.', 'Close', { duration: 3500 });
      }
    });
  }
}
