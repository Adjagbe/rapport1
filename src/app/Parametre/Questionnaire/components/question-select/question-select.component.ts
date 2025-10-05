import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import {
  CloseIconComponent,
  EditIconComponent,
  PlusIconComponent,
  TrashIconComponent,
} from 'src/app/Core/icons';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  listeQuestion,
  listeReponse,
  Option,
  Question,
  QuestionApi,
  ReponseApi,
} from 'src/app/Models/questionnaire.model';
import { ParametrageService } from 'src/app/Core/Services/Parametrage/parametrage.service';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/Core/Services/loader.service';

@Component({
  selector: 'app-question-select',
  standalone: true,
  imports: [
    CommonModule,
    CloseIconComponent,
    ReactiveFormsModule,
    FormControlComponent,
    NgSelectModule,
    BtnGenericComponent,
    PlusIconComponent,
    NgbCollapseModule,
    EditIconComponent,
    TrashIconComponent,
    CloseIconComponent,
  ],
  templateUrl: './question-select.component.html',
  styleUrls: ['./question-select.component.scss'],
})
export class QuestionSelectComponent {
  isCollapsed = true;

  LibelleConfig: 'Ajouter' | 'Modifier' = 'Ajouter';
  @Input() selectedQuestionId: any;
  @Input() orderInFlow: any;
  @Input() isUpdate: any;
  @Input() questionType: any;
  @Output() refreshData: EventEmitter<void> = new EventEmitter<void>();

  #QuestionService = inject(ParametrageService);
  #loaderService = inject(LoaderService);
  #modalActive = inject(NgbActiveModal);
  #router = inject(Router);

  listReponse!: listeReponse[];
  listQuestion!: listeQuestion[];
  listStatus!: any;

  techForm: FormGroup;
  maxFields = 3;
  #formBuilder = inject(FormBuilder);
  isSubmit = false;
  collapsedStates: boolean[] = [];

