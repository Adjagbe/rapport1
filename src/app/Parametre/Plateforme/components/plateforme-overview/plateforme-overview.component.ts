import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { NavParametrageComponent } from 'src/app/Core/components/nav-parametrage/nav-parametrage.component';
import { GenericTableComponent } from 'src/app/Shared/Components/generic-table/generic-table.component';
import { PaginationComponent } from 'src/app/Shared/Components/pagination/pagination.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlateformeManageComponent } from '../plateforme-manage/plateforme-manage.component';
import { ModalFilterComponent } from 'src/app/Shared/Components/modal-filter/modal-filter.component';
import { columnsPlateforme } from 'src/app/Core/Constants/plateforme.constant';
import { ParametrageService } from 'src/app/Core/Services/Parametrage/parametrage.service';

import {
  Application,
  ApplicationApiResponse,
} from 'src/app/Models/plateforme.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'plateforme-overview',
  standalone: true,
  imports: [
    CommonModule,
    BtnGenericComponent,
    NavParametrageComponent,
    GenericTableComponent,
    PaginationComponent,
  ],
  templateUrl: './plateforme-overview.component.html',
  styleUrls: ['./plateforme-overview.component.scss'],
})
export class PlateformeOverviewComponent {
  
  columnsPlateforme = columnsPlateforme;

  count: number = 0;

  statusColors = {
    Actif: 'actif',
    Inactif: 'inactif',
  };

  filteredList: { [cloumn: string]: string | number[] | number } | null = null;
  currentPage = 1;
  pageSize: number = 10;
  listeApplication: Application | any = [];
  modalRef: any;
  #ngModal = inject(NgbModal);
  #plateformeService = inject(ParametrageService);
  searchQuery: number = 0;
  index: number = 1;
  plateformeId: number = 0;

  ngOnInit() {
    this.getlistApplication();
    this.currentPage = 1;
  }

  onPageChange(page: any) {
    this.currentPage = page;
    this.getlistApplication();
  }

  onSearch(event: any) {
    this.currentPage = 1;
    this.index = 1;
    const term = event.target.value;
    if (term != '' && term != ' ') {
      this.getlistApplication({
        name: term,
      });
    } else {
      this.getlistApplication();
    }
  }

  onFilterPlateforme() {
    const modalRef = this.#ngModal.open(ModalFilterComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
    modalRef.componentInstance.columnsUser = columnsPlateforme;
    modalRef.componentInstance.filteredList = this.filteredList;
    // Écoute l'événement du modal
    modalRef.componentInstance.emitChangeFilter.subscribe((filter: any) => {
      this.onFilterChanged(filter); //  applique le filtre
      modalRef.close(); // ferme le modal après le filtre
    });
  }

  onCreatePlateforme() {
    this.modalRef = this.#ngModal.open(PlateformeManageComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
    this.modalRef.result.then(
      () => {
        this.getlistApplication();
      },
      () => {}
    );
  }

  onEditPlateforme(PlateformeData: Application) {
    console.log('Plateforme selectionnée :', PlateformeData);
    this.plateformeId = PlateformeData.idApplication;
    this.modalRef = this.#ngModal.open(PlateformeManageComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
    this.modalRef.componentInstance.plateformeId = this.plateformeId;
    this.modalRef.result.then(
      () => {
        this.getlistApplication();
      },
      () => {}
    );
  }

  onFilterChanged(filter: any) {
    this.currentPage = 1;
    this.index = 1;
    this.filteredList = filter;
    this.getlistApplication(filter);
    setTimeout(() => {
      // filter && this.#modalService.off();
    }, 900);
  }

  onDeleteClick(PlateformeData: Application) {
    let recupId = {
      idApplication: PlateformeData.idApplication,
    };
    Swal.fire({
      title: 'Supprimer la plateforme',
      html: `Êtes-vous sûr de vouloir supprimer la plateforme  <span class='text-warning'>${PlateformeData.name}</span> ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF7900',
      cancelButtonColor: '#1E1100',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.#plateformeService.DeletePlateforme(recupId).subscribe({
          next: () => {
            this.getlistApplication();
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    });
  }

  lockPlateforme(item: Application) {
    Swal.fire({
      title: "Désactivation d'une plateforme",
      html: `Attention vous êtes sur le point de désactiver la plateforme <span class='text-warning'>${item.name}</span> , Voulez-vous poursuivre cette action ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF7900',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed){
       
        const isActive = item.isActive = false
        const PlateformeData = {...item, isActive}
        
        this.#plateformeService.updatePlateforme(PlateformeData).subscribe({
          next: () => {
          },
          error: (error) => {
            console.error(error);
          },
        });
        
      }
    });
  }

  unlockPlateforme(item: any) {
     Swal.fire({
      title: "Activation d'une plateforme",
      html: `Attention vous êtes sur le point d'activer la plateforme <span class='text-warning'>${item.name}</span> , Voulez-vous poursuivre cette action ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF7900',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed){

        const isActive = item.isActive = true
        const PlateformeData = {...item, isActive}
        
        this.#plateformeService.updatePlateforme(PlateformeData).subscribe({
          next: () => {
          },
          error: (error) => {
            console.error(error);
          },
        });
        
      }
    });
  }

  getlistApplication(
    filter: { [cloumn: string]: string | number[] | number } | null = null
  ) {
    this.listeApplication = null;
    this.currentPage;
    this.#plateformeService
      .getListPlateforme(
        {
          size: `${this.pageSize}`,
          index: `${this.currentPage - 1}`,
        },
        null,
        filter,
        this.searchQuery
      )
      .subscribe({
        next: (listApplicationResponse) => {
          let { items, count } = listApplicationResponse;
          console.log('liste plateforme 2', this.listeApplication);

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
            this.listeApplication = items;
            this.count = count;
          }
          this.listeApplication = items;

          this.count = count;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
