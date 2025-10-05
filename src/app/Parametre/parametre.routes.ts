import { Routes } from "@angular/router";
import { ParametreComponent } from "./parametre.component";

export const Parametre_routes: Routes = [
    { path:'', component: ParametreComponent },
    {
        path:'questionnaires',
        loadChildren: async () => {
            const loadRoutes = await import('./Questionnaire/questionnaires.routes');
            return loadRoutes.questionnaires_routes;
        }
    },
    {
        path:'plateformes',
        loadChildren: async () => {
            const loadRoutes = await import('./Plateforme/plateforme.routes');
            return loadRoutes.plateforme_routes;
        }
    },
    {
        path:'directions',
        loadChildren: async () => {
            const loadRoutes = await import('./Direction/direction.routes');
            return loadRoutes.direction_routes;
        }
    }
]