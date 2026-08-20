import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-new-project',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new-project.html',
  styleUrl: './new-project.css',
})
export class NewProject {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  isLoading = signal(false);
  errorMessage = signal('');

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });

  get title() {
    return this.form.get('title')?.value || '';
  }

  get descriptionValue() {
    return this.form.get('description')?.value || '';
  }

  get descCount() {
    return this.descriptionValue.length;
  }

  isinvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && !!control?.touched);
  }

  back(): void {
    this.router.navigate(['/projects']);
  }
 async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      await this.api.createProject({
        name:        this.form.value.title,
        description: this.form.value.description
      });
      this.router.navigate(['/project']);
    } catch (err: any) {
      this.errorMessage.set(err.error?.message || 'Something went wrong.');
    } finally {
      this.isLoading.set(false);
    }
  }
  }

