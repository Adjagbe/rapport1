import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { STORAGE_KEYS } from 'src/app/Models/storage-keys.model';

export const authGuard: CanActivateFn = (route, state) => {
  
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  let isAuthenticated = false;

  if (isPlatformBrowser(platformId)) {
    isAuthenticated = localStorage.getItem(STORAGE_KEYS.USER_INFO) !== null;
  }
  
  if (isAuthenticated) {
    return true;
  } else {
    if (isPlatformBrowser(platformId)) {

      router.navigate(['/authentication/login']);
    }
    return false;
  }
};
