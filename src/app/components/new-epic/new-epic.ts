import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Epics } from '../epics/epics';

@Component({
  selector: 'app-new-epic',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new-epic.html',
  styleUrl: './new-epic.css',
})
export class NewEpic {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    descriotion: ['', [Validators.maxLength(500)]],
    assignee: [''],
    deadline: [''],
  });

  get descCount(): number {
    return this.form.get('description')?.value?.length || 0;
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  cancel(): void {
    this.router.navigate(['/epics']);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched;
      return;
    }
    console.log('Create epic:', this.form.value);
    this.router.navigate(['/epics']);
  }
}
