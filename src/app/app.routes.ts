import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/projects/projects').then((m) => m.Projects),
      },
      {
        path: 'project',
        loadComponent: () => import('./components/projects/projects').then((m) => m.Projects),
      },

      {
        path: 'members',
        loadComponent: () => import('./components/members/members').then((m) => m.Members),
      },

      {
        path: 'epics',
        loadComponent: () => import('./components/epics/epics').then((m) => m.Epics),
      },
      {
        path: 'epics/new',
        loadComponent: () => import('./components/new-epic/new-epic').then((m) => m.NewEpic),
      },

      {
        path: 'project/new',
        loadComponent: () =>
          import('./components/new-project/new-project').then((m) => m.NewProject),
      },
      {
        path: 'tasks/new',
        loadComponent: () => import('./components/new-task/new-task').then((m) => m.NewTask),
      },

      {
        path: 'tasks',
        loadComponent: () => import('./components/tasks/tasks').then((m) => m.Tasks),
      },
    ],
  },

  // { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // // Auth routes
  // {
  //   path: 'auth/login',
  //   loadComponent: () => import('./components/sign-in/sign-in').then((m) => m.SignIn),
  // },
  // {
  //   path: 'auth/register',
  //   loadComponent: () => import('./components/sign-up/sign-up').then((m) => m.SignUp),
  // },
  // {
  //   path: 'auth/forgot-password',
  //   loadComponent: () => import('./components/forgot-pass/forgot-pass').then((m) => m.ForgotPass),
  // },
  // {
  //   path: 'auth/reset-password',
  //   loadComponent: () => import('./components/new-pass/new-pass').then((m) => m.NewPass),
  // },

  // // Protected routes (inside layout)
  // {
  //   path: '',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./components/layout/layout').then((m) => m.Layout),
  //   children: [
  //     { path: '', redirectTo: 'project', pathMatch: 'full' },
  //     {
  //       path: 'project',
  //       loadComponent: () => import('./components/projects/projects').then((m) => m.Projects),
  //     },
  //     {
  //       path: 'epics',
  //       loadComponent: () => import('./components/epics/epics').then((m) => m.Epics),
  //     },
  //     {
  //       path: 'tasks',
  //       loadComponent: () => import('./components/tasks/tasks').then((m) => m.Tasks),
  //     },
  //     {
  //       path: 'members',
  //       loadComponent: () => import('./components/members/members').then((m) => m.Members),
  //     },
  //     {
  //       path: 'details',
  //       loadComponent: () => import('./components/details/details').then((m) => m.Details),
  //     },
  //   ],
  // },

  // { path: '**', redirectTo: 'auth/login' },
];
