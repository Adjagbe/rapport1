import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ManageActionComponent } from '../manage-action/manage-action.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActionsService } from 'src/app/Core/Services/actions.service';
import { NavAdministrationComponent } from 'src/app/Core/components/nav-administration/nav-administration.component';
import { GenericTableComponent } from 'src/app/Shared/Components/generic-table/generic-table.component';
import { UsersService } from 'src/app/Core/Services/users.service';
import { columnsAction } from 'src/app/Core/Constants/action.constant';
import { ActionPreviewCardModel, ApiAction, ListAction } from 'src/app/Models/actions.model';
import { PaginationComponent } from 'src/app/Shared/Components/pagination/pagination.component';
import { ModalFilterComponent } from 'src/app/Shared/Components/modal-filter/modal-filter.component';

@Component({
  selector: 'action-management-overview',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, NavAdministrationComponent, ManageActionComponent, PaginationComponent,],
  templateUrl: './action-management-overview.component.html',
  styleUrls: ['./action-management-overview.component.scss']
})
export class ActionManagementOverviewComponent {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #modalServices = inject(NgbModal);
  #actionsService = inject(ActionsService);
  #userService = inject(UsersService)
  columnsAction = columnsAction;


  isListAction = false;
  // size est le nbr d'element a afficher par page, a set nous meme cote front
  pageSize: number = 10;
  // index-1 2- 3- ...etc
  index: number = 1;
  // le nombre total d'element recuperer depuis le back-end
  count!: number;

  selectedUser: ActionPreviewCardModel | null = null;

  statusColors = {
    Actif: 'actif',
    Inactif: 'inactif',
  };

  userListeActions: any;
  header: string = "";
  actionId: string = "";

  modalRef: any;

  // KPI
   actifAction!: number;
   inactifAction!: number;
   kpiCradList = [
    { title: 'Total', value: 10339 },
    { title: 'Actifs', value: this.actifAction },
    { title: 'Inactifs', value: this.inactifAction },
  ];

  ngOnInit(): void {
    this.getListPermission();
    // this.getListeTotalActifAction();
    // this.getListPermissions()
    // this.userListeActions = this.#userService.getActionUser('PARAMÈTRE', 'ACTIONS', '')
    // this.userListeActions = this.#userService.getActionUser(
    //   'ADMINISTRATION',
    //   'ACTION'
    // );
  }

  modalToRender: 'action' | 'filter' | 'new_action' = 'action';
  onSeeClick(selectedIndicateur: ApiAction) {
    this.modalToRender = 'action';
    console.log('Offre à voir:', selectedIndicateur);
    const {
      libelle,
      statut,
      parentLibelle,
      code,
      ...rest
    } = selectedIndicateur;
    this.selectedUser = {
      ...rest,
      libelle,
      statut,
      parentLibelle,
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
    this.getListPermission(filter);
    // setTimeout(() => {
    //   filter && this.#modalService.off();
    // }, 900);
  }

  // onSearch(query: string | number) {
  //   this.index = 1;
  //   console.log(' ******************+++++++++++++++++++', query);
  //   this.searchQuery = +query;
  //   console.log(this.searchQuery)
  //   this.getListPermission(this.filteredList);
  // }

   onSearch(event: any) {
    this.currentPage = 1; 
    this.index = 1;
    const term = event.target.value;
    if(term != ''){
      this.getListPermission({
        libelle: term
      });
    }else{
      this.getListPermission()
    }
    
   
  }

  onFilterFormChange(filter: { [cloumn: string]: string }) {
    this.index = 1;
    console.log('filter form change: ', filter);
    const column = Object.keys(filter)[0];

    if (['dateDebut', 'dateFin'].includes(column)) {
      // this.filteredList = this.getCorrectedDate(filter[column], column);
      this.getListPermission();
      return;
    }
    this.filteredList = filter;
    this.getListPermission();
  }

  getCorrectedDate(date: string, column: string) {
    // const _date = this.#utils.formatDate(date);
    // return {
    //   [column]: _date,
    // };
  }

  // onEditClick(selectedAction: ApiAction) {
  //   console.log('Offre sélectionnée:', selectedAction);
  //   this.#actionsService.selectAction(selectedAction);
  //   const config: NavigationExtras = {
  //     queryParams: {
  //       edit: selectedAction.id
  //     },
  //     relativeTo: this.#route
  //   }
  //   this.#router.navigate(["enregistrement_de_action"], config)
  // }

  // onPageChange(config: {
  //   [key: string]: string;
  //   index: string;
  //   pageSize: string;
  // }) {
  //   console.log('pagination: ', config);
  //   this.index =+ config.index + 1;
  //   this.pageSize = +config.pageSize;

  //   this.getListPermission();
  // }

   currentPage = 1;
  onPageChange(page: number) {
    this.currentPage = page;
    this.getListPermission();
  }

  onCreateProfilClick() {
      this.modalToRender = 'new_action';
      this.header = "Creation d'un profil"
      // console.log('CTA bouton cliqué');

      this.modalRef = this.#modalServices.open(ManageActionComponent, 
          {size: 'lg',centered: true, keyboard: false, backdrop: 'static'});
         this.modalRef.componentInstance.actionId = ""
      
      this.modalRef.result.then(() => {
        this.getListPermission();
    }, () => {

    });
      // this.#modalService.on();
    }
  
