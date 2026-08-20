import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { inject, signal } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
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
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

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
    this.successMessage.set('');
    try {
      await this.api.updatePassword(this.form.value.password);
      this.successMessage.set('Password updated successfully!');
      setTimeout(() => this.router.navigate(['/auth/login']), 2000);
    } catch (err: any) {
      this.errorMessage.set(err.error?.message || 'Something went wrong.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
