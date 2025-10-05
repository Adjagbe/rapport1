import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { TableDtComponent } from 'src/app/shared/components/table-dt/table-dt.component';
// import {
//   columnsUser,
//   USERS_FILTER_FORM_OPTIONS,
// } from 'src/app/core/constants/users.constants';
import { ActivatedRoute, Router } from '@angular/router';
// import { ToastService } from 'src/app/core/services/toast.service';
// import { DateUtils } from 'src/app/core/utils/date.utils';
// import {
//   ApiUtilisateur,
//   ListUser,
//   UserPreviewCardModel,
// } from 'src/app/shared/models/user.model';
// import { COMMON_TEXTS } from 'src/app/core/constants';
// import { ALERT_MESSAGES_UTILISATEUR } from 'src/app/core/constants/alert-message.constant';
import { UtilisateurInfosComponent } from '../utilisateurs-infos/utilisateurs-infos.component';
// import { FilterFormComponent } from '../filter-form/filter-form.component';
// import { ModalService } from 'src/app/core/services/modal.service';
// import { TableFilterComponent } from 'src/app/shared/components/table-filter/table-filter.component';
// import { UserRequestFormComponent } from '../user-request-form/user-request-form.component';
import { NavAdministrationComponent } from 'src/app/Core/components/nav-administration/nav-administration.component';
import { UsersService } from 'src/app/Core/Services/users.service';
import {
  ApiUtilisateur,
  ListUser,
  UserPreviewCardModel,
} from 'src/app/Models/user.model';
import { GenericTableComponent } from 'src/app/Shared/Components/generic-table/generic-table.component';
import { PlusIconComponent } from 'src/app/Core/icons/plus-icon.component';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { columnsUser } from 'src/app/Core/Constants/gestion-utilisateurs.constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRequestFormComponent } from '../user-request-form/user-request-form.component';
import Swal from 'sweetalert2';
import { PaginationComponent } from 'src/app/Shared/Components/pagination/pagination.component';
import { ModalFilterComponent } from 'src/app/Shared/Components/modal-filter/modal-filter.component';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';

@Component({
  selector: 'utilisateurs-overview',
  standalone: true,
  imports: [
    CommonModule,
    // TableDtComponent,
    // TableFilterComponent,
    UtilisateurInfosComponent,
    // ModalDtComponent,
    // FilterFormComponent,
    NavAdministrationComponent,
    // UserRequestFormComponent
    GenericTableComponent,
    PaginationComponent,
  ],
  templateUrl: './utilisateurs-overview.component.html',
  styleUrls: ['./utilisateurs-overview.component.scss'],
})
export class UtilisateursOverviewComponent {
  // @ViewChild(UserRequestFormComponent) userRequestFormComponent!: UserRequestFormComponent;

  #usersService = inject(UsersService);
  #ngModal = inject(NgbModal);
  #common = inject(CommonUtils)
  // #modalService = inject(ModalService);
  // #toastService = inject(ToastService);
  // #utils = inject(DateUtils);
  #connectedUserId!: number;

  // COMMON_TEXTS = COMMON_TEXTS;
  columnsUser = columnsUser;
  // USERS_FILTER_FORM_OPTIONS = USERS_FILTER_FORM_OPTIONS;

  viewResendAccesUser: boolean = true;
  actifUser: number = 0;
  inactifUser: number = 0;
  totalUser: number = 0;
  loading = false;

  header: string = '';
  modalRef: any;

  // Pagination
  currentPage = 1;
  totalUsers = 0;

  kpiCradList = [
    { title: 'Total', value: 10339 },
    { title: 'Actifs', value: this.actifUser },
    { title: 'Inactifs', value: this.inactifUser },
  ];

  data = [];

  selectedUser: UserPreviewCardModel | null = null;

  statusColors = {
    Actif: 'actif',
    Inactif: 'inactif',
  };

  userListeActions: any;

  selectedUserId: string = ''; // ou number selon ton usage

  // currentPage = 1;

