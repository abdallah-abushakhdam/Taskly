import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Skyline Residence Phase II',
    description:
      'Structural review and aesthetic curation for the high-rise residential complex in the downtown district.',
    createdAt: '12 Oct 2025',
  },
  {
    id: '2',
    name: 'Skyline Residence Phase II',
    description:
      'Structural review and aesthetic curation for the high-rise residential complex in the downtown district.',
    createdAt: '12 Oct 2025',
  },
  {
    id: '3',
    name: 'Skyline Residence Phase II',
    description:
      'Structural review and aesthetic curation for the high-rise residential complex in the downtown district.',
    createdAt: '12 Oct 2025',
  },
  {
    id: '4',
    name: 'Skyline Residence Phase II',
    description:
      'Structural review and aesthetic curation for the high-rise residential complex in the downtown district.',
    createdAt: '12 Oct 2025',
  },
  {
    id: '5',
    name: 'Skyline Residence Phase II',
    description:
      'Structural review and aesthetic curation for the high-rise residential complex in the downtown district.',
    createdAt: '12 Oct 2025',
  },
];

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  private router = inject(Router);

  // Dummy data for projects
  allProjects = signal<Project[]>([]);

  isLoading = signal(true);
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

    setTimeout(() => {
      try {
        this.allProjects.set(MOCK_PROJECTS);
        this.isLoading.set(false);
      } catch {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    }, 1500);
  }

  loadProjects() {
    this.isLoading.set(true);
    this.hasError.set(false);
  }

  retry(): void {
    this.loadProjects();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  addProject(): void {
    this.router.navigate(['/project/new']);
  }

  createProject(): void {
    this.router.navigate(['/project/new']);
  }
}