  newAssignQuestion = this.#formBuilder.nonNullable.group({
    idCurrentQuestion: ['', Validators.required],
    idNextQuestion: ['', Validators.required],
    idOption: ['', Validators.required],
    orderInFlow: ['', Validators.required],
    actionType: ['', Validators.required],
    warning: ['', Validators.required],
    warningColor: this.fb.group({
      backgroundColor: ['', Validators.required],
      fontColor: ['', Validators.required],
      borderColor: ['', Validators.required],
    }),
  });

  ngOnInit() {

    const currentId = this.selectedQuestionId;
    const IsUpdate = this.isUpdate;
    if (IsUpdate && IsUpdate !== undefined && IsUpdate !== null) {
      this.LibelleConfig = 'Modifier';
      this.loadQuestionById(currentId);
    } else {
      this.LibelleConfig = 'Ajouter';
    }
    this.getListQuestion();
    this.getListReponse();
    this.getStatus();
  }



  // getListQuestion() {
  //   this.#QuestionService.getListQuestion().subscribe({
  //     next: (response) => {
  //       this.listQuestion = response.items;
  //       console.log('listQuestion', this.listQuestion);
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     },
  //   });
  // }
  filteredList: { [cloumn: string]: string | number[] | number } | null = null;
  currentPage = 1;
  pageSize: number = 100;
  searchQuery: number = 0;
  index: number = 1;
  count: number = 0;

  getListQuestion(
    filter: { [cloumn: string]: string | number[] | number } | null = null
  ) {
    this.listQuestion = [];
    this.currentPage;
    this.#QuestionService
      .getListQ(
        {
          size: `${this.pageSize}`,
          index: `${this.currentPage - 1}`,
        },
        null,
        filter,
        this.searchQuery
      )
      .subscribe({
        next: (listQresponse) => {
          let { items, count } = listQresponse;
          console.log('liste question', this.listQuestion);

          // Filtrage insensible à la casse sur tous les champs du filtre
          if (filter) {
            Object.keys(filter).forEach((key) => {
              const value = filter[key];
              if (typeof value === 'string' && value.trim() !== '') {
                items = items.filter((u: any) =>
                  (u as any)[key]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                );
              }
            });
            count = items.length;
          } else {
            this.listQuestion = items;
            this.count = count;
          }
          this.listQuestion = items;

          this.count = count;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getListReponse(
    filter: { [cloumn: string]: string | number[] | number } | null = null
  ) {
    this.listReponse = [];
    this.currentPage;

    this.#QuestionService
      .getListR(
        {
          size: `${this.pageSize}`,
          index: `${this.currentPage - 1}`,
        },
        null,
        filter,
        this.searchQuery
      )
      .subscribe({
        next: (response) => {
          let { items, count } = response;
          console.log('liste reponse', response);

          // Filtrage insensible à la casse sur tous les champs du filtre
          if (filter) {
            Object.keys(filter).forEach((key) => {
              const value = filter[key];
              if (typeof value === 'string' && value.trim() !== '') {
                items = items.filter((u: any) =>
                  (u as any)[key]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                );
              }
            });
            count = items.length;
          } else {
            this.listReponse = items;
            this.count = count;
          }
          this.listReponse = items;

          this.count = count;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getStatus() {
    this.#QuestionService.getStatusAssignQuestion().subscribe({
      next: (response) => {
        this.listStatus = response.items;
        console.log('listStatus', this.listStatus);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  isDisable() : boolean {
    return (this.newAssignQuestion.get('idOption')?.valid &&
        this.newAssignQuestion.get('idNextQuestion')?.valid) ||
        (this.newAssignQuestion.get('idOption')?.valid && 
        this.newAssignQuestion.get('actionType')?.valid) ? false : true;
  }

  OnSubmitAjout() {
    this.#loaderService.show();
    let DataAssignQuestion = {
      idCurrentQuestion: this.selectedQuestionId,
      idNextQuestion: this.newAssignQuestion.value.idNextQuestion,
      idOption: this.newAssignQuestion.value.idOption,
      orderInFlow: this.orderInFlow,
      actionType: this.newAssignQuestion.value.actionType,
      warning: this.newAssignQuestion.value.warning,
      warningColor: this.newAssignQuestion.value.warningColor,
    };
    this.isSubmit = true;
    // console.log('donnée envoyé a la BD', DataAssignQuestion);

    if ( (this.newAssignQuestion.get('idOption')?.valid &&
        this.newAssignQuestion.get('idNextQuestion')?.valid) ||
        (this.newAssignQuestion.get('idOption')?.valid && 
        this.newAssignQuestion.get('actionType')?.valid) ){
          
      this.#QuestionService.AssignQuestion(DataAssignQuestion).subscribe({
        next: (reqResponse) => {
          this.isSubmit = false;
          if (reqResponse && this.isErrorCode(reqResponse.status.code)) {
            this.#loaderService.hide();
            this.close();
            Swal.fire({
              toast: true,
              icon: 'error',
              title: reqResponse.status.message,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.refreshData.emit();
          } else if (!reqResponse.hasError) {
            this.refreshData.emit();
            this.#loaderService.hide();
            this.close();
            Swal.fire({
              toast: true,
              icon: 'success',
              title: 'La question a été assigné avec succès.',
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          } else return;
          this.#loaderService.hide();
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

  isNotQuestionNext(option: string): boolean {
    return ['je_ne_sais_pas'].includes(option);
  }

  constructor(private fb: FormBuilder) {
    // this.techForm = this.fb.group({
    //   // technologies: this.fb.array([this.createTechField()]),
    //   technologies: this.fb.array([]),
    // });

    this.techForm = this.fb.group({
      idCurrentQuestion: ['', Validators.required],
      options: this.fb.array([]), // existantes (API)
      technologies: this.fb.array([]), // nouvelles
    });
  }

  // Récupération et patch des données de l'API
  loadQuestionById(id: number) {
    this.#QuestionService.getQuestionAssignById(id).subscribe((data: any) => {
      this.#loaderService.show();
      const item = data.item;

      // patcher la question principale
      this.techForm.patchValue({
        idCurrentQuestion: item.idQuestion,
      });

      // vider le formArray
      this.optionsFormArray.clear();
      this.collapsedStates = [];

      // injecter les options reçues
      item.options.forEach((option: any, index: number) => {
        this.#loaderService.show();
        this.optionsFormArray.push(
          this.fb.group({
            idOption: option.idOption,
            optionValue: option.optionValue, // "OUI" / "NON"
            optionText: option.optionText, // affichage
            idNextQuestion: option.idNextQuestion,
            actionType: option.actionType, // par défaut
            warning: option.warning,
            idFlow: option.idFlow,
            nextQuestionText: option.nextQuestionText,
            warningColor: this.fb.group({
              backgroundColor: option.warningColor?.backgroundColor ?? null,
              fontColor: option.warningColor?.fontColor ?? null,
              borderColor: option.warningColor?.borderColor ?? null,
            }),
          })
        );
        this.#loaderService.hide();
        this.collapsedStates[index] = true; // par défaut : fermé
      });
      this.#loaderService.hide();
      // console.log('options chargées =>', this.optionsFormArray.value);
    });
  }

  toggleCollapse(index: number) {
    this.collapsedStates[index] = !this.collapsedStates[index];
  }

  getQuestionText(idNextQuestion: number | null): string {
    if (!idNextQuestion) {
      return '';
    }
    const q = this.listQuestion.find((q) => q.idQuestion === idNextQuestion);
    return q ? q.questionText : '';
  }

  // getter pour le FormArray
  get technologies(): FormArray {
    return this.techForm.get('technologies') as FormArray;
  }

  get optionsFormArray(): FormArray {
    return this.techForm.get('options') as FormArray;
  }

  // créer un champ
  createTechField(): FormGroup {
    return this.fb.group({
      idCurrentQuestion: ['', Validators.required],
      idNextQuestion: ['', Validators.required],
      idOption: ['', Validators.required],
      orderInFlow: ['', Validators.required],
      actionType: ['', Validators.required],
      warning: ['', Validators.required],
      warningColor: this.fb.group({
        backgroundColor: ['', Validators.required],
        fontColor: ['', Validators.required],
        borderColor: ['', Validators.required],
      }),
    });
  }

  // ajouter un champ
  addTechnology(): void {
    if (this.technologies.length < this.maxFields) {
      this.technologies.push(this.createTechField());
    }
  }

  // supprimer un champ
  removeTechnology(index: number): void {
    this.technologies.removeAt(index);
  }

  // récupérer les valeurs
  onSubmitUpdate(): void {
    if (this.techForm.invalid) {
      this.techForm.markAllAsTouched();
      return;
    }

    // On récupère les valeurs du formulaire
    const formValue = this.techForm.value;

    // on deconstruit
    const existingOptions = formValue.options.map((opt: any, index: number) => {
      return {
        // idCurrentQuestion: formValue.idCurrentQuestion,
        idOption: opt.idOption,
        idNextQuestion: opt.idNextQuestion,
        actionType: opt.actionType,
        idFlow: opt.idFlow,
        // orderInFlow: this.orderInFlow
        warning: opt.warning,
        warningColor: opt.warningColor
          ? {
              backgroundColor: opt.warningColor.backgroundColor ?? null,
              fontColor: opt.warningColor.fontColor ?? null,
              borderColor: opt.warningColor.borderColor ?? null,
            }
          : null,
      };
    });

    // Regrouper tout
    const payload = {
      idCurrentQuestion: this.selectedQuestionId,
      // idNewQuestion:null,
      idNewQuestion:
        formValue.idCurrentQuestion == this.selectedQuestionId
          ? null
          : formValue.idCurrentQuestion,
      orderInFlow: this.orderInFlow,
      options: [...existingOptions],
    };

    console.log('Payload envoyé =>', payload);

    this.isSubmit = true;
    if (this.techForm.valid) {
      this.#QuestionService.updateAssignQuestion(payload).subscribe({
        next: (reqResponse) => {
          this.isSubmit = false;
          if (reqResponse && this.isErrorCode(reqResponse.status.code)) {
            this.#loaderService.hide();
            this.close();
            Swal.fire({
              toast: true,
              icon: 'error',
              title: reqResponse.status.message,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.refreshData.emit();
          } else if (!reqResponse.hasError) {
            this.refreshData.emit();
            this.#loaderService.hide();
            this.close();
            Swal.fire({
              toast: true,
              icon: 'success',
              title: 'La question assignée a été modifié avec succès.',
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          } else return;
          this.#loaderService.hide();
        },
        error: (error) => {
          this.isSubmit = false;
          console.error(error);
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

  deleteOptionQuestion(optionData: any) {
    let recupId = {
      idQuestion: this.techForm.get('idCurrentQuestion')?.value,
      idOption: optionData.idOption, // l’option à supprimer
      idFlow: optionData.idFlow,
    };

    // console.log('rfrdf', recupId);
    Swal.fire({
      title: 'Supprimer le questionnaire',
      html: `Êtes-vous sûr de vouloir supprimer la réponse 
          "<strong>${optionData.optionText}</strong>" <br> <br> 
          </span>`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#000000',
      confirmButtonColor: '#FF7900',

      cancelButtonText: 'Non',
      confirmButtonText: 'Oui',

      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.#loaderService.show();
        this.#QuestionService.DeleteOptionQ(recupId).subscribe({
          next: () => {
            Swal.fire({
              toast: true,
              icon: 'success',
              title: 'Réponse supprimée avec succès.',
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.refreshData.emit();
            this.close();
            this.#loaderService.hide();
          },
          error: (error) => {
            console.error(error);
            this.#loaderService.hide();
            this.close();
          },
        });
      }
    });
  }

  

  isDisableAssign(index: number) : boolean {
    const techGroup = this.technologies.at(index) as FormGroup;
    return (techGroup.get('idOption')?.valid &&
        techGroup.get('idNextQuestion')?.valid) ||
        (techGroup.get('idOption')?.valid && 
        techGroup.get('actionType')?.valid) ? false : true;
  }

  isIdNextQuestionAssigned(index: number): boolean {
    const techGroup = this.technologies.at(index) as FormGroup;
    return  techGroup.get('idNextQuestion')?.value ? true : false;
  }

  isActionTypeAssigned(index: number): boolean {
    const techGroup = this.technologies.at(index) as FormGroup;
    return  techGroup.get('actionType')?.value ? true : false;
  }


  OnSubmitAssign(index: number) {
    this.#loaderService.show();

    const techGroup = this.technologies.at(index) as FormGroup;

    let DataAssignQuestion = {
      idCurrentQuestion: this.selectedQuestionId,
      idNextQuestion: techGroup.value.idNextQuestion,
      idOption: techGroup.value.idOption,
      orderInFlow: this.orderInFlow,
      actionType: techGroup.value.actionType,
      warning: techGroup.value.warning,
      warningColor: techGroup.value.warningColor,
    };

    console.log('Payload envoyé assign =>', DataAssignQuestion);

    this.isSubmit = true;

    if ((techGroup.get('idOption')?.valid &&
        techGroup.get('idNextQuestion')?.valid) ||
        (techGroup.get('idOption')?.valid && 
        techGroup.get('actionType')?.valid)) {
      this.#QuestionService.AssignQuestion(DataAssignQuestion).subscribe({
        next: (reqResponse) => {
          this.isSubmit = false;
          this.#loaderService.hide();
          if (reqResponse && this.isErrorCode(reqResponse.status.code)) {
            this.close();
            Swal.fire({
              toast: true,
              icon: 'error',
              title: reqResponse.status.message,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
            });
          } else if (!reqResponse.hasError) {
            this.refreshData.emit();
            this.close();
            Swal.fire({
              toast: true,
              icon: 'success',
              title: 'La question a été assignée avec succès.',
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
            });
          }
        },
        error: (error) => {
          this.isSubmit = false;
          this.#loaderService.hide();
          console.error(error);
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

  close() {
    this.#modalActive.close();
    this.newAssignQuestion.reset();
    this.#router.navigate(['/parametrage/questionnaires']);
  }
}
