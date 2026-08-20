import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-new-epic',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new-epic.html',
  styleUrl: './new-epic.css',
})
export class NewEpic implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  isLoading = signal(false);
  errorMessage = signal('');
  projectId = signal('');
  projectName = signal('');

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.maxLength(500)]],
    assignee: [''],
    deadline: [''],
  });

  ngOnInit(): void {
    const projectId = this.route.snapshot.params['projectId'];
    console.log('projectId from route:', projectId);

    if (projectId) {
      this.projectId.set(projectId);
    }

    const raw = localStorage.getItem('selected_project');
    if (raw) {
      const project = JSON.parse(raw);
      this.projectName.set(project.name);
      if (!projectId) {
        this.projectId.set(project.id);
      }
    }
  }

  get descCount(): number {
    return this.form.get('description')?.value?.length || 0;
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  cancel(): void {
    this.router.navigate(['/project', this.projectId(), 'epics']);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      await this.api.createEpic({
        title: this.form.value.title,
        description: this.form.value.description,
        assigneeId: this.form.value.assignee || this.api.getUserId(),
        projectId: this.projectId(),
        deadline: this.form.value.deadline,
      });
      this.router.navigate(['/project', this.projectId(), 'epics']);
    } catch (err: any) {
      const msg = err.error?.message || 'Something went wrong.';
      this.errorMessage.set(`Failed to create epic: ${msg}`);
    } finally {
      this.isLoading.set(false);
    }
  }
}
