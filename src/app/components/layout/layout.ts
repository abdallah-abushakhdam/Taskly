import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private api = inject(ApiService);

  collapsed = signal(false);
  mobileMenuOpen = signal(false);
  user = this.api.currentUser;

  get initials(): string {
    const name = this.user()?.name || '';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  toggle(): void {
    this.collapsed.update((v) => !v);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  async logout(): Promise<void> {
    this.api.logout();
  }
}
