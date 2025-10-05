import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent } from 'src/app/Shared/Components/generic-table/generic-table.component';
import { PaginationComponent } from 'src/app/Shared/Components/pagination/pagination.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParametrageService } from 'src/app/Core/Services/Parametrage/parametrage.service';
import { listeReponse } from 'src/app/Models/questionnaire.model';
import { columnsReponse } from 'src/app/Core/Constants/questionnaire.constant';
import { ModalFilterComponent } from 'src/app/Shared/Components/modal-filter/modal-filter.component';
import { GestionReponseManageComponent } from '../gestion-reponse-manage/gestion-reponse-manage.component';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { GenericTableV4Component } from "src/app/Shared/Components/generic-table-v4/generic-table-v4.component";
import { NavParametrageComponent } from "src/app/Core/components/nav-parametrage/nav-parametrage.component";

@Component({
  selector: 'gestion-reponse-overview',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, PaginationComponent, RouterLink, GenericTableV4Component, NavParametrageComponent],
  templateUrl: './gestion-reponse-overview.component.html',
  styleUrls: ['./gestion-reponse-overview.component.scss'],
})
export class GestionReponseOverviewComponent {
  columnsReponse = columnsReponse;
  count: number = 0;

  filteredList: { [cloumn: string]: string | number[] | number } | null = null;
  currentPage = 1;
  pageSize: number = 10;
  modalRef: any;
  #ngModal = inject(NgbModal);
  searchQuery: number = 0;
  index: number = 1;
  reponseId : number =0;

  #QuestionService = inject(ParametrageService);
  listReponse: listeReponse | any = [];

  ngOnInit() {
    this.getListReponse();
    this.currentPage = 1;
  }

  onPageChange(page: any) {
    this.currentPage = page;
    this.getListReponse();
  }

  onSearch(event: any) {
    this.currentPage = 1;
    this.index = 1;
    const term = event.target.value;
    if (term != '' && term != ' ') {
      this.getListReponse({
        optionText: term,
      });
    } else {
      this.getListReponse();
    }
  }

  getListReponse(
    filter: { [cloumn: string]: string | number[] | number } | null = null
  ) {
    this.listReponse = null;
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
        next: (listQresponse) => {
          let { items, count } = listQresponse;
          console.log('liste reponse', this.listReponse);

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

  onFilterReponse() {
    const modalRef = this.#ngModal.open(ModalFilterComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
    modalRef.componentInstance.columnsUser = columnsReponse;
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
    this.getListReponse(filter);
    setTimeout(() => {
      // filter && this.#modalService.off();
    }, 900);
  }

  onCreateReponse() {
    this.modalRef = this.#ngModal.open(GestionReponseManageComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
      // Écoute l'événement refreshTable
    this.modalRef.componentInstance.refreshTable.subscribe(() => {
      this.getListReponse();
    });
  }

  onEditClick(ReponseData: any) {
    console.log('Reponse selectionnée :', ReponseData);
    this.reponseId = ReponseData.idOptionTemplate;
    this.modalRef = this.#ngModal.open(GestionReponseManageComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
    this.modalRef.componentInstance.reponseId = this.reponseId;
    // Écoute l'événement refreshTable
    this.modalRef.componentInstance.refreshTable.subscribe(() => {
      this.getListReponse();
    });
  }

  onDeleteClick(ReponseData: any) {
    let recupId = {
      idOptionTemplate: ReponseData.idOptionTemplate,
    };
    Swal.fire({
      title: 'Supprimer la reponse',
      html: `Êtes-vous sûr de vouloir supprimer la reponse  <span class='text-warning'>${ReponseData.optionText}</span> ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF7900',
      cancelButtonColor: '#1E1100',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.#QuestionService.DeleteReponseG(recupId).subscribe({
          next: () => {
            this.getListReponse();
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    });
  }

}
