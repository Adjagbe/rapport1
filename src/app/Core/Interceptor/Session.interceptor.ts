import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { STORAGE_KEYS } from 'src/app/Models/storage-keys.model';
import { CommonUtils } from '../Utility/common.utils';
import { Observable, tap } from 'rxjs';

export const sessionInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (typeof window === 'undefined') return next(req);

  const common = inject(CommonUtils);
  const router = inject(Router);

  // const validator = common.createValidator(/authentication\//)(req.url);
  
  // if (validator) {
  //   localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  //   router.navigate(['/authentication/login']);
  //   return next(req);
  // }

  const raw = localStorage.getItem(STORAGE_KEYS.USER_INFO);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.sessionUser) {
        req = req.clone({
          setHeaders: { sessionUser: parsed.sessionUser }
        });
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    }
  }

  //  Intercepter toutes les réponses
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const body = event.body as any;
        if (body?.status?.code === '932') {
          //  Déconnexion forcée
          localStorage.removeItem(STORAGE_KEYS.USER_INFO);
          router.navigate(['/authentication/login']);
          window.location.reload()
        }
      }
    })
  );
};
export default sessionInterceptor;