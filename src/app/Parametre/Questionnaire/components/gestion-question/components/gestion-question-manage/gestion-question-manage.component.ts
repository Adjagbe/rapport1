import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/Core/Services/loader.service';
import { ParametrageService } from 'src/app/Core/Services/Parametrage/parametrage.service';
import Swal from 'sweetalert2';
import { CloseIconComponent } from 'src/app/Core/icons';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { listeQuestion } from 'src/app/Models/questionnaire.model';

@Component({
  selector: 'app-gestion-question-manage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CloseIconComponent,
    BtnGenericComponent,
    FormControlComponent,
    NgSelectModule,
  ],
  templateUrl: './gestion-question-manage.component.html',
  styleUrls: ['./gestion-question-manage.component.scss'],
})
export class GestionQuestionManageComponent {
  @Input() questionId: any;
  #modalActive = inject(NgbActiveModal);
  #router = inject(Router);
  #formBuilder = inject(FormBuilder);
  btnSubmitText: 'Ajouter une question' | 'Modification de la question' =
    'Ajouter une question';
  isSubmit = false;
  #loaderService = inject(LoaderService);
  #QuestionService = inject(ParametrageService);
  listeQuestionType!: any;
  listQuestion: listeQuestion | any = [];

  @Output() refreshTable = new EventEmitter<void>();

  newQuestionFormulaire = this.#formBuilder.nonNullable.group({
    questionText: ['', [Validators.required, this.noWhiteSpaceValidator]],
    questionType: ['', Validators.required],
  });

  ngOnInit() {
    const currentQuestionId = this.questionId;
    if (currentQuestionId) {
      this.getQuestionById(currentQuestionId);
      this.btnSubmitText = 'Modification de la question';
    } else {
      this.btnSubmitText = 'Ajouter une question';
    }
    this.listQuestionType();
  }

  CreateOrUpdateQuestion() {
    this.#loaderService.show();
    this.questionId == null ? this.createNewQuestion() : this.UpdateAQuestion();
  }

  createNewQuestion() {
    let QuestionText = {
      questionText: this.newQuestionFormulaire.value.questionText?.trim(),
      questionType: this.newQuestionFormulaire.value.questionType,
    };

    this.isSubmit = true;

    if (this.newQuestionFormulaire.valid) {
      this.#QuestionService.createQuestion(QuestionText).subscribe({
        next: (reqResponse) => {
          this.isSubmit = false;
          if (reqResponse && this.isErrorCode(reqResponse.status.code)) {
            Swal.fire({
              toast: true,
              icon: 'error',
              title: reqResponse.status.message,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.#loaderService.hide();
            this.close();
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
            this.refreshTable.emit();
            this.close();
            this.#loaderService.hide();
          } else return;
        },
        error: (error) => {
          this.isSubmit = false;
          console.error(error);
          this.#loaderService.hide();
        },
      });
    } else {
      Swal.fire({
        toast: true,
        icon: 'error',
        title:
          'Les champs sont invalides ou vide, veuillez les remplir correctement.',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      this.#loaderService.hide();
    }
  }

  isErrorCode(code: string): boolean {
    return ['904', '905', '910', '902'].includes(code);
  }

  //Pas d'espace vide dans le champ de saisie 
  noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  UpdateAQuestion() {
    let QuestionData = {
      idQuestion: this.questionId,
      questionText: this.newQuestionFormulaire.value.questionText,
      questionType: this.newQuestionFormulaire.value.questionType,
    };
    this.isSubmit = true;

    if (this.newQuestionFormulaire.valid) {
      this.#QuestionService.updateQuestionG(QuestionData).subscribe({
        next: (reqResponse: any) => {
          this.isSubmit = false;
          if (!reqResponse.hasError) {
            Swal.fire({
              toast: true,
              icon: 'success',
              title: 'Les modifications ont été enregistrées avec succès.',
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.refreshTable.emit();
            this.#loaderService.hide();
            this.close();
          } else return;
        },
        error: (error) => {
          this.isSubmit = false;
          console.error(error);
          this.#loaderService.hide();
        },
      });
    } else {
      Swal.fire({
        toast: true,
        icon: 'error',
        title:
          'Les champs sont invalides ou vide, veuillez les remplir correctement.',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      this.#loaderService.hide();
    }
  }

  listQuestionType() {
    this.#QuestionService.choiceQuestionType().subscribe({
      next: (response) => {
        this.listeQuestionType = response.items;
        console.log('listeQuestionType', this.listeQuestionType);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getQuestionById(id: string) {
    this.#QuestionService
      .getListQ(
        {
          size: ``,
          index: ``,
          id: id,
        },
        false
      )
      .subscribe({
        next: (listPlateformeResponse) => {
          const { items, count } = listPlateformeResponse;
          this.newQuestionFormulaire.patchValue({
            questionText: items[0].questionText,
            questionType: items[0].questionType,
          });
        },
      });
  }

  getByCriteriaQuestion() {
    // this.isListRole = true;
    this.#QuestionService
      .getListQ(
        {
          size: ``,
          ordre: 'ASC',
          champs: 'libelle',
          index: ``,
        },
        false
      )
      .subscribe({
        next: (listRoleResponse) => {
          const { items, count } = listRoleResponse;
          this.listQuestion = items;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  close() {
    this.#modalActive.dismiss();
    this.newQuestionFormulaire.reset();
    // this.refreshTable.emit()
    this.getByCriteriaQuestion();
    this.#router.navigate([
      '/parametrage/questionnaires/gestion_des_questions',
    ]);
    // this.#modalService.off();
  }
}
