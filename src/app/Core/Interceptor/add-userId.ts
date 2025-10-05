import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from '../Services/users.service';
import { Router } from '@angular/router';

const addUserId: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const userService = inject(UsersService);
  const router = inject(Router);
  // space
  const userId = userService.getUser();
  const currentRoute = router.url;
  const isAuthRoute = currentRoute.includes('/authentication/');

  let newBody!: Record<string, unknown>;

  if (req.body && typeof req.body === 'object' && !isAuthRoute) {
    newBody = { ...req.body, user: userId ? userId?.item?.idUser : null };
  } else if (isAuthRoute) {
    newBody = { ...(req?.body ?? {}), user: 36 };
  } else {
    newBody = { ...(req?.body ?? {}), user: 36 };
  }

  const clonedReq = req.clone({
    body: newBody,
  });

  return next(clonedReq);
};

export default addUserId;
