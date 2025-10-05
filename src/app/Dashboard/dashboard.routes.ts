import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
  },
  {
    path: 'details/:campagneName',
    loadComponent: async () => {
      const { DetailsPageComponent } = await import(
        './pages/details-page/details-page.component'
      );
      return DetailsPageComponent;
    },
  },
];
