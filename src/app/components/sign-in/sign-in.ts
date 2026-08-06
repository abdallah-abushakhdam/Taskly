import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  showPassword = false;
  isLoading = signal(false);
  errorMessage = signal('');

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      const { email, password } = this.form.value;
      await this.api.login(email, password);
    } catch (err: any) {
      this.errorMessage.set(err.error?.message || 'Invalid email or password.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