  ngOnInit(): void {
    const session = this.#usersService.getUser();
    this.#connectedUserId = session?.item?.idUser ?? 0;
    this.getListUser();
    this.getListUtilisateurs();
    this.getListeTotalActifUser();
    this.currentPage = 1;

    // this.userListeActions = this.#usersService.getActionUser(
    //   'ADMINISTRATION',
    //   'UTILISATEUR'
    // );
  }

  modalToRender: 'utilisateur' | 'filter' | 'new_user' | 'edit_user' =
    'utilisateur';

  onSearch(event: any) {
    this.currentPage = 1; 
    this.index = 1;
    const term = event.target.value;
    if(term != '' && term !=' ' ){
      this.getListUser({
        lastName: term,
      });
    }else{
      this.getListUser()
    }
    
  }

  champs: string = '';
  ordre: string = 'ASC';
  onSortedOrdered(ordre: string, champs: string) {
    this.champs = champs;
    this.ordre = ordre;
    if (this.ordre === 'ASC') {
      this.ordre = 'DESC';
    } else this.ordre = 'ASC';
  }

  isListUser = false;
  // size est le nbr d'element a afficher par page, a set nous meme cote front
  pageSize: number = 10;
  // index-1 2- 3- ...etc
  index: number = 1;
  // le nombre total d'element recuperer depuis le back-end
  count: number = 0;

  onCreateUserClick() {
    this.modalToRender = 'new_user';
    console.log('CTA bouton cliqué');
    // this.#modalService.on();
  }

  onCreateUser() {
    this.modalRef = this.#ngModal.open(UserRequestFormComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
    this.modalRef.result.then(
      () => {
        this.getListUser();
      },
      () => {}
    );
  }

  onFilterUser() {
    const modalRef = this.#ngModal.open(ModalFilterComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
    modalRef.componentInstance.columnsUser = columnsUser;
    modalRef.componentInstance.filteredList = this.filteredList;
    // Écoute l'événement du modal
    modalRef.componentInstance.emitChangeFilter.subscribe((filter: any) => {
      this.onFilterChanged(filter); //  applique le filtre
      modalRef.close(); // ferme le modal après le filtre
    });
  }

