import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

const BASE_URL = 'https://xqnygfsehxrsbqmnfcub.supabase.co';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly TOKEN_KEY = 'taskly_token';
  private readonly REFRESH_KEY = 'taskly_refresh_token';
  private readonly USER_KEY = 'taskly_user';

  currentUser = signal<any>(this.loadUser());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  private loadUser(): any {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  // ─── AUTH ──────────────────────────────────────────

  async register(data: {
    name: string;
    email: string;
    jobTitle: string;
    password: string;
  }): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<any>(`${BASE_URL}/auth/v1/signup`, {
        email: data.email,
        password: data.password,
        data: {
          name: data.name,
          department: data.jobTitle,
        },
      }),
    );

    localStorage.setItem(this.TOKEN_KEY, res.access_token);
    localStorage.setItem(this.REFRESH_KEY, res.refresh_token);
    localStorage.setItem(
      this.USER_KEY,
      JSON.stringify({
        id: res.user?.id,
        name: res.user?.user_metadata?.name || data.name,
        email: res.user?.email || data.email,
        jobTitle: res.user?.user_metadata?.department || data.jobTitle,
      }),
    );

    this.currentUser.set(this.loadUser());
    this.router.navigate(['/project']);
  }

  async login(email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<any>(`${BASE_URL}/auth/v1/token?grant_type=password`, {
        email,
        password,
      }),
    );

    localStorage.setItem(this.TOKEN_KEY, res.access_token);
    localStorage.setItem(this.REFRESH_KEY, res.refresh_token);
    localStorage.setItem(
      this.USER_KEY,
      JSON.stringify({
        id: res.user?.id,
        name: res.user?.user_metadata?.name || '',
        email: res.user?.email || email,
        jobTitle: res.user?.user_metadata?.department || '',
      }),
    );

    this.currentUser.set(this.loadUser());
    this.router.navigate(['/project']);
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post<any>(`${BASE_URL}/auth/v1/logout`, {}));
    } catch {}
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  async getUserData(): Promise<any> {
    return firstValueFrom(this.http.get<any>(`${BASE_URL}/auth/v1/user`));
  }

  async refreshToken(): Promise<void> {
    const refresh_token = localStorage.getItem(this.REFRESH_KEY);
    if (!refresh_token) return;

    const res = await firstValueFrom(
      this.http.post<any>(`${BASE_URL}/auth/v1/token?grant_type=refresh_token`, {
        refresh_token,
      }),
    );

    localStorage.setItem(this.TOKEN_KEY, res.access_token);
    localStorage.setItem(this.REFRESH_KEY, res.refresh_token);
  }

  async forgotPassword(email: string): Promise<void> {
    await firstValueFrom(this.http.post<any>(`${BASE_URL}/auth/v1/recover`, { email }));
  }

  async updatePassword(password: string): Promise<void> {
    await firstValueFrom(this.http.put<any>(`${BASE_URL}/auth/v1/user`, { password }));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserId(): string | null {
    return this.loadUser()?.id || null;
  }

  // ─── PROJECTS ──────────────────────────────────────

  async getProjects(): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.post<any>(`${BASE_URL}/rest/v1/rpc/get_projects`, {}),
    );
    return res || [];
  }

  async createProject(data: { name: string; description?: string }): Promise<any> {
    return firstValueFrom(
      this.http.post<any>(`${BASE_URL}/rest/v1/projects`, {
        name: data.name,
        description: data.description,
      }),
    );
  }

  async updateProject(
    id: string,
    data: {
      name?: string;
      description?: string;
    },
  ): Promise<any> {
    return firstValueFrom(this.http.patch<any>(`${BASE_URL}/rest/v1/projects?id=eq.${id}`, data));
  }

  // ─── EPICS ─────────────────────────────────────────

  async getProjectEpics(projectId: string): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.get<any[]>(`${BASE_URL}/rest/v1/epics?project_id=eq.${projectId}`),
    );
    return res || [];
  }

  async createEpic(data: {
    title: string;
    description?: string;
    assigneeId?: string;
    projectId: string;
    deadline?: string;
  }): Promise<any> {
    return firstValueFrom(
      this.http.post<any>(`${BASE_URL}/rest/v1/epics`, {
        title: data.title,
        description: data.description,
        assignee_id: data.assigneeId || this.getUserId(),
        project_id: data.projectId,
        deadline: data.deadline,
      }),
    );
  }
}
