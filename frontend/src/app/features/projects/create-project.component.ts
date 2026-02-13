import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
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
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen bg-swiss-gray-50 p-4 lg:p-swiss-5">
      <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-swiss-8">
          <div>
            <p class="text-label uppercase tracking-widest text-swiss-gray-600 mb-2">Create</p>
            <h1 class="text-h2 text-swiss-black mb-2">New Project</h1>
            <p class="text-body text-swiss-gray-600">Define the essentials to get your initiative started</p>
          </div>
          <a routerLink="/projects" class="btn-swiss btn-secondary w-full sm:w-auto text-center">
            <mat-icon class="text-lg">arrow_back</mat-icon>
            Back
          </a>
        </div>

        <!-- Form Card -->
        <div class="card-swiss-simple">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-swiss-4">
            <div>
              <label class="input-label">Project Name</label>
              <input type="text" 
                     formControlName="name" 
                     placeholder="e.g. Apollo Redesign"
                     class="input-swiss w-full">
              @if (form.get('name')?.invalid && form.get('name')?.touched) {
                <p class="text-body-sm text-swiss-red mt-1">Name is required</p>
              }
            </div>

            <div>
              <label class="input-label">Description</label>
              <textarea formControlName="description" 
                        rows="4" 
                        placeholder="What are we trying to accomplish?"
                        class="input-swiss w-full resize-none"></textarea>
              @if (form.get('description')?.invalid && form.get('description')?.touched) {
                <p class="text-body-sm text-swiss-red mt-1">Description is required</p>
              }
            </div>

            <hr class="divider-swiss-bold">

            <div class="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <a routerLink="/projects" class="btn-swiss btn-secondary text-center">Cancel</a>
              <button type="submit" 
                      class="btn-swiss btn-primary"
                      [disabled]="form.invalid || isSubmitting()">
                @if (isSubmitting()) { Creating... } @else { Create Project }
              </button>
            </div>
          </form>
        </div>
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
