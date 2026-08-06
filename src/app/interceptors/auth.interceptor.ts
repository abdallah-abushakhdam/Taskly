import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

const SUPABASE_KEY = 'sb_publishable_Sy7zKJYq19dKBPEUGcE0Ag_EhEqXvud';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  const token = localStorage.getItem('taskly_token');

  const authReq = req.clone({
    setHeaders: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : `Bearer ${SUPABASE_KEY}`,
    },
  });

  loading.show();

  return next(authReq).pipe(finalize(() => loading.hide()));
};
