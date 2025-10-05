import { Routes } from '@angular/router';
import { allowGuard } from './guards/allow/allow.guard';
import { authGuard } from './guards/auth/auth.guard';
import { loginGuard } from './guards/login/login.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: async () => {
      const { dashboardRoutes } = await import('./Dashboard/dashboard.routes');
      return dashboardRoutes;
    },
    
    data: { code: 'ROOT' }
  },
  {
    path: 'gestion-campagnes',
    canActivate: [authGuard, allowGuard],
    loadComponent: async () => {
      const { GestionCampagnePageComponent } = await import(
        './pages/gestion-campagne-page/gestion-campagne-page.component'
      );
      return GestionCampagnePageComponent;
    },
    data: { code: 'GESTION_DES_CAMPAGNES' }
  },
  {
    path: 'certifications',
    canActivate: [authGuard, allowGuard],
    loadComponent: async () => {
      const { CertificationPageComponent } = await import(
        './pages/certification-page/certification-page.component'
      );
      return CertificationPageComponent;
    },
    data: { code: 'CERTIFICATION' }
  },
  // {
  //   path: 'administration',
  //   loadComponent: async () => {
  //     const { AdministrationPageComponent } = await import(
  //       './pages/administration-page/administration-page.component'
  //     );
  //     return AdministrationPageComponent;
  //   },
  // },
  {
    path: 'administration',
    canActivate: [authGuard, allowGuard],
    loadChildren: async () => {
      const { Administration_routes } = await import(
        './Administration/administration.routes'
      );
      return Administration_routes;
    },
    
    data: { code: 'ADMINISTRATION' }
  },
  {
    path: 'parametrage',
    canActivate: [authGuard, allowGuard],
    loadChildren: async () => {
      const { Parametre_routes } = await import(
        './Parametre/parametre.routes'
      );
      return Parametre_routes;
    },
    
    data: { code: 'PARAMETRAGE' }
  },
  {
    path: 'authentication',
    canActivate: [loginGuard],
    loadChildren: async () => {
      console.log('[Valeur de this]: ', this);
      const { AUTHROUTES } = await import('./Authentication/auth.routes');
      return AUTHROUTES;
    },
  },
  { path: '', redirectTo: 'authentication', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: async function () {
      const { NotFoundPageComponent } = await import(
        './pages/not-found-page/not-found-page.component'
      );
      return NotFoundPageComponent;
    },
  },
];
