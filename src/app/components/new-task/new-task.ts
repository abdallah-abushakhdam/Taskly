import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-task',
  imports: [ReactiveFormsModule],
  templateUrl: './new-task.html',
  styleUrl: './new-task.css',
})
export class NewTask {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    status: ['', [Validators.required]],
    assignee: [''],
    epic: [''],
    dueDate: [''],
    discription: [''],
  });

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  back(): void {
    this.router.navigate(['/epics']);
  }
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Create task:', this.form.value);
    this.router.navigate(['/tasks']);
  }
}
