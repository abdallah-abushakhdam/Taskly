import { Component, signal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-forgot-pass',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-pass.html',
  styleUrl: './forgot-pass.css',
})
export class ForgotPass {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private interval: ReturnType<typeof setInterval> | null = null;

  sent = signal(false);
  countdown = signal(0);
  isLoading = signal(false);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
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
    await this.api.sendResetLink(this.form.value.email);
    this.isLoading.set(false);
    this.sent.set(true);
    this.startCountdown();
  }

  resend(): void {
    this.api.sendResetLink(this.form.value.email);
    this.startCountdown();
  }

  private startCountdown(): void {
    this.countdown.set(300);
    this.interval = setInterval(() => {
      this.countdown.update((v) => {
        if (v <= 1) {
          clearInterval(this.interval!);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  get formattedCountdown(): string {
    const m = Math.floor(this.countdown() / 60)
      .toString()
      .padStart(2, '0');
    const s = (this.countdown() % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }
}
