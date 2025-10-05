import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CloseIconComponent } from 'src/app/Core/icons/close-icon.component';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParametrageService } from 'src/app/Core/Services/Parametrage/parametrage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'questionnaire-manage',
  standalone: true,
  imports: [
    CommonModule,
    CloseIconComponent,
    BtnGenericComponent,
    NgSelectModule,
    FormControlComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './questionnaire-manage.component.html',
  styleUrls: ['./questionnaire-manage.component.scss'],
})
export class QuestionnaireManageComponent {
  questionOrReponse: 'Question' | 'Response' = 'Question';

  #modalActive = inject(NgbActiveModal);
  #router = inject(Router);
  #formBuilder = inject(FormBuilder);

  @Input() keyTitle: any;
  isSubmit = false;
  #QuestionService = inject(ParametrageService);
  listeQuestionType!: any

  newQuestionFormulaire = this.#formBuilder.nonNullable.group({
    questionText: ['', Validators.required],
    questionType: ['', Validators.required],
  });

  newOptionReponseFormulaire = this.#formBuilder.nonNullable.group({
    optionText: ['', Validators.required],
    optionValue : ['', Validators.required],
  })

  ngOnInit() {
    const Title = this.keyTitle;

    if (Title) {
      this.questionOrReponse = 'Response';
    } else {
      this.questionOrReponse = 'Question';
    }

    this.listQuestionType()
  }

  createNewQuestion() {
    let QuestionText = {
      questionText: this.newQuestionFormulaire.value.questionText,
      questionType: this.newQuestionFormulaire.value.questionType
    };

    this.isSubmit = true;
    this.#QuestionService.createQuestion(QuestionText).subscribe({
      next: (reqResponse) => {
        this.isSubmit = false;
        if (reqResponse && reqResponse.status.code == '904') {
          Swal.fire({
            toast: true,
            icon: 'error',
            title: reqResponse.status.message,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else if (!reqResponse.hasError) {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: 'La question a été créée avec succès.',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          this.close();
        } else return;
      },
      error: (error) => {
        this.isSubmit = false;
        console.error(error);
      },
    });
  }

  createNewReponse(){

     let ReponseText = {
      optionText: this.newOptionReponseFormulaire.value.optionText,
      optionValue: this.newOptionReponseFormulaire.value.optionValue
    };

    this.isSubmit = true;
    this.#QuestionService.createQuestion(ReponseText).subscribe({
      next: (reqResponse) => {
        this.isSubmit = false;
        if (reqResponse && reqResponse.status.code == '904') {
          Swal.fire({
            toast: true,
            icon: 'error',
            title: reqResponse.status.message,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else if (!reqResponse.hasError) {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: 'La reponse a été créée avec succès.',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          this.close();
        } else return;
      },
      error: (error) => {
        this.isSubmit = false;
        console.error(error);
      },
    });
  }

  listQuestionType(){
    this.#QuestionService.choiceQuestionType().subscribe({
      next:(response)=>{
      this.listeQuestionType = response.items;
      console.log('listeQuestionType', this.listeQuestionType);
      },
      error:(error)=> {
        console.error(error)
      }
    })
  }




  close() {
    this.#modalActive.dismiss();
    // this.refreshTable.emit()
    this.#router.navigate(['/parametrage/questionnaires']);
    // this.#modalService.off();
  }
}
