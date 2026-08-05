import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { inject, signal } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
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
  selector: 'app-new-pass',
  imports: [ReactiveFormsModule],
  templateUrl: './new-pass.html',
  styleUrl: './new-pass.css',
})
export class NewPass {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  showPassword = false;
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  form: FormGroup = this.fb.group(
    {
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
    return this.passwordValue.length >= 8 && this.passwordValue.length <= 64;
  }
  hasUppercase() {
    return /[A-Z]/.test(this.passwordValue);
  }
  hasLowercase() {
    return /[a-z]/.test(this.passwordValue);
  }
  hasDigit() {
    return /[0-9]/.test(this.passwordValue);
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
      await this.auth.resetPassword(this.form.value.password);
      this.successMessage.set('Password updated successfully!');
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Something went wrong. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
