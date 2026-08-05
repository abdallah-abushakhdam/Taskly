import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, single } from 'rxjs';

interface Epic {
  id: string;
  code: string;
  title: string;
  assigneeName: string;
  assigneeInitials: string;
  assigneeColor: string;
  createdBy: string;
  createdAt: string;
}

const MOCK_EPICS: Epic[] = [
  {
    id: '1',
    code: 'EPIC-102',
    title: 'Sustainable Materials Integration',
    assigneeName: 'Alice Moore',
    assigneeInitials: 'AM',
    assigneeColor: '#65DCA4',
    createdBy: 'Sarah Jenkins',
    createdAt: '22 Oct 2025',
  },
  {
    id: '2',
    code: 'EPIC-102',
    title: 'Sustainable Materials Integration',
    assigneeName: 'Alice Moore',
    assigneeInitials: 'AM',
    assigneeColor: '#65DCA4',
    createdBy: 'Sarah Jenkins',
    createdAt: '22 Oct 2025',
  },
  {
    id: '3',
    code: 'EPIC-102',
    title: 'Sustainable Materials Integration',
    assigneeName: 'Alice Moore',
    assigneeInitials: 'AM',
    assigneeColor: '#65DCA4',
    createdBy: 'Sarah Jenkins',
    createdAt: '22 Oct 2025',
  },
  {
    id: '4',
    code: 'EPIC-102',
    title: 'Sustainable Materials Integration',
    assigneeName: 'Alice Moore',
    assigneeInitials: 'AM',
    assigneeColor: '#65DCA4',
    createdBy: 'Sarah Jenkins',
    createdAt: '22 Oct 2025',
  },
  {
    id: '5',
    code: 'EPIC-102',
    title: 'Sustainable Materials Integration',
    assigneeName: 'Alice Moore',
    assigneeInitials: 'AM',
    assigneeColor: '#65DCA4',
    createdBy: 'Sarah Jenkins',
    createdAt: '22 Oct 2025',
  },
  {
    id: '6',
    code: 'EPIC-102',
    title: 'Sustainable Materials Integration',
    assigneeName: 'Alice Moore',
    assigneeInitials: 'AM',
    assigneeColor: '#65DCA4',
    createdBy: 'Sarah Jenkins',
    createdAt: '22 Oct 2025',
  },
  {
    id: '7',
    code: 'EPIC-102',
    title: 'Sustainable Materials Integration',
    assigneeName: 'Alice Moore',
    assigneeInitials: 'AM',
    assigneeColor: '#65DCA4',
    createdBy: 'Sarah Jenkins',
    createdAt: '22 Oct 2025',
  },
  {
    id: '8',
    code: 'EPIC-102',
    title: 'Sustainable Materials Integration',
    assigneeName: 'Alice Moore',
    assigneeInitials: 'AM',
    assigneeColor: '#65DCA4',
    createdBy: 'Sarah Jenkins',
    createdAt: '22 Oct 2025',
  },
];

@Component({
  selector: 'app-epics',
  imports: [],
  templateUrl: './epics.html',
  styleUrl: './epics.css',
})
export class Epics {
  private router = inject(Router);

  searchQuery = signal('');
  currentPage = signal(1);
  itemsPerPage = 6;

  isLoading = signal(true);
  hasError = signal(false);

  selectedEpic = signal<Epic | null>(null);

  skeletonItems = Array(6).fill(0);

  openEpic(epic: Epic): void {
    this.selectedEpic.set(epic);
  }

  closeEpic() {
    this.selectedEpic.set(null);
  }

  ngOnInit(): void {
    this.loadEpics();
  }

  loadEpics(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    setTimeout(() => {
      this.allEpics.set(MOCK_EPICS);
      this.isLoading.set(false);
    }, 1500);
  }

  allEpics = signal<Epic[]>(MOCK_EPICS);

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

  goToPage(page: number): void {
    if (page >= 1 && page < this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  createEpic(): void {
    this.router.navigate(['/epics/new']);
  }

  addTask(): void {
    this.router.navigate(['/tasks/new']);
  }
}
