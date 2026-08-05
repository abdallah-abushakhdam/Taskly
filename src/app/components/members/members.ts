import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  color: string;
}

@Component({
  selector: 'app-members',
  imports: [RouterLink, CommonModule],
  templateUrl: './members.html',
  styleUrl: './members.css',
})
export class Members {
  members = signal<Member[]>([
    {
      id: '1',
      name: 'Mahmoud Taha',
      email: 'mahmoud.taha.dev@gmail.com',
      role: 'owner',
      color: '#0D3086',
    },
    {
      id: '2',
      name: 'Sarah Jenkins',
      email: 's.jenkins@workspace.com',
      role: 'admin',
      color: '#00D9A0',
    },
    { id: '3', name: 'David Lee', email: 'd.lee@workspace.com', role: 'member', color: '#4060D0' },
    {
      id: '4',
      name: 'Alisa Mayer',
      email: 'a.mayer@workspace.com',
      role: 'viewer',
      color: '#B0C2E8',
    },
  ]);
  openMenuId = signal<string | null>(null);
  showInviteModal = signal(false);
  inviteEmail = signal('');

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  toggleMenu(id: string): void {
    this.openMenuId.update((currentId) => (currentId === id ? null : id));
  }

  inviteMember(): void {
    this.showInviteModal.set(true);
  }

  closeModal(): void {
    this.showInviteModal.set(false);
  }

  sendInvite(): void {
    this.showInviteModal.set(false);
  }
}
