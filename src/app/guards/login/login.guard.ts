import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { STORAGE_KEYS } from 'src/app/Models/storage-keys.model';

export const loginGuard: CanActivateFn = (route, state) => {
  
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  let isAuthenticated = false;

  if (isPlatformBrowser(platformId)) {
    isAuthenticated = localStorage.getItem(STORAGE_KEYS.USER_INFO) !== null;
  }

  if (isAuthenticated) {
    // Déjà connecté , redirige vers dashboard
    router.navigate(['/dashboard']);
    return false;
  } else {
    // Pas connecté, autorise l’accès à la page de login
    return true;
  }
};
