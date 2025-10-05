import { Routes } from "@angular/router";
import { QuestionnaireManagementComponent } from "./pages/questionnaire-management/questionnaire-management.component";
import { AddQuestionViewComponent } from "./pages/add-question-view/add-question-view.component";
import { GestionQuestionManageComponent } from "./components/gestion-question/components/gestion-question-manage/gestion-question-manage.component";
import { QuestionManagementComponent } from "./components/gestion-question/pages/question-management/question-management.component";
import { ReponseManagementComponent } from "./components/gestion-reponse/pages/reponse-management/reponse-management.component";

export const questionnaires_routes: Routes = [
    { path:'', component: QuestionnaireManagementComponent,
        children : [
            
        ]
    },
    {
        path:'ajouter_un_questionnaire', component:AddQuestionViewComponent,
    },
    {
        path:'gestion_des_questions', component:QuestionManagementComponent
    },
    {
        path:'gestion_des_reponses', component:ReponseManagementComponent
    }
    
]