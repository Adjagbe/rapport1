import { Routes } from "@angular/router";
import { ProfilsManagementComponent } from "./pages/profils-management/profils-management.component";
import { AddProfilsViewComponent } from "./pages/add-profils-view/add-profils-view.component";
import { allowGuard } from "src/app/guards/allow/allow.guard";


export const profils_routes: Routes = [
  { path: '', component: ProfilsManagementComponent, canActivate:[allowGuard] },

  {
    path: 'enregistrement_de_profil',
    component: AddProfilsViewComponent,
    },
]