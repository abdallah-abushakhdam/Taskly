import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  showPassword = false;
  isLoading = signal(false);
  errorMessage = signal('');

  form: FormGroup = this.fb.group(
    {
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]+$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      jobTitle: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  );

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  get passwordValue(): string {
    return this.form.get('password')?.value || '';
  }

  hasMinLength() {
    return this.passwordValue.length >= 8;
  }
  hasUpperLowerDigit() {
    return (
      /[A-Z]/.test(this.passwordValue) &&
      /[a-z]/.test(this.passwordValue) &&
      /[0-9]/.test(this.passwordValue)
    );
  }
  hasSpecial() {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.passwordValue);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      const { name, email, jobTitle, password } = this.form.value;
      await this.api.register({ name, email, jobTitle, password });
    } catch (err: any) {
      this.errorMessage.set(err.error?.message || 'Something went wrong.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
