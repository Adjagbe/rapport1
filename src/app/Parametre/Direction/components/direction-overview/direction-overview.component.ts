import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavParametrageComponent } from 'src/app/Core/components/nav-parametrage/nav-parametrage.component';
import { GenericTableComponent } from 'src/app/Shared/Components/generic-table/generic-table.component';
import { columnsDirection } from 'src/app/Core/Constants/direction.constant';
import { Departement } from 'src/app/Models/direction.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParametrageService } from 'src/app/Core/Services/Parametrage/parametrage.service';
import { PaginationComponent } from 'src/app/Shared/Components/pagination/pagination.component';
import { ModalFilterComponent } from 'src/app/Shared/Components/modal-filter/modal-filter.component';
import Swal from 'sweetalert2';
import { DirectionManageComponent } from '../direction-manage/direction-manage.component';

@Component({
  selector: 'direction-overview',
  standalone: true,
  imports: [
    CommonModule,
    NavParametrageComponent,
    GenericTableComponent,
    PaginationComponent,
  ],
  templateUrl: './direction-overview.component.html',
  styleUrls: ['./direction-overview.component.scss'],
})
export class DirectionOverviewComponent {
  columnsDirection = columnsDirection;

  count: number = 0;

  statusColors = {
    Actif: 'actif',
    Inactif: 'inactif',
  };

  filteredList: { [cloumn: string]: string | number[] | number } | null = null;
  currentPage = 1;
  pageSize: number = 10;
  listDirection: Departement | any = [];
  modalRef: any;
  #ngModal = inject(NgbModal);
  #directionService = inject(ParametrageService);
  searchQuery: number = 0;
  index: number = 1;
  directionId: number = 0;

  ngOnInit() {
    this.getlistDirection();
    this.currentPage = 1;
  }

  onPageChange(page: any) {
    this.currentPage = page;
    this.getlistDirection();
  }

  onSearch(event: any) {
    this.currentPage = 1;
    this.index = 1;
    const term = event.target.value;
    if (term != '' && term != ' ') {
      this.getlistDirection({
        name: term,
      });
    } else {
      this.getlistDirection();
    }
  }

  onFilterDirection() {
    const modalRef = this.#ngModal.open(ModalFilterComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
    modalRef.componentInstance.columnsUser = columnsDirection;
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
    this.getlistDirection(filter);
    setTimeout(() => {
      // filter && this.#modalService.off();
    }, 900);
  }

  onDeleteClick(DirectionData: Departement) {
    let recupId = {
      idDepartment: DirectionData.idDepartment,
    };
    Swal.fire({
      title: 'Supprimer la direction',
      html: `Êtes-vous sûr de vouloir supprimer la direction  <span class='text-warning'>${DirectionData.name}</span> ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF7900',
      cancelButtonColor: '#1E1100',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.#directionService.DeleteDirection(recupId).subscribe({
          next: () => {
            this.getlistDirection();
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    });
  }

  lockDirection(item: Departement) {
    Swal.fire({
      title: "Désactivation d'une direction",
      html: `Attention vous êtes sur le point de désactiver la direction <span class='text-warning'>${item.name}</span> , Voulez-vous poursuivre cette action ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF7900',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        const isActive = (item.isActive = false);
        const DirectionData = { ...item, isActive };

        this.#directionService.updateDirection(DirectionData).subscribe({
          next: () => {},
          error: (error) => {
            console.error(error);
          },
        });
      }
    });
  }

  unlockDirection(item: Departement) {
    Swal.fire({
      title: "Activation d'une direction",
      html: `Attention vous êtes sur le point d'activer la direction <span class='text-warning'>${item.name}</span> , Voulez-vous poursuivre cette action ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF7900',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        const isActive = (item.isActive = true);
        const DirectionData = { ...item, isActive };

        this.#directionService.updateDirection(DirectionData).subscribe({
          next: () => {},
          error: (error) => {
            console.error(error);
          },
        });
      }
    });
  }

  getlistDirection(
    filter: { [cloumn: string]: string | number[] | number } | null = null
  ) {
    this.listDirection = null;
    this.currentPage;
    this.#directionService
      .getListDirection(
        {
          size: `${this.pageSize}`,
          index: `${this.currentPage - 1}`,
        },
        null,
        filter,
        this.searchQuery
      )
      .subscribe({
        next: (listDirectionResponse) => {
          let { items, count } = listDirectionResponse;
          console.log('liste direction', this.listDirection);

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
            this.listDirection = items;
            this.count = count;
          }
          this.listDirection = items;

          this.count = count;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onCreateDirection() {
    this.modalRef = this.#ngModal.open(DirectionManageComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
    this.modalRef.result.then(
      () => {
        this.getlistDirection();
      },
      () => {}
    );
  }

  onEditDirection(DirectionData : Departement) {
    console.log('Direction selectionnée :', DirectionData);
    this.directionId = DirectionData.idDepartment;
    this.modalRef = this.#ngModal.open(DirectionManageComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
    this.modalRef.componentInstance.directionId = this.directionId;
    this.modalRef.result.then(
      () => {
        this.getlistDirection();
      },
      () => {}
    );
  }
}
