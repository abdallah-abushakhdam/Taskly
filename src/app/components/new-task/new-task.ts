import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-new-task',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new-task.html',
  styleUrl: './new-task.css',
})
export class NewTask implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(ApiService);

  isLoading = signal(false);
  errorMessage = signal('');
  projectId = signal('');
  projectName = signal('');
  epics = signal<any[]>([]);
  members = signal<any[]>([]);

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    status: ['TO_DO', Validators.required],
    assignee: [''],
    epic: [''],
    dueDate: [''],
    description: ['', [Validators.maxLength(500)]],
  });

  async ngOnInit(): Promise<void> {
    const raw = localStorage.getItem('selected_project');
    if (raw) {
      const project = JSON.parse(raw);
      this.projectId.set(project.id);
      this.projectName.set(project.name);
      await this.loadEpics(project.id);
      await this.loadMembers(project.id);
    }
  }

  async loadEpics(projectId: string): Promise<void> {
    try {
      const data = await this.api.getProjectEpics(projectId);
      this.epics.set(data);
    } catch {
      this.epics.set([]);
    }
  }

  async loadMembers(projectId: string): Promise<void> {
    try {
      const data = await this.api.getProjectMembers(projectId);
      this.members.set(data);
    } catch {
      this.members.set([]);
    }
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  back(): void {
    this.router.navigate(['/tasks']);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      await this.api.createTask({
        title: this.form.value.title,
        description: this.form.value.description,
        status: this.form.value.status,
        epicId: this.form.value.epic || undefined,
        projectId: this.projectId(),
        dueDate: this.form.value.dueDate || undefined,
      });
      this.router.navigate(['/tasks']);
    } catch (err: any) {
      const msg = err.error?.message || 'Something went wrong.';
      this.errorMessage.set(`Failed to create task: ${msg}`);
    } finally {
      this.isLoading.set(false);
    }
  }
}
