import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from "src/app/Core/layouts/main-layout/main-layout.component";
import { QuestionnaireManageComponent } from "../../components/questionnaire-manage/questionnaire-manage.component";

@Component({
  selector: 'app-add-question-view',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, QuestionnaireManageComponent],
  templateUrl: './add-question-view.component.html',
  styleUrls: ['./add-question-view.component.scss']
})
export class AddQuestionViewComponent {

}
