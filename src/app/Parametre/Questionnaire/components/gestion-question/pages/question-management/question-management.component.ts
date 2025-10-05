import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from "src/app/Core/layouts/main-layout/main-layout.component";
import { GestionQuestionOverviewComponent } from "../../components/gestion-question-overview/gestion-question-overview.component";

@Component({
  selector: 'app-question-management',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, GestionQuestionOverviewComponent],
  templateUrl: './question-management.component.html',
  styleUrls: ['./question-management.component.scss']
})
export class QuestionManagementComponent {

}
