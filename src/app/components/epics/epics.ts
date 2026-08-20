import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';

interface Epic {
  id: string;
  code: string;
  title: string;
  assigneeName: string;
  assigneeInitials: string;
  assigneeColor: string;
  createdBy: string;
  createdAt: string;
  deadline: string;
  description: string;
}
interface Project {
  id: string;
  name: string;
}

@Component({
  selector: 'app-epics',
  imports: [CommonModule, RouterLink],
  templateUrl: './epics.html',
  styleUrl: './epics.css',
})
export class Epics implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private loading = inject(LoadingService);

  isLoading = this.loading.isLoading;
  hasError = signal(false);
  searchQuery = signal('');
  currentPage = signal(1);
  itemsPerPage = 6;
  skeletonItems = Array(6).fill(0);

  projectId = signal('');
  selectedProject = signal<Project | null>(null);
  allEpics = signal<Epic[]>([]);
  selectedEpic = signal<Epic | null>(null);

  filteredEpics = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.allEpics();
    return this.allEpics().filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q) ||
        e.assigneeName.toLowerCase().includes(q),
    );
  });

  totalEpics = computed(() => this.filteredEpics().length);
  totalPages = computed(() => Math.ceil(this.totalEpics() / this.itemsPerPage));
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  paginatedEpics = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredEpics().slice(start, start + this.itemsPerPage);
  });

  ngOnInit(): void {
    console.log('Epics ngOnInit - selected_project:', localStorage.getItem('selected_project'));

    const projectId = this.route.snapshot.params['projectId'];

    if (projectId) {
      // came from clicking a project
      this.projectId.set(projectId);
    } else {
      // came from sidebar — read from localStorage
      const raw = localStorage.getItem('selected_project');
      if (raw) {
        const project = JSON.parse(raw);
        this.projectId.set(project.id);
        this.selectedProject.set(project);
      }
    }

    const raw = localStorage.getItem('selected_project');
    if (raw) {
      this.selectedProject.set(JSON.parse(raw));
    }

    if (this.projectId()) {
      this.loadEpics(this.projectId());
    } else {
      this.router.navigate(['/project']);
    }
  }

  async loadEpics(projectId: string): Promise<void> {
    this.hasError.set(false);

    try {
      const data = await this.api.getProjectEpics(projectId);
      const members = await this.api.getProjectMembers(projectId);
      const currentUser = JSON.parse(localStorage.getItem('taskly_user') || '{}');

      this.allEpics.set(
        data.map((e: any) => {
          const assignee = members.find((m: any) => m.user_id === e.assignee_id);
          const creator = members.find((m: any) => m.user_id === e.created_by);

          return {
            id: e.id,
            code: e.epic_id || `EPIC-${e.id.slice(0, 3).toUpperCase()}`,
            title: e.title,
            assigneeName: assignee?.metadata?.name || currentUser.name || 'Unassigned',
            assigneeInitials: this.getInitials(
              assignee?.metadata?.name || currentUser.name || 'UN',
            ),
            assigneeColor: '#65DCA4',
            createdBy: creator?.metadata?.name || currentUser.name || 'Unknown',
            createdAt: this.formatDate(e.created_at),
            deadline: e.deadline ? this.formatDate(e.deadline) : 'No deadline',
            description: e.description || '',
          };
        }),
      );
    } catch {
      this.hasError.set(true);
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  retry(): void {
    this.loadEpics(this.projectId());
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  openEpic(epic: Epic): void {
    this.selectedEpic.set(epic);
  }

  getInitials(name: string): string {
    if (!name) return 'UN';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  closeEpic(): void {
    this.selectedEpic.set(null);
  }

  addTask(): void {
    this.closeEpic();
    this.router.navigate(['/tasks/new']);
  }

  createEpic(): void {
    this.router.navigate(['/project', this.projectId(), 'epics', 'new']);
  }
}
