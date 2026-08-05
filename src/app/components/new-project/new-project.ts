import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-new-project',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new-project.html',
  styleUrl: './new-project.css',
})
export class NewProject {
  private router = inject(Router);
  private fb = inject(FormBuilder);

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
  onSubmit(): void {
    if (this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Create new project', this.form.value);
    this.router.navigate(['/projects']);
  }
}
