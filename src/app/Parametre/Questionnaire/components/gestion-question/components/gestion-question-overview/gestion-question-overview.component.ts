import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent } from 'src/app/Shared/Components/generic-table/generic-table.component';
import { PaginationComponent } from 'src/app/Shared/Components/pagination/pagination.component';
import { columnsQuestion } from 'src/app/Core/Constants/questionnaire.constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParametreComponent } from 'src/app/Parametre/parametre.component';
import { listeQuestion } from 'src/app/Models/questionnaire.model';
import { ModalFilterComponent } from 'src/app/Shared/Components/modal-filter/modal-filter.component';
import { ParametrageService } from 'src/app/Core/Services/Parametrage/parametrage.service';
import { GestionQuestionManageComponent } from '../gestion-question-manage/gestion-question-manage.component';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { GenericTableV4Component } from "src/app/Shared/Components/generic-table-v4/generic-table-v4.component";
import { NavParametrageComponent } from "src/app/Core/components/nav-parametrage/nav-parametrage.component";

@Component({
  selector: 'gestion-question-overview',
  standalone: true,
  imports: [
    CommonModule,
    GenericTableComponent,
    PaginationComponent,
    RouterLink,
    GenericTableV4Component,
    NavParametrageComponent
],
  templateUrl: './gestion-question-overview.component.html',
  styleUrls: ['./gestion-question-overview.component.scss'],
})
export class GestionQuestionOverviewComponent {
  columnsQuestion = columnsQuestion;
  count: number = 0;

  filteredList: { [cloumn: string]: string | number[] | number } | null = null;
  currentPage = 1;
  pageSize: number = 10;
  modalRef: any;
  #ngModal = inject(NgbModal);
  searchQuery: number = 0;
  index: number = 1;

  listQuestion: listeQuestion | any = [];
  questionId: number =0

  #QuestionService = inject(ParametrageService);

  ngOnInit() {
    this.getlistQuestion();
    this.currentPage = 1;
  }

  onPageChange(page: any) {
    this.currentPage = page;
    this.getlistQuestion();
  }

  onSearch(event: any) {
    this.currentPage = 1;
    this.index = 1;
    const term = event.target.value;
    if (term != '' && term != ' ') {
      this.getlistQuestion({
        questionText: term,
      });
    } else {
      this.getlistQuestion();
    }
  }

  onFilterQuestions() {
    const modalRef = this.#ngModal.open(ModalFilterComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
    modalRef.componentInstance.columnsUser = columnsQuestion;
    modalRef.componentInstance.filteredList = this.filteredList;
    // Écoute l'événement du modal
    modalRef.componentInstance.emitChangeFilter.subscribe((filter: any) => {
      this.onFilterChanged(filter); //  applique le filtre
      modalRef.close(); // ferme le modal après le filtre
    });
  }

  onFilterChanged(filter: any) {
    this.currentPage = 1;
    this.index = 1;
    this.filteredList = filter;
    this.getlistQuestion(filter);
    setTimeout(() => {
      // filter && this.#modalService.off();
    }, 900);
  }

  getlistQuestion(
    filter: { [cloumn: string]: string | number[] | number } | null = null
  ) {
    this.listQuestion = null;
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

  onCreateQuestions() {
    this.modalRef = this.#ngModal.open(GestionQuestionManageComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
     // Écoute l'événement refreshTable
    this.modalRef.componentInstance.refreshTable.subscribe(() => {
      this.getlistQuestion();
    });
    // this.modalRef.result.then(
    //   () => {
    //     alert('gggg')
    //     this.getlistQuestion();
    //   },
    //   () => {}
    // );
  }

  onEditClick(QuestionData: any) {
      console.log('Question selectionnée :', QuestionData);
      this.questionId = QuestionData.idQuestion;
      this.modalRef = this.#ngModal.open(GestionQuestionManageComponent, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        windowClass: 'rounded',
      });
      this.modalRef.componentInstance.questionId = this.questionId;
       // Écoute l'événement refreshTable
      this.modalRef.componentInstance.refreshTable.subscribe(() => {
        this.getlistQuestion();
      });
      // this.modalRef.result.then(
      //   () => {
      //     this.getlistQuestion();
      //   },
      //   () => {}
      // );
    }
  

  onDeleteClick(QuestionData: any) {
    let recupId = {
      idQuestion: QuestionData.idQuestion,
    };
    Swal.fire({
      title: 'Supprimer la question',
      html: `Êtes-vous sûr de vouloir supprimer la question  <span class='text-warning'>${QuestionData.questionText}</span> ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF7900',
      cancelButtonColor: '#1E1100',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.#QuestionService.DeleteQuestionG(recupId).subscribe({
          next: () => {
            this.getlistQuestion();
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    });
  }
}
