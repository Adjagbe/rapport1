import { Routes } from "@angular/router";
import { ActionManagementComponent } from "./pages/action-management/action-management.component";
import { AddActionViewComponent } from "./pages/add-action-view/add-action-view.component";
import { allowGuard } from "src/app/guards/allow/allow.guard";


export const action_routes: Routes = [
  { path: '', component: ActionManagementComponent, canActivate:[allowGuard] },

  {
    path: 'enregistrement_de_action',
    component: AddActionViewComponent,
    },
]