  onEditClick(user: any) {
    if (user && user.idUser !== undefined && user.idUser !== null) {
      this.selectedUserId = user.idUser.toString();
      console.log('Id du user selectionné:', this.selectedUserId);
      this.modalToRender = 'edit_user';
      this.header = "Modification de l'utilisateur";
      this.modalRef = this.#ngModal.open(UserRequestFormComponent, {
        size: 'xl',
        centered: true,
        keyboard: false,
        backdrop: 'static',
      });
      this.modalRef.componentInstance.selectedUserId = this.selectedUserId;
      this.modalRef.result.then(
        () => {
          this.getListUser();
        },
        () => {}
      );
    } else {
      console.warn('Utilisateur ou id non défini:', user);
    }
  }

  onSeeClick(selectedUser: ApiUtilisateur) {
    this.modalToRender = 'utilisateur';
    console.log('Offre à voir:', selectedUser);
    const {
      email,
      fonction,
      login,
      lastName,
      firstName,
      isActif,
      originHierarchieDescription,
      telephone,
      ...rest
    } = selectedUser;
    this.selectedUser = {
      ...rest,
      email,
      fonction,
      login,
      lastName,
      firstName,
      isActif,
      originHierarchieDescription,
      telephone,
    };
    console.log(
      'le rendu avant affchage des donnes à VOIR //////////////////////////',
      this.selectedUser
    );

    // this.#modalService.on();
  }

  lockUtilisateur(item: any) {
    // if (item.id === this.#connectedUserId) {
    //   // this.#toastService.mixin(
    //   //   "Vous ne pouvez pas vous désactiver vous-même.",
    //   //   "warning"
    //   // );
    //   Swal.fire({
    //     toast: true,
    //     icon: 'warning',
    //     title: 'Vous ne pouvez pas vous désactiver vous-même.',
    //     position: 'top-end',
    //     showConfirmButton: false,
    //     timer: 10000,
    //     timerProgressBar: true,
    //   });
    //   return;
    // }
    Swal.fire({
      title: "Désactivation d'un utilisateur",
      html: `Attention vous êtes sur le point de désactiver l'utilisateur <span class='text-warning'>${item.firstName}</span> , Voulez-vous poursuivre cette action ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF7900',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        if (res.value !== '') {
          this.#usersService.lockUtilisateur(item.idUser, res.value).subscribe({
            next: (response) => {
              this.getListUser();
              this.getListeTotalActifUser();
            },
            error: (error) => {
              console.error(error);
            },
          });
        } else {
          //      this.#toastService.mixin(
          //   "Le motif est obligatoire dans la désactivation d'utilisateur.",
          //   "warning"
          // );
          Swal.fire({
            toast: true,
            icon: 'warning',
            title:
              "Le motif est obligatoire dans la désactivation d'utilisateur.",
            position: 'top-end',
            showConfirmButton: false,
            timer: 10000,
            timerProgressBar: true,
          });
        }
      } else return;
    });
  }

  unlockUtilisateur(item: any) {
    console.log(item);
    Swal.fire({
      title: "Activation d'un utilisateur",
      html: `Attention vous êtes sur le point d'activer l'utilisateur <span class='text-warning'>${item.firstName}</span> , Voulez-vous poursuivre cette action ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF7900',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.#usersService.unlockUtilisateur(item.idUser).subscribe({
          next: (response) => {
            this.getListUser();
            this.getListeTotalActifUser();
          },
          error: (error) => {
            console.error(error);
          },
        });
      } else return;
    });
  }

  getListeTotalActifUser() {
    // this.#usersService.getListUtilisateur({
    //   size: '',
    //   index: '',
    //   id: '',
    // },
    //   null,
    //   { isActif: true }
    // )
    //   .subscribe({
    //     next: (response) => {
    //       const { items, count } = response;
    //       this.actifUser = count;
    //       console.log(
    //         "le nombre d'utilisateurs actifs est : ",
    //         this.actifUser
    //       );
    //     },
    //     error: (error) => {
    //       console.error(error);
    //     },
    //   });
    //   this.#usersService.getListUtilisateur({ size: '',
    //     index: '',
    //     id: '', }, null, { isActif: false }).subscribe({
    //       next: (response) => {
    //         const { items, count } = response;
    //         this.inactifUser = count;
    //         console.log(
    //           "le nombre d'utilisateurs inactifs est : ",
    //           this.inactifUser
    //         );
    //       },
    //       error: (error) => {
    //         console.error(error);
    //       },
    //     });
  }

  listUtilisateurs: Array<{
    label: string;
    id: number;
  }> = [];
  getListUtilisateurs() {
    this.isListUser = true;
    this.listUtilisateurs = [];
    // this.#usersService
    //   .getListUtilisateur(
    //     {
    //       size: '',
    //       index: '',
    //       id: '',
    //     },
    //     null
    //   )
    //   .subscribe({
    //     next: (listRoleResponse) => {
    //       const { items, count } = listRoleResponse;
    //       this.totalUser = count
    //       this.listUtilisateurs = items.map((value: any) => {
    //         return {
    //           id: value.id,
    //           label: value.nom,
    //         };
    //       });

    //       console.log(
    //         'la liste des utilisateurs créées est : ',
    //         this.listUtilisateurs
    //       );
    //     },
    //     error: (error) => {
    //       console.error(error);
    //     },
    //   });
  }

