import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(ApiService);

  isLoading = signal(false);
  errorMessage = signal('');
  projectId = signal('');
  projectName = signal('');

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });

  get descCount(): number {
    return this.form.get('description')?.value?.length || 0;
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  ngOnInit(): void {
    const raw = localStorage.getItem('selected_project');
    if (raw) {
      const project = JSON.parse(raw);
      this.projectId.set(project.id);
      this.projectName.set(project.name);
      this.form.patchValue({
        title: project.name,
        description: project.description || '',
      });
    } else {
      this.router.navigate(['/project']);
    }
  }

  back(): void {
    this.router.navigate(['/project']);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      await this.api.updateProject(this.projectId(), {
        name: this.form.value.title,
        description: this.form.value.description,
      });

      // Update localStorage with new project data
      const raw = localStorage.getItem('selected_project');
      if (raw) {
        const project = JSON.parse(raw);
        localStorage.setItem(
          'selected_project',
          JSON.stringify({
            ...project,
            name: this.form.value.title,
            description: this.form.value.description,
          }),
        );
      }

      this.router.navigate(['/project']);
    } catch (err: any) {
      const msg = err.error?.message || 'Something went wrong.';
      this.errorMessage.set(`Failed to update project: ${msg}`);
    } finally {
      this.isLoading.set(false);
    }
  }
}
