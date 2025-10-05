  import { Routes } from '@angular/router';
import { IndexViewComponent } from './pages/index-view/index-view.component';
import { NewUserViewComponent } from './pages/new-user-view/new-user-view.component';
import { allowGuard } from 'src/app/guards/allow/allow.guard';

export const utilisateurs_routes: Routes = [
  { path: '', component: IndexViewComponent, canActivate:[allowGuard] },

]
