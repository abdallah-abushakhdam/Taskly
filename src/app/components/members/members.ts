import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';
interface Member {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  color: string;
}

interface Project {
  id: string;
  name: string;
}

@Component({
  selector: 'app-members',
  imports: [RouterLink, CommonModule],
  templateUrl: './members.html',
  styleUrl: './members.css',
})
export class Members implements OnInit {
  private api = inject(ApiService);
  private loading = inject(LoadingService);

  isLoading = this.loading.isLoading;
  hasError = signal(false);
  showInviteModal = signal(false);
  inviteEmail = signal('');
  openMenuId = signal<string | null>(null);

  selectedProject = signal<Project | null>(null);
  members = signal<Member[]>([]);

  ngOnInit(): void {
    const raw = localStorage.getItem('selected_project');
    if (raw) {
      const project = JSON.parse(raw);
      this.selectedProject.set(project);
      this.loadMembers(project.id);
    }
  }

  async loadMembers(projectId: string): Promise<void> {
    this.hasError.set(false);
    try {
      const data = await this.api.getProjectMembers(projectId);
      console.log('Members data:', data);
      this.members.set(
        data.map((m: any) => ({
          id: m.id,
          name: m.metadata?.name || m.email,
          email: m.email || '',
          role: m.role?.toLowerCase() || 'member',
          color: this.getColor(m.role),
        })),
      );
    } catch {
      this.hasError.set(true);
    }
  }

  getColor(role: string): string {
    const colors: Record<string, string> = {
      OWNER: '#0D3086',
      ADMIN: '#00D9A0',
      MEMBER: '#4060D0',
      VIEWER: '#B0C2E8',
    };
    return colors[role] || '#4060D0';
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  toggleMenu(id: string): void {
    this.openMenuId.update((current) => (current === id ? null : id));
  }

  inviteMember(): void {
    this.showInviteModal.set(true);
  }

  closeModal(): void {
    this.showInviteModal.set(false);
    this.inviteEmail.set('');
  }

  async sendInvitation(): Promise<void> {
    if (!this.inviteEmail()) return;

    this.isLoading.set(true);
    try {
      await this.api.inviteMember(this.inviteEmail(), this.selectedProject()!.id);
      this.closeModal();
      await this.loadMembers(this.selectedProject()!.id);
    } catch (err: any) {
      console.log('Invite error:', err);
    } finally {
      this.isLoading.set(false);
    }
  }
}
