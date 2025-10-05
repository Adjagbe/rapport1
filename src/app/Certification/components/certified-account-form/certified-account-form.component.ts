import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalLayoutComponent } from 'src/app/Core/layouts/modal-layout/modal-layout.component';
import { CertificationService } from 'src/app/Core/Services/certification.service';
import {
  QuestionFlowItem,
  QuestionItem,
} from 'src/app/Models/certification.model';
import { forkJoin } from 'rxjs';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WarningCardComponent } from 'src/app/Shared/Components/warning-card/warning-card.component';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/Core/Services/loader.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';

@Component({
  selector: 'app-certified-account-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalLayoutComponent,
    BtnGenericComponent,
    WarningCardComponent,
    NgSelectModule,
    FormControlComponent,
  ],
  templateUrl: './certified-account-form.component.html',
  styleUrls: ['./certified-account-form.component.scss'],
})
export class CertifiedAccountFormComponent implements OnInit {
  #activeModal = inject(NgbActiveModal);
  #certificationService = inject(CertificationService);
  #loaderService = inject(LoaderService);

  questions: QuestionItem[] = [];
  questionFlow: QuestionFlowItem[] = [];
  displayedQuestions: QuestionItem[] = [];
  responses: { [id: number]: any } = {};

  comment = '';
  warningMessage: string | null = null;
  warningColors: {
    backgroundColor: string;
    fontColor: string;
    borderColor: string;
  } | null = null;
  userDetails: { [key: string]: any } = {};

  accountToCertify: {
    datas: {
      userAccountId: number;
      finalStatus: string | undefined;
      comment: string;
      idCampaign: number;
      idApplication: number;
      responses: {
        [id: number]: any;
      };
    }[];
  } | null = null;

  @Input({ required: true }) idAccount!: number;
  @Input({ required: true }) idApplication!: number;
  @Input({ required: true }) idCampagne!: number;
  @Input() appName: null | string = null;

  textAreaComment = new FormControl('');
  questionForm = new FormGroup({});

  /**
   * Récupère de manière sûre le FormControl d'une question
   */
  getQuestionFormControl(questionId: number): FormControl {
    const controlName = `question_${questionId}`;
    let control = this.questionForm.get(controlName);

    if (!control || !(control instanceof FormControl)) {
      // Créer un nouveau FormControl si il n'existe pas
      control = new FormControl(null);
      this.questionForm.addControl(controlName, control);
    }

    return control as FormControl;
  }

  /**
   * Transforme les options de question en format compatible avec ng-select
   */
  getNgSelectOptions(question: QuestionItem) {
    if (!question?.options) {
      return [];
    }

    return question.options.map((opt) => ({
      label: String(opt.optionText || ''),
      value: opt.optionValue,
      disabled: opt.isDeleted || false,
    }));
  }

  /**
   * Gère le changement de sélection pour les questions de type LISTE
   */
  onNgSelectChange(question: QuestionItem, selected: any) {
    // ng-select peut émettre soit la valeur (primitive) soit l'objet sélectionné selon la config
    const selectedValue =
      selected && typeof selected === 'object' && 'value' in selected
        ? selected.value
        : selected;

    if (selectedValue === undefined || selectedValue === null) {
      return;
    }

    // Trouver l'option correspondante à la valeur sélectionnée en normalisant en string
    const selectedOption = question?.options?.find(
      (opt) => String(opt.optionValue) === String(selectedValue)
    );

    if (selectedOption) {
      // Synchroniser le contrôle si besoin
      this.getQuestionFormControl(question.idQuestion).setValue(
        selectedOption.optionValue
      );
      this.onAnswer(question, selectedOption);
    }
  }

  /**
   * Remplace la syntaxe ($profil$) par le profil réel de l'utilisateur
   */
  replaceProfileInQuestionText(questionText: string): string {
    if (!questionText) {
      return questionText;
    }

    // Mapping des variables à leurs valeurs correspondantes
    const variableMapping: { [key: string]: string } = {
      profil: this.userDetails?.['profileName'] || '',
      direction: this.userDetails?.['departmentName'] || '',
      plateforme: this.appName || '',
    };

    // Remplacer toutes les occurrences de ($variable$) par leurs valeurs
    return questionText.replace(/\(\$([^$]+)\$\)/g, (match, variable) => {
      const value = variableMapping[variable];
      return value ? `( ${value} )` : match; // Garder l'original si la variable n'est pas trouvée
    });
  }

  /**
   * Met à jour le profil dans toutes les questions affichées
   */
  updateProfileInDisplayedQuestions() {
    if (!this.userDetails?.['profileName']) {
      return;
    }

    this.displayedQuestions.forEach((question) => {
      // Récupérer le texte original de la question depuis la liste complète
      const originalQuestion = this.questions.find(
        (q) => q.idQuestion === question.idQuestion
      );
      if (originalQuestion) {
        question.questionText = this.replaceProfileInQuestionText(
          originalQuestion.questionText
        );
      }
    });
  }

