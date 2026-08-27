import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';

interface Task {
  id: string;
  taskId: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  assigneeInitials: string;
  assigneeColor: string;
  assigneeName: string;
  badge?: { label: string; type: 'today' | 'delayed' | 'due' };
  status: 'todo' | 'in-progress' | 'blocked' | 'completed' | 'urgent';
}

interface Project {
  id: string;
  name: string;
}

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private loading = inject(LoadingService);

  currentUser = this.api.currentUser;

  isLoading = this.loading.isLoading;
  hasError = signal(false);
  searchQuery = signal('');
  view = signal<'board' | 'list'>('board');
  viewMenuOpen = signal(false);
  selectedTask = signal<Task | null>(null);
  statusMenuOpen = signal(false);

  selectedProject = signal<Project | null>(null);
  allTasks = signal<Task[]>([]);

  filteredTasks = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.allTasks();
    return this.allTasks().filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.taskId.toLowerCase().includes(q) ||
        t.assigneeName.toLowerCase().includes(q),
    );
  });

  todoTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'todo'));
  inProgressTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'in-progress'));
  blockedTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'blocked'));

  ngOnInit(): void {
    const raw = localStorage.getItem('selected_project');
    console.log('Tasks ngOnInit - selected_project:', raw);
    if (raw) {
      const project = JSON.parse(raw);
      this.selectedProject.set(project);
      this.loadTasks(project.id);
    } else {
      this.router.navigate(['/project']);
    }
  }

  async loadTasks(projectId: string): Promise<void> {
    this.hasError.set(false);
    try {
      const data = await this.api.getProjectTasks(projectId);
      const members = await this.api.getProjectMembers(projectId);
      const currentUser = JSON.parse(localStorage.getItem('taskly_user') || '{}');

      this.allTasks.set(
        data.map((t: any) => {
          const assignee = members.find((m: any) => m.user_id === t.assignee_id);

          return {
            id: t.id,
            taskId: t.task_id || `TASK-${t.id.slice(0, 3).toUpperCase()}`,
            title: t.title,
            description: t.description || '',
            date: t.due_date ? this.formatDate(t.due_date) : 'No date',
            createdAt: t.created_at ? this.formatDate(t.created_at) : 'No date',
            assigneeInitials: this.getInitials(
              assignee?.metadata?.name || currentUser.name || 'UN',
            ),
            assigneeColor: '#4060D0',
            assigneeName: assignee?.metadata?.name || currentUser.name || 'Unassigned',
            status: this.mapStatus(t.status),
          };
        }),
      );
    } catch {
      this.hasError.set(true);
    }
  }

  mapStatus(status: string): Task['status'] {
    const map: Record<string, Task['status']> = {
      TO_DO: 'todo',
      IN_PROGRESS: 'in-progress',
      BLOCKED: 'blocked',
      COMPLETED: 'completed',
      URGENT: 'urgent',
    };
    return map[status] || 'todo';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  setView(v: 'board' | 'list'): void {
    this.view.set(v);
    this.viewMenuOpen.set(false);
  }

  toggleViewMenu(): void {
    this.viewMenuOpen.update((v) => !v);
  }

  openTask(task: Task): void {
    this.selectedTask.set(task);
  }

  closeTask(): void {
    this.selectedTask.set(null);
    this.statusMenuOpen.set(false);
  }

  toggleStatusMenu(): void {
    this.statusMenuOpen.update((v) => !v);
  }

  async changeStatus(status: Task['status']): Promise<void> {
    if (!this.selectedTask()) return;

    const taskId = this.selectedTask()!.id;
    const apiStatus = this.reverseMapStatus(status);

    try {
      await this.api.updateTask(taskId, { status: apiStatus });
      this.selectedTask.update((t) => (t ? { ...t, status } : null));
      this.allTasks.update((tasks) => tasks.map((t) => (t.id === taskId ? { ...t, status } : t)));
    } catch (err) {
      console.log('Failed to update status:', err);
    }

    this.statusMenuOpen.set(false);
  }

  async updateTaskField(field: string, value: string): Promise<void> {
    if (!this.selectedTask()) return;
    if (value === this.selectedTask()![field as keyof Task]) return;

    const taskId = this.selectedTask()!.id;

    try {
      await this.api.updateTask(taskId, { [field]: value });
      this.selectedTask.update((t) => (t ? { ...t, [field]: value } : null));
      this.allTasks.update((tasks) =>
        tasks.map((t) => (t.id === taskId ? { ...t, [field]: value } : t)),
      );
    } catch (err) {
      console.log('Update task error:', err);
    }
  }

  reverseMapStatus(status: Task['status']): string {
    const map: Record<string, string> = {
      todo: 'TO_DO',
      'in-progress': 'IN_PROGRESS',
      blocked: 'BLOCKED',
      completed: 'COMPLETED',
      urgent: 'URGENT',
    };
    return map[status] || 'TO_DO';
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

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  addTask(status?: string): void {
    this.router.navigate(['/tasks/new']);
  }
}
