import { Routes } from "@angular/router";
import { ActionManagementComponent } from "./action-management.component";
import { AddActionViewComponent } from "../add-action-view/add-action-view.component";


export const action_routes: Routes = [
  { path: '', component: ActionManagementComponent },

  {
    path: 'enregistrement_de_action',
    component: AddActionViewComponent,
    },
]