import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from "src/app/Core/layouts/main-layout/main-layout.component";
import { QuestionnaireOverviewComponent } from "../../components/questionnaire-overview/questionnaire-overview.component";

@Component({
  selector: 'app-questionnaire-management',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, QuestionnaireOverviewComponent],
  templateUrl: './questionnaire-management.component.html',
  styleUrls: ['./questionnaire-management.component.scss']
})
export class QuestionnaireManagementComponent {

}
