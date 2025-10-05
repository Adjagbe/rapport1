import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from 'src/app/Core/Services/loader.service';
import { ParametrageService } from 'src/app/Core/Services/Parametrage/parametrage.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import {
  listeQuestion,
  listeReponse,
} from 'src/app/Models/questionnaire.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CloseIconComponent } from 'src/app/Core/icons';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-first-question',
  standalone: true,
  imports: [
    CommonModule,
    FormControlComponent,
    NgSelectModule,
    CloseIconComponent,
    BtnGenericComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './first-question.component.html',
  styleUrls: ['./first-question.component.scss'],
})
export class FirstQuestionComponent {
  LibelleConfig = 'Ajouter';
  @Input() orderInFlow: any;
  @Output() refreshData: EventEmitter<void> = new EventEmitter<void>();

  #QuestionService = inject(ParametrageService);
  #loaderService = inject(LoaderService);
  #modalActive = inject(NgbActiveModal);
  #router = inject(Router);
  #formBuilder = inject(FormBuilder);

  listReponse!: listeReponse[];
  listQuestion!: listeQuestion[];

  newAssignQuestion = this.#formBuilder.nonNullable.group({
    idCurrentQuestion: ['', Validators.required],
    orderInFlow: ['', Validators.required],
  });

  isSubmit = false;

  ngOnInit() {
    this.getListQuestion();
  }

  filteredList: { [cloumn: string]: string | number[] | number } | null = null;
  currentPage = 1;
  pageSize: number = 10;
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

  OnSubmitAjout() {
    if (this.isSubmit) {
      return;
    }
    this.#loaderService.show();
    let DataAssignQuestion = {
      idCurrentQuestion: this.newAssignQuestion.value.idCurrentQuestion,
      orderInFlow: this.orderInFlow,
    };
    this.isSubmit = true;

    if (this.newAssignQuestion.get('idCurrentQuestion')?.valid) {
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
            this.isSubmit = false;
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

  close() {
    this.#modalActive.close();
    this.newAssignQuestion.reset();
    this.#router.navigate(['/parametrage/questionnaires']);
  }
}
