import { Routes } from "@angular/router";
import { AddRoleViewComponent } from "../add-role-view/add-role-view.component";
import { RoleManagementViewComponent } from "./profils-management.component";


export const role_routes: Routes = [
  { path: '', component: RoleManagementViewComponent },

  {
    path: 'enregistrement_de_role',
    component: AddRoleViewComponent,
    },
]