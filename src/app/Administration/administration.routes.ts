import { Routes } from '@angular/router';
import { AdministrationComponent } from './administration.component';

export const Administration_routes: Routes = [
  // { path: '', redirectTo: 'utilisateurs', pathMatch: 'full' },
  { path: '', component: AdministrationComponent },
  {
    path: 'profils',
    loadChildren: async () => {
      const loadRoutes = await import('./profils/profils.routes');
      return loadRoutes.profils_routes;
    },
  },
  {
    path: 'actions',          
    loadChildren: async () => {
      const loadRoutes = await import('./actions/actions.routes');
      return loadRoutes.action_routes;
    },
  },
  {
      path: 'utilisateurs',
      // title: 'Gestion des utilisateurs',
      loadChildren: async () => {
        const loadRoutes = await import('./utilisateurs/utilisateurs.routes');
        return loadRoutes.utilisateurs_routes;
      },
    },
];
