import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

export const authGuard: CanActivateFn = (route) => {
  const api = inject(ApiService);
  const router = inject(Router);

  console.log('Auth guard called for:', route.url);
  console.log('isLoggedIn:', api.isLoggedIn());

  if (api.isLoggedIn()) return true;

  router.navigate(['/auth/login']);
  return false;
};