exportUsers() {

  this.#usersService.getExportutilisateur(this.filteredList).subscribe({
    next: (res) => {
      console.log('Réponse export :', res);

      const { fileContent, fileName, mimeType } = res;

      // Convertir base64 en Blob
      const blob = this.#common.base64ToBlob(fileContent, mimeType);

      // Créer un lien de téléchargement temporaire
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName || 'utilisateurs.xlsx';
      link.click();

      // Libérer l’URL
      URL.revokeObjectURL(url);
      // Réinitialise le filtre après export
      this.filteredList = null;
      this.getListUser();
    },
    error: (err) => {
      console.error('Erreur export utilisateurs:', err);
    }
  });
}


  onFilterClick() {
    this.modalToRender = 'filter';
    // this.#modalService.on();
  }

  isSubmit = false;
  listUser: ListUser | any = [];
  filteredList: { [cloumn: string]: string | number[] | number } | null = null;
  searchQuery: number = 0;

  getListUser(
    filter: { [cloumn: string]: string | number[] | number } | null = null
  ) {
    this.isListUser = true;
    this.listUser = null;
    this.currentPage  ;
    this.#usersService
      .getListUtilisateur(
        {
          size: `${this.pageSize}`,
          index: `${this.currentPage -1}`,
        },
        null,
        // this.filteredList,
        filter,
        this.searchQuery
      )
      .subscribe({
        next: (listUserResponse) => {
          let { items, count } = listUserResponse;
          console.log('liste des users filtré', listUserResponse);
          
          // Filtrage insensible à la casse sur tous les champs du filtre
          if (filter) {
            Object.keys(filter).forEach((key) => {
              const value = filter[key];
              if (typeof value === 'string' && value.trim() !== '' ) {
                items = items.filter((u) =>
                  (u as any)[key]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                );
              }
            });
            count = items.length;
          }else{
            
            this.listUser = items;
            this.isListUser = false;
            this.count = count;
          }

          this.listUser = items;

          console.log('les données sont bel et bien remonté', this.listUser);

          this.isListUser = false;
          this.count = count;

          console.log('la liste des utilisateurs créées est : ', this.listUser);
        },
        error: (error) => {
          this.isListUser = false;
          this.listUser = null;
          console.error(error);
          // error?.status?.message &&
          //   this.#toastService.mixin(error?.status?.message, 'info');
        },
      });
  }

  refreshListeUtilisateur() {
    this.getListUser();
    this.getListeTotalActifUser();
    this.getListUtilisateurs();
    this.currentPage = 1;
  }

  onFilterChanged(filter: any) {
    this.currentPage = 1; 
    this.index = 1;

    this.filteredList = filter;
    console.log('filter recu du filter form: ', filter);

    this.getListUser(filter);
    
    setTimeout(() => {
      // filter && this.#modalService.off();
    }, 900);
  }



  // onPageChange(config: {
  //   // [key: string]: string;
  //   index: number;
  //   pageSize: number;
  // }) {
  //   console.log('pagination: ', config);
  //   this.index = +config.index + 1;
  //   this.pageSize = +config.pageSize;
  //   this.getListUser();
  // }

  onPageChange(page: any) {
    this.currentPage = page;
    this.getListUser();
  }

  // onPageChange(config: {
  //   [key: string]: string;
  //   index: string;
  //   pageSize: string;
  // }) {
  //   console.log('pagination: ', config);
  //   this.index = +config.index + 1;
  //   this.pageSize = +config.pageSize;
  //   this.currentPage = this.pageSize
  //   this.getListUser();
  // }

  isOffreBusiness = false;
  listOffreBusiness: Array<{
    label: string;
    id: number;
  }> = [];

  onFilterFormChange(filter: { [cloumn: string]: string }) {
    this.currentPage = 1;
    this.index = 1;
    console.log('filter form change: ', filter);
    const column = Object.keys(filter)[0];

    if (['createdAt', 'dateFin'].includes(column)) {
      // this.filteredList = this.getCorrectedDate(filter[column], column);
      this.getListUser();
      return;
    }
    this.filteredList = filter;
    this.currentPage = 1;
    this.getListUser();
  }

  getCorrectedDate(date: string, column: string) {
    // const _date = this.#utils.formatDate(date);
    // return {
    //   [column]: _date,
    // };
  }

  OnSubmit() {}

  resendAccesUser(item: any) {
    // this.#toastService
    //   .confirm(
    //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_UTILISATEUR_RESEND.title,
    //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_UTILISATEUR_RESEND.text,
    //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_UTILISATEUR_RESEND.confirmButtonText,
    //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_UTILISATEUR_RESEND.cancelButtonText
    //   )
    //   .then((res: any) => {
    //     if (res.isConfirmed) {
    //       this.#usersService.resendAccesUtilisateur(item.login).subscribe({
    //         next: (response) => {
    //           this.getListUser();
    //         },
    //         error: (error) => {
    //           console.error(error);
    //         },
    //       });
    //     } else return;
    //   });
  }
}
