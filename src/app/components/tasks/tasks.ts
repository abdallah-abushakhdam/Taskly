import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface Task {
  id: string;
  taskId: string;
  title: string;
  date: string;
  assigneeInitials: string;
  assigneeColor: string;
  assigneeName: string;
  badge?: { label: string; type: 'today' | 'delayed' | 'due' };
  status: 'todo' | 'in-progress' | 'blocked' | 'completed' | 'urgent';
}

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    taskId: 'TASK-121',
    title: 'Develop responsive bento grid components',
    date: '25 Oct 2025',
    assigneeInitials: 'JD',
    assigneeColor: '#4060D0',
    assigneeName: 'John Doe',
    status: 'in-progress',
  },
  {
    id: '2',
    taskId: 'TASK-128',
    title: 'Refactor global navigation state management',
    date: '28 Oct 2025',
    assigneeInitials: 'SL',
    assigneeColor: '#00D9A0',
    assigneeName: 'Sarah Lee',
    status: 'todo',
  },
  {
    id: '3',
    taskId: 'TASK-131',
    title: 'Implement glassmorphism effect on modals',
    date: '22 Oct 2025',
    assigneeInitials: 'MK',
    assigneeColor: '#B0C2E8',
    assigneeName: 'Mike Kern',
    status: 'completed',
  },
  {
    id: '4',
    taskId: 'TASK-134',
    title: 'User research for enterprise dashboard layout',
    date: '30 Oct 2025',
    assigneeInitials: 'AM',
    assigneeColor: '#65DCA4',
    assigneeName: 'Alex Mason',
    status: 'in-progress',
  },
  {
    id: '5',
    taskId: 'TASK-142',
    title: 'Critical Bug: Fix navigation lag on Safari mobile',
    date: '24 Oct 2025',
    assigneeInitials: 'RV',
    assigneeColor: '#E03030',
    assigneeName: 'Rita Vane',
    status: 'urgent',
  },
];
@Component({
  selector: 'app-tasks',
  imports: [CommonModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  private route = inject(Router);

  searchQuery = signal('');
  view = signal<'board' | 'list'>('board');
  selectedTask = signal<Task | null>(null);
  viewMenuOpen = signal(false);
  tasks = signal<Task[]>(MOCK_TASKS);

  filteredTasks = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.tasks();
    return this.tasks().filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.taskId.toLowerCase().includes(q) ||
        t.assigneeName.toLowerCase().includes(q),
    );
  });

  todoTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'todo'));
  inProgressTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'in-progress'));
  blockedTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'blocked'));

  setView(v: 'board' | 'list'): void {
    this.view.set(v);
    this.viewMenuOpen.set(false);
  }
  toggleViewMenu(): void {
    this.viewMenuOpen.update((v) => !v);
  }

  addTask(status?: string): void {
    this.route.navigate(['/tasks/new']);
  }

  openTask(task: Task): void {
    this.selectedTask.set(task);
  }

  closeTask(): void {
    this.selectedTask.set(null);
  }
  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }
}