    onFilterAction() {
        const modalRef = this.#modalServices.open(ModalFilterComponent, {
          size: 'md',
          backdrop: 'static',
          keyboard: false,
          windowClass: 'rounded',
        });
          modalRef.componentInstance.columnsUser = columnsAction
          modalRef.componentInstance.filteredList = this.filteredList;
          // Écoute l'événement du modal
          modalRef.componentInstance.emitChangeFilter.subscribe((filter: any) => {
            this.onFilterChanged(filter); //  applique le filtre
            modalRef.close(); // ferme le modal après le filtre
          });
      }
    

      
    onEditClick(selectedAction: ApiAction) {
      console.log('Offre sélectionnée:', selectedAction);
      this.actionId = selectedAction.id.toString();
      this.modalToRender = 'new_action';
      this.header = "Modification d'un profil"
      console.log('CTA bouton cliqué');

      this.modalRef = this.#modalServices.open(ManageActionComponent, 
          {size: 'xl',centered: true, keyboard: false, backdrop: 'static'});
         this.modalRef.componentInstance.actionId = this.actionId

      this.modalRef.result.then(() => {
        this.getListPermission()
      // sessionStorage.setItem("loadingBar","false");
      // console.log('When user closes');
      // this.getInfosDevice(this.box);
    }, () => {
      // this.getInfosDevice(this.box);
    });
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

  onFilterClick() {
    // this.pageSize = 2;
    this.modalToRender = 'filter';
    // this.#modalService.on();
  }

  listActions: Array<{
    label: string;
    id: number;
  }> = [];
  getListPermissions() {
    this.isListAction = true;
    this.listActions = [];
    this.#actionsService
      .getByCriteriaAction({
        size: '',
        index: '',
        ordre: 'ASC',
        champs: 'libelle',
        id: ''
      },null)
      .subscribe({
        next: (listRoleResponse) => {
          const { items, count } = listRoleResponse;
          this.listActions = items.map((value:any)=>{
            return {
              id: value.id,
              label: value.libelle,
            }
          });;
          // this.isListAction = false;
          // this.count = count;

          console.log(
            'la liste des roles créées est : ',
            this.listAction
          );
        },
        error: (error) => {
          console.error(error);
        },
      });
  }



  listAction: ListAction | any = [];
  filteredList: { [column: string]: string | number[] | number } | null = null;
  searchQuery: number = 0;


  getListPermission(filter: { [column: string]: string | number[] | number } | null = null) {
    this.isListAction = true;
    this.listAction = null;
    this.#actionsService
      .getByCriteriaAction({
        size: `${this.pageSize}`,
        index: `${this.currentPage -1 }`,
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
                items = items.filter((u: any) =>
                  (u as any)[key]?.toString().toLowerCase().includes(value.toLowerCase())
                );
              }
            });
            count = items.length;
          }
          this.listAction = items;
          this.isListAction = false;
          this.count = count;
          // this.getListeTotalActifAction()
          console.log(
            'la liste des roles créées est : ',
            this.listAction
          );
        },
        error: (error) => {
          console.error(error);
        },
      });
  }


  lockAction(item: any) {
    Swal.fire({
      title: "Désactivation d'une action",
      html: `Attention vous êtes sur le point de désactiver la action <span class='text-warning'>${item.libelle}</span> , Voulez-vous poursuivre cette action ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF7900",
      cancelButtonColor: "#000000",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.#actionsService.lockAction(item.id).subscribe({
          next: (response) => {
            this.getListPermission();
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
      else return;
    })
  }

  unlockAction(item: any) {
    Swal.fire({
      title: "Activation d'une action",
      html: `Attention vous êtes sur le point d'activer la action <span class='text-warning'>${item.libelle}</span> , Voulez-vous poursuivre cette action ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF7900",
      cancelButtonColor: "#000000",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.#actionsService.unlockAction(parseInt(item.id)).subscribe({
          next: (response) => {
            this.getListPermission();
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
      else return;
    })
  }

  refreshTable(value: any) {
    this.getListPermission()
  }

  getListeTotalActifAction(){
    this.#actionsService.getByCriteriaAction({ size: '',
      index: '',
      id: '', }, null, { isActif: "true" }).subscribe({
        next: (response) => {
          const { items, count } = response;
          this.actifAction = count;

          console.log(
            "le nombre d'utilisateurs actifs est : ",
            this.actifAction
          );
        },
        error: (error) => {
          console.error(error);
        },
      });
      this.#actionsService.getByCriteriaAction({ size: '',
        index: '',
        id: '', }, null, { isActif: "false" }).subscribe({
          next: (response) => {
            const { items, count } = response;
            this.inactifAction = count;
  
            console.log(
              "le nombre d'utilisateurs inactifs est : ",
              this.inactifAction
            );
          },
          error: (error) => {
            console.error(error);
          },
        });
  }
}