  ngOnInit() {
    this.#loaderService.show();
    forkJoin({
      questions: this.#certificationService.getQuestions(),
      questionFlow: this.#certificationService.getQuestionsFlow(),
    }).subscribe({
      next: ({ questions, questionFlow }) => {
        this.#loaderService.hide();
        this.questions = questions;
        this.questionFlow = questionFlow;

        // Créer les FormControl pour chaque question
        this.initializeQuestionFormControls();

        const first = questions.find((q) => q.orderInFlow === 1) ?? null;
        if (first) {
          // Créer une copie de la question pour éviter de modifier l'original
          const firstQuestionCopy = { ...first };
          // Appliquer le remplacement de profil au texte de la question
          firstQuestionCopy.questionText = this.replaceProfileInQuestionText(
            first.questionText
          );
          this.displayedQuestions = [firstQuestionCopy];
        }
        this.updateProfileInDisplayedQuestions();
      },
      error: (err) => {
        this.#loaderService.hide();
        console.error(err);
      },
    });

    this.textAreaComment.valueChanges.subscribe((value) => {
      this.comment = value ?? '';
    });
  }

  /**
   * Initialise les FormControl pour chaque question
   */
  private initializeQuestionFormControls() {
    // Les FormControl seront créés automatiquement par getQuestionFormControl
    // lors de leur première utilisation
    this.questionForm = new FormGroup({});
  }

  onAnswer(question: QuestionItem, answer: any) {
    // 1. Trouver l'index de la question courante
    const currentIndex = this.displayedQuestions.findIndex(
      (q) => q.idQuestion === question.idQuestion
    );

    // 2. Supprimer toutes les questions et réponses après celle-ci
    if (currentIndex !== -1) {
      // Garde uniquement les questions jusqu'à la courante incluse
      this.displayedQuestions = this.displayedQuestions.slice(
        0,
        currentIndex + 1
      );

      // Supprime les réponses des questions suivantes
      const displayedIds = this.displayedQuestions.map((q) => q.idQuestion);
      Object.keys(this.responses).forEach((id) => {
        if (!displayedIds.includes(Number(id))) {
          delete this.responses[Number(id)];
        }
      });
    }

    // Stocker la réponse selon le type de question
    let response: any = {
      idChosenOption: null,
      textResponse: null,
      idRelatedDepartment: null,
      suggestedProfile: null,
    };

    if (
      question.questionType === 'BOOLEAN' ||
      question.questionType === 'LISTE'
    ) {
      response.idChosenOption = answer.idQuestionOption;
      response.textResponse = answer.optionText;
      response.idRelatedDepartment =
        question.questionType === 'LISTE' ? answer.optionValue : null;
    } else if (question.questionType === 'TEXT_INPUT') {
      response.textResponse = answer;
      response.suggestedProfile = answer;
    }

    this.responses[question.idQuestion] = response;

    // Mettre à jour le FormControl correspondant si c'est une question de type LISTE
    if (question.questionType === 'LISTE') {
      const controlName = `question_${question.idQuestion}`;
      const control = this.questionForm.get(controlName);
      if (control) {
        control.setValue(answer.optionValue);
      }
    }

    // Chercher la prochaine question dans le flow
    const flow = this.questionFlow.find(
      (f) =>
        f.idCurrentQuestion === question.idQuestion &&
        f.idChosenOption ===
          (question.questionType === 'TEXT_INPUT'
            ? null
            : answer.idQuestionOption)
    );

    if (flow && flow.idNextQuestion) {
      const nextQuestion = this.questions.find(
        (q) => q.idQuestion === flow.idNextQuestion
      );
      if (
        nextQuestion &&
        !this.displayedQuestions.some(
          (q) => q.idQuestion === nextQuestion.idQuestion
        )
      ) {
        // Créer une copie de la question pour éviter de modifier l'original
        const questionCopy = { ...nextQuestion };
        // Appliquer le remplacement de profil au texte de la nouvelle question
        questionCopy.questionText = this.replaceProfileInQuestionText(
          nextQuestion.questionText
        );
        this.displayedQuestions.push(questionCopy);
      }
    } else {
      // Si on arrive ici, c'est la fin du flow, il faut trouver le flow qui correspond à la dernière question et la dernière réponse
      const lastQuestion =
        this.displayedQuestions[this.displayedQuestions.length - 1];
      const lastResponse = this.responses[lastQuestion.idQuestion];
      // On cherche tous les flows pour cette question
      const flowsForLastQuestion = this.questionFlow.filter(
        (f) => f.idCurrentQuestion === lastQuestion.idQuestion
      );
      // On cherche l'index du flow qui correspond à la dernière réponse
      const lastMatchingIndex = flowsForLastQuestion.findIndex(
        (f) =>
          f.idChosenOption ===
          (lastQuestion.questionType === 'TEXT_INPUT'
            ? null
            : lastResponse.idChosenOption)
      );
      // On log le dernier objet sur lequel on a itéré (celui juste avant que la condition ne soit plus respectée)
      if (lastMatchingIndex !== -1) {
        console.log(
          'Dernier flow utilisé pour finalStatus:',
          flowsForLastQuestion[lastMatchingIndex]
        );
      } else if (flowsForLastQuestion.length > 0) {
        console.log(
          'Aucun flow ne correspond à la dernière réponse, dernier flow pour la question:',
          flowsForLastQuestion[flowsForLastQuestion.length - 1]
        );
      } else {
        console.log('Aucun flow trouvé pour la dernière question');
      }
      const endFlow =
        lastMatchingIndex !== -1
          ? flowsForLastQuestion[lastMatchingIndex]
          : flowsForLastQuestion.length > 0
          ? flowsForLastQuestion[flowsForLastQuestion.length - 1]
          : undefined;
      const finalStatus = endFlow?.actionType; // NE DOIT PAS ÊTRE NULL
      this.warningMessage = endFlow?.warning ?? null;
      this.warningColors = endFlow?.warningColor ?? null;
      console.log('warningMessage: ', this.warningMessage);
      console.log('warningColors: ', this.warningColors);

      const payload = {
        datas: [
          {
            userAccountId: this.idAccount,
            finalStatus,
            comment: this.comment || this.textAreaComment.value || '',
            idCampaign: this.idCampagne,
            idApplication: this.idApplication,
            responses: this.responses,
          },
        ],
      };
      // Appelle ici ton service pour envoyer le payload
      // this.#certificationService.sendCertification(payload).subscribe(...)
      console.log('Payload à envoyer:', payload);
      console.log('Valeur du commentaire dans le payload:', this.comment);
      this.accountToCertify = payload;
    }
  }

