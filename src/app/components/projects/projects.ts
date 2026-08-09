import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';
interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

// const MOCK_PROJECTS: Project[] = [
//   {
//     id: '1',
//     name: 'Skyline Residence Phase II',
//     description:
//       'Structural review and aesthetic curation for the high-rise residential complex in the downtown district.',
//     created_at: '12 Oct 2025',
//   },
//   {
//     id: '2',
//     name: 'Skyline Residence Phase II',
//     description:
//       'Structural review and aesthetic curation for the high-rise residential complex in the downtown district.',
//     created_at: '12 Oct 2025',
//   },
//   {
//     id: '3',
//     name: 'Skyline Residence Phase II',
//     description:
//       'Structural review and aesthetic curation for the high-rise residential complex in the downtown district.',
//     created_at: '12 Oct 2025',
//   },
//   {
//     id: '4',
//     name: 'Skyline Residence Phase II',
//     description:
//       'Structural review and aesthetic curation for the high-rise residential complex in the downtown district.',
//     created_at: '12 Oct 2025',
//   },
//   {
//     id: '5',
//     name: 'Skyline Residence Phase II',
//     description:
//       'Structural review and aesthetic curation for the high-rise residential complex in the downtown district.',
//     created_at: '12 Oct 2025',
//   },
// ];

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  private router = inject(Router);
  private api = inject(ApiService);
  private loading = inject(LoadingService);

  // Dummy data for projects
  allProjects = signal<Project[]>([]);

  isLoading = this.loading.isLoading;
  hasError = signal(false);
  currentPage = signal(1);
  itemsPerPage = signal(5);
  totalProjects = computed(() => this.allProjects().length);

  paginatedProjects = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return this.allProjects().slice(start, start + this.itemsPerPage());
  });

  totalPages = computed(() => {
    return Math.ceil(this.allProjects().length / this.itemsPerPage());
  });

  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  skeletonItems = Array(6).fill(0);

  ngOnInit() {
    this.loadProjects();
  }

  async loadProjects(): Promise<void> {
    this.hasError.set(false);
    try {
      const data = await this.api.getProjects();
      this.allProjects.set(
        data.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          created_at: p.created_at,
        })),
      );
    } catch {
      this.hasError.set(true);
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
  retry(): void {
    this.loadProjects();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  openProject(project: Project): void {
    localStorage.setItem('selected_project_id', JSON.stringify(project));
    this.router.navigate(['/project', project.id, 'members']);
  }

  addProject(): void {
    this.router.navigate(['/project/new']);
  }

  createProject(): void {
    this.router.navigate(['/project/new']);
  }
}
