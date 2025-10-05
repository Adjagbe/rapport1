import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
// import { ApiRole, ListRole, RolePreviewCardModel } from 'src/app/shared/models/roles.model';
import Swal from 'sweetalert2';
// import { ModalService } from 'src/app/core/services/modal.service';
// import { UsersService } from 'src/app/core/services/users.service';
// import { DateUtils } from 'src/app/core/utils/date.utils';
// import { ProfilsInfosComponent } from '../profils-infos/profils-infos.component';
import { ManageProfilsComponent } from '../manage-profils/manage-profils.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavAdministrationComponent } from 'src/app/Core/components/nav-administration/nav-administration.component';
import { UsersService } from 'src/app/Core/Services/users.service';
import { columnsProfils, PROFILS_FILTER_FORM_OPTIONS } from 'src/app/Core/Constants/profils.constant';
import { ApiRole, ListRole, RolePreviewCardModel } from 'src/app/Models/roles.model';
import { ProfilsService } from 'src/app/Core/Services/profils.service';
import { GenericTableComponent } from 'src/app/Shared/Components/generic-table/generic-table.component';
import { PaginationComponent } from 'src/app/Shared/Components/pagination/pagination.component';
import { ModalFilterComponent } from 'src/app/Shared/Components/modal-filter/modal-filter.component';

