import { Component, signal, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-accept-inv',
  imports: [],
  templateUrl: './accept-inv.html',
  styleUrl: './accept-inv.css',
})
export class AcceptInv {
  private api = inject(ApiService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  token = signal('');

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      this.token.set(token);
    } else {
      this.errorMessage.set('Invalid invitation link');
    }
  }

  async acceptInvitation(): Promise<void> {
    if (!this.token()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      await this.api.acceptInvitation(this.token());
      this.successMessage.set('You have successfully joined the project!');
      setTimeout(() => this.router.navigate(['/project']), 2000);
    } catch (err: any) {
      this.errorMessage.set(err.error?.message || 'Failed to accept invitation.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