  onSelectChange(question: QuestionItem, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    const selectedOption = question?.options?.find(
      (opt) => String(opt.optionValue) === value
    );
    if (selectedOption) {
      this.onAnswer(question, selectedOption);
    }
  }

  onTextInputBlur(question: QuestionItem, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.onAnswer(question, value);
  }

  onTextInputInput(question: QuestionItem, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.onAnswer(question, value);
  }

  cancel(e: Event) {
    e.preventDefault();
    this.#activeModal.dismiss();
  }

  get isAtEndOfFlow(): boolean {
    if (this.displayedQuestions.length === 0) return false;
    const lastQuestion =
      this.displayedQuestions[this.displayedQuestions.length - 1];
    // Vérifie si la dernière question affichée n'a pas de next dans le flow
    const lastResponse = this.responses[lastQuestion.idQuestion];
    if (!lastResponse) return false;
    const flow = this.questionFlow.find(
      (f) =>
        f.idCurrentQuestion === lastQuestion.idQuestion &&
        f.idChosenOption ===
          (lastQuestion.questionType === 'TEXT_INPUT'
            ? null
            : lastResponse.idChosenOption)
    );
    // Si pas de flow ou pas de idNextQuestion, c'est la fin
    return !flow || !flow.idNextQuestion;
  }

  get isFormValid(): boolean {
    // Vérifie que chaque question affichée a une réponse valide
    return this.displayedQuestions.every((q) => {
      const resp = this.responses[q.idQuestion];
      if (!resp) return false;
      if (q.questionType === 'BOOLEAN' || q.questionType === 'LISTE') {
        return (
          resp.idChosenOption !== null && resp.idChosenOption !== undefined
        );
      } else if (q.questionType === 'TEXT_INPUT') {
        return (
          resp.textResponse !== null &&
          resp.textResponse !== undefined &&
          resp.textResponse !== ''
        );
      }
      return true;
    });
  }

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.accountToCertify) {
      // Mettre à jour le commentaire dans le payload avant l'envoi
      this.accountToCertify.datas[0].comment =
        this.comment || this.textAreaComment.value || '';

      Swal.fire({
        title: `Voulez-vous vraiment certifier ${
          this.userDetails?.['login']
            ? `le compte <span style="color: var(--clr-primary);">${this.userDetails['login']}</span>`
            : 'ce compte'
        } ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
        customClass: {
          confirmButton: 'swal-custom-confirm',
          cancelButton: 'swal-custom-cancel',
          popup: 'swal-custom-popup',
        },
      }).then((res) => {
        if (res.isConfirmed) {
          this.#certificationService
            .sendCertification(this.accountToCertify)
            .subscribe({
              next: (response) => {
                Swal.fire({
                  title: 'Compte certifié avec succès',
                  icon: 'success',
                  timer: 3000,
                  customClass: {
                    confirmButton: 'swal-custom-confirm',
                    cancelButton: 'swal-custom-cancel',
                    popup: 'swal-custom-popup',
                  },
                });
                this.#certificationService.certificationSuccess$.next();
                this.#activeModal.dismiss();
              },
              error: (error) => {
                Swal.fire({
                  title: 'Erreur',
                  text: error.message,
                  icon: 'error',
                  customClass: {
                    confirmButton: 'swal-custom-confirm',
                    cancelButton: 'swal-custom-cancel',
                    popup: 'swal-custom-popup',
                  },
                });
              },
            });
        }
      });
    }
  }
}