@Component({
  selector: 'profils-management-overview',
  standalone: true,
  imports: [CommonModule, NavAdministrationComponent, GenericTableComponent, ManageProfilsComponent, PaginationComponent,],
  templateUrl: './profils-management-overview.component.html',
  styleUrls: ['./profils-management-overview.component.scss'],
})
export class ProfilsManagementOverviewComponent implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  // #modalService = inject(ModalService);
  #rolesService = inject(ProfilsService);
  #modalServices = inject(NgbModal);
  #userService = inject(UsersService);
  // #utils = inject(DateUtils);
  // @Input() currentId: any;
  // COMMON_TEXTS = COMMON_TEXTS;
  columnsProfils = columnsProfils;

  PROFILS_FILTER_FORM_OPTIONS = PROFILS_FILTER_FORM_OPTIONS

  isListRole = false;
  // size est le nbr d'element a afficher par page, a set nous meme cote front
  pageSize: number = 7;
  // index-1 2- 3- ...etc
  index: number = 1;
  // le nombre total d'element recuperer depuis le back-end
  count!: number;

  selectedUser: RolePreviewCardModel | null = null;

  statusColors = {
    Actif: 'actif',
    Inactif: 'inactif',
  };

  userListeActions: any;
  header: string = "";
  profilsId: string = "";

  modalRef: any;

  // KPI
   actifProfil!: number;
   inactifProfil!: number;
   kpiCradList = [
    { title: 'Total', value: 10339 },
    { title: 'Actifs', value: this.actifProfil },
    { title: 'Inactifs', value: this.inactifProfil },
  ];

  ngOnInit(): void {
    this.getListRole();
    // this.getListeTotalActifRole();
    // this.getListRoles()
    // this.userListeActions = this.#userService.getActionUser('PARAMÈTRE', 'ACTIONS', '')
    // this.userListeActions = this.#userService.getActionUser(
    //   'ADMINISTRATION',
    //   'PROFIL'
    // );
  }

  modalToRender: 'role' | 'filter' | 'new_profil' = 'role';
  
  onSeeClick(selectedIndicateur: ApiRole) {
    this.modalToRender = 'role';
    console.log('Offre à voir:', selectedIndicateur);
    const {
      fonctionnalites,
      libelle,
      statut,
      code,
      ...rest
    } = selectedIndicateur;
    this.selectedUser = {
      ...rest,
      fonctionnalites,
      libelle,
      statut,
      code,
    };
    console.log("le rendu avant affchage des donnes à VOIR //////////////////////////", this.selectedUser);

    // this.#modalService.on();
  }

  onFilterChanged(filter: any) {
    this.currentPage = 1; 
    this.index = 1;
    this.filteredList = filter;
    console.log('filter recu du filter form: ', filter);
    this.getListRole(filter);
    setTimeout(() => {
      // filter && this.#modalService.off();
    }, 900);
  }

  // onSearch(query: string | number) {
  //   console.log(' ******************+++++++++++++++++++', query);
  //   this.searchQuery = +query;
  //   this.index = 1
  //   console.log(this.searchQuery)
  //   this.getListRole(this.filteredList);
  // }

  onSearch(event: any) {
    this.currentPage = 1; 
    this.index = 1;
    const term = event.target.value;
    if(term != ''){
      this.getListRole({
      libelle: term
    });
    }else{
      this.getListRole()
    }
   
  }


  onFilterFormChange(filter: { [cloumn: string]: string }) {
    this.index = 1
    console.log('filter form change: ', filter);
    const column = Object.keys(filter)[0];

    if (['dateDebut', 'dateFin'].includes(column)) {
      // this.filteredList = this.getCorrectedDate(filter[column], column);
      this.getListRole();
      return;
    }
    this.filteredList = filter;
    this.getListRole();
  }

  // getCorrectedDate(date: string, column: string) {
  //   const _date = this.#utils.formatDate(date);
  //   return {
  //     [column]: _date,
  //   };
  // }

  onCreateProfilClick() {
    this.modalToRender = 'new_profil';
    this.header = "Creation d'un profil"
    console.log('CTA bouton cliqué');
    this.modalRef = this.#modalServices.open(ManageProfilsComponent, 
    {size: 'xl',centered: true, keyboard: false, backdrop: 'static'});
   this.modalRef.componentInstance.profilsId = ""

     this.modalRef.result.then(() => {
        this.getListRole()
    }, () => {

    });
    // this.#modalService.on();
  }

  onFilterProfil() {
      const modalRef = this.#modalServices.open(ModalFilterComponent, {
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        windowClass: 'rounded',
      });
        modalRef.componentInstance.columnsUser = columnsProfils
        modalRef.componentInstance.filteredList = this.filteredList;
        // Écoute l'événement du modal
        modalRef.componentInstance.emitChangeFilter.subscribe((filter: any) => {
          this.onFilterChanged(filter); //  applique le filtre
          modalRef.close(); // ferme le modal après le filtre
        });
  }

  onEditClick(selectedRole: ApiRole) {
    console.log('Offre sélectionnée:', selectedRole);
    this.profilsId = selectedRole.id.toString();
    this.modalToRender = 'new_profil';
    this.header = "Modification d'un profil"
    console.log('CTA bouton cliqué');

   this.modalRef = this.#modalServices.open(ManageProfilsComponent, 
    {size: 'xl',centered: true, keyboard: false, backdrop: 'static'});
   this.modalRef.componentInstance.profilsId = this.profilsId;

   this.modalRef.result.then(() => {
        this.getListRole()
    }, () => {

    });
  //  .result.then((result) => {
  //       }).catch((res) => {
  //         this.getListRole()
  //       });
    // this.modalRef.componentInstance.profilsId = this.profilsId
    // this.#modalService.on();

    // this.#rolesService.selectRole(selectedRole);
    // const config: NavigationExtras = {
    //   queryParams: {
    //     edit: selectedRole.id
    //   },
    //   relativeTo: this.#route
    // }
    // this.#router.navigate(["enregistrement_de_role"], config)
  }

  // onPageChange(config: {
  //   [key: string]: string;
  //   index: string;
  //   pageSize: string;
  // }) {
  //   console.log('pagination: ', config);
  //   this.index = +config.index + 1;
  //   this.pageSize = +config.pageSize;

  //   this.getListRole();
  // }

  currentPage = 1;
  onPageChange(page: number) {
    this.currentPage = page;
      this.getListRole();
  }

  onFilterClick() {
    // this.pageSize = 2;
    this.modalToRender = 'filter';
    // this.#modalService.on();
  }


  listRole: ListRole | any = [];
  filteredList: { [column: string]: string | number[] | number } | null = null;
  searchQuery: number = 0;

  getListRole(filter: { [column: string]: string | number[] | number } | null = null) {
    this.isListRole = true;
    this.listRole = null;
    this.currentPage 
    this.#rolesService
      .getByCriteriaRole({
        size: `${this.pageSize}`,
        index: `${this.currentPage - 1}`,
      },
        null,
        filter,
        // this.filteredList,
        this.searchQuery)
      .subscribe({
        next: (listRoleResponse) => {
          let { items, count } = listRoleResponse;

          if (filter) {
            Object.keys(filter).forEach(key => {
              const value = filter[key];
              if (typeof value === 'string' && value.trim() !== '') {
                items = items.filter(u =>
                  (u as any)[key]?.toString().toLowerCase().includes(value.toLowerCase())
                );
              }
            });
            count = items.length;
          }

          this.listRole = items;
          console.log(
            'les données sont bel et bien remonté : ',
            this.listRole
          );
          this.isListRole = false;
          this.count = count;
          // this.getListeTotalActifRole();
          console.log(
            'la liste des roles créées est : ',
            this.listRole
          );
        },
        error: (error) => {
          this.isListRole = false;
          console.error(error);
        },
      });
  }

  listRoles: Array<{
    label: string;
    id: number;
  }> = [];
  
  getListRoles() {
    // this.isListRole = true;
    this.listRoles = [];
    this.#rolesService
      .getByCriteriaRole({
        size: '',
        index: '',
        ordre: 'ASC',
        champs: 'libelle',
        id: ''
      }, null)
      .subscribe({
        next: (listRoleResponse) => {
          const { items, count } = listRoleResponse;
          this.listRoles = items.map((value: any) => {
            return {
              id: value.id,
              label: value.libelle,
            }
          });;
          // this.isListAction = false;
          // this.count = count;

          console.log(
            'la liste des roles créées est : ',
            this.listRoles
          );
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  lockRole(item: any) {
    Swal.fire({
      title: "Désactivation d'un rôle",
      html: `Attention vous êtes sur le point de désactiver le rôle <span class='text-warning'>${item.libelle}</span> , Voulez-vous poursuivre cette action ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF7900",
      cancelButtonColor: "#000000",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.#rolesService.lockRole(item.id).subscribe({
          next: (response) => {
            this.getListRole();
          },
          error: (error) => {
            console.error(error);
          },

        });
      }
      else return;
    })
  }

  unlockRole(item: any) {
    Swal.fire({
      title: "Activation d'un rôle",
      html: `Attention vous êtes sur le point d'activer le rôle <span class='text-warning'>${item.libelle}</span> , Voulez-vous poursuivre cette action ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF7900",
      cancelButtonColor: "#000000",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.#rolesService.unlockRole(item.id).subscribe({
          next: (response) => {
            this.getListRole();
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
      else return;
    })
  }

  refreshTable(value: any){
    this.getListRole()
  }

  getListeTotalActifRole(){
    this.#rolesService.getByCriteriaRole({ size: '',
      index: '',
      id: '', }, null, { isActif: "true" }).subscribe({
        next: (response) => {
          const { items, count } = response;
          this.actifProfil = count;

          console.log(
            "le nombre d'utilisateurs actifs est : ",
            this.actifProfil
          );
        },
        error: (error) => {
          console.error(error);
        },
      });
      this.#rolesService.getByCriteriaRole({ size: '',
        index: '',
        id: '', }, null, { isActif: "false" }).subscribe({
          next: (response) => {
            const { items, count } = response;
            this.inactifProfil = count;
  
            console.log(
              "le nombre d'utilisateurs inactifs est : ",
              this.inactifProfil
            );
          },
          error: (error) => {
            console.error(error);
          },
        });
  }
}
