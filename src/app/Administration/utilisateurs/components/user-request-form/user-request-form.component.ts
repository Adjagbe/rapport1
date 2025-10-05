import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { from, Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import * as moment from 'moment';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { UsersService } from 'src/app/Core/Services/users.service';
import { ProfilsService } from 'src/app/Core/Services/profils.service';
import {
  ApiUtilisateur,
  Departement,
  ListDepartement,
  ListDirection,
  ListProfil,
  ListService,
  ListSous_Direction,
  ListUser,
  ListUserProfil,
  Users,
  UsersLdap,
} from 'src/app/Models/user.model';
import { ListRole } from 'src/app/Models/roles.model';
import { GenericTableComponent } from 'src/app/Shared/Components/generic-table/generic-table.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { ModalLayoutComponent } from 'src/app/Core/layouts/modal-layout/modal-layout.component';
import { columnsProfil } from 'src/app/Core/Constants/gestion-utilisateurs.constant';
import { UtilitiesService } from 'src/app/Core/Services/utilities.service';
import Swal from 'sweetalert2';
import { GenericTableV3Component } from 'src/app/Shared/Components/generic-table-v3/generic-table-v3.component';

@Component({
  selector: 'user-request-form',
  standalone: true,
  imports: [
    CommonModule,
    FormControlComponent,
    // CtaButtonComponent,
    NgSelectModule,
    ReactiveFormsModule,
    GenericTableComponent,
    BtnGenericComponent,
    ModalLayoutComponent,
    GenericTableV3Component,
  ],
  templateUrl: './user-request-form.component.html',
  styleUrls: ['./user-request-form.component.scss'],
})
export class UserRequestFormComponent {
  // #toastService = inject(ToastService);
  // #modalService = inject(ModalService);
  @ViewChild('formTemplate') formTemplate!: TemplateRef<any>;
  @Output() utilisateurValide = new EventEmitter<void>();
  @Input() selectedUserId: any;
  isModalVisible = false;
  modalTitle = '';
  modalMessage = '';
  // modalType: ModalType = ModalType.INFO;
  currentTemplate: TemplateRef<any> | null = null;
  confirmLabel = 'Confirmer';
  cancelLabel = 'Annuler';
  modalSize: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() utilisateurId: string | null = null;
  btnSubmitText: 'Créer un utilisateur' | 'Modifier un utilisateur' = 'Créer un utilisateur';
  queryParamsSubscription!: Subscription;
  formListener!: Subscription;
  LABEL_VALEUR_S_M!: string;
  objetUtilisateur!: {
    id: number;
    libelle: string;
  };

  switchView = false

  loading = false;

  openSuccessModal(): void {
    this.modalTitle = 'Opération réussie';
    this.modalMessage = 'Les données ont été sauvegardées avec succès!';
    // this.modalType = ModalType.SUCCESS;
    this.currentTemplate = null;
    this.isModalVisible = true;
  }

  // USERS_TEXTS = USERS_TEXTS;
  // ALERT_MESSAGES_UTILISATEUR = ALERT_MESSAGES_UTILISATEUR
  #usersService = inject(UsersService);
  #rolesService = inject(ProfilsService);
  utilities = inject(UtilitiesService);
  #formBuilder = inject(FormBuilder);
  // #DateUtils = inject(DateUtils);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #modalActive = inject(NgbActiveModal);
  @Output() utilisateurModifie = new EventEmitter<void>();
  columnsProfil = columnsProfil;

  newUtilisateurFormulaire = this.#formBuilder.nonNullable.group({
    login: ['', Validators.required],
    ldap: [false],
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],
    telephone: ['', Validators.required],
    email: ['', Validators.required],
    fonction: ['', Validators.required],
    direction: [0],
    sousDirection: [null],
    idDepartment: [null as number | null, Validators.required],
    service: [null],
    idUser: [null],
    isConnexionPermanent: [false],
   
  });

  newProfilFormulaire = this.#formBuilder.nonNullable.group({
    profil: this.#formBuilder.nonNullable.control<
      string | { id: number; libelle: string } | null
    >(null, Validators.required),
    dateDebut: ['', null],
    dateFin: ['', null],
  });
  minDate: string = '';
  minDateDebutProfil: string = '';
  selectedCar!: number;
  fields = ['lastName', 'firstName', 'email'];
  fieldsldapupdate = ['lastName', 'firstName', 'email', 'login'];
  fieldsDisabledEdit = ['periode', 'sousServiceId', 'gouvernanceId'];
  userListeActions: any;

  // constructor() {
  //   console.log("Id recupéré de l'utilisateur" ,this.selectedUserId)
  // }

  ngOnInit(): void {
    const currentUserId = this.selectedUserId;
    console.log("Id recupéré de l'utilisateur", currentUserId);

    if (currentUserId) {
      this.getUserById(currentUserId);
      //  this.getcurrentUtilisateurId()
      this.btnSubmitText = 'Modifier un utilisateur';
    } else {
      this.btnSubmitText = 'Créer un utilisateur';
    }

    const date = Date();
    this.minDate = moment(date).format('YYYY-MM-DD');

    this.minDateDebutProfil = this.minDate;
    // this.#loadInitialData();
    this.getListRole();
    // this.getListDirections(null);
    this.listenToFormChanges();
    this.getlistDepartments();

    // Écoute des changements sur dateDebut pour mettre à jour minDateDebutProfil (min pour dateFin)
    this.newProfilFormulaire
      .get('dateDebut')!
      .valueChanges.subscribe((selectedDate: string | null) => {
        this.minDateDebutProfil = selectedDate || this.minDate;

        // si dateFin est avant la dateDebut, on la met à jour
        const dateFinValue = this.newProfilFormulaire.get('dateFin')!.value;

        if (dateFinValue && dateFinValue < this.minDateDebutProfil) {
          this.newProfilFormulaire.get('dateFin')!.setValue(null);
        }
      });

    // this.userListeActions = this.#usersService.getActionUser('ADMINISTRATION','UTILISATEUR')
    // this.newUtilisateurFormulaire.patchValue({
    //   direction: 44
    // })
    // this.getListSousDirection(null, this.newUtilisateurFormulaire.get('direction')!.value)
  }

  listenToFormChanges() {
    this.formListener = this.newUtilisateurFormulaire.valueChanges.subscribe({
      next: (value) => {
        // console.log('form value changes: ', value);
      },
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['utilisateurId'] && changes['utilisateurId'].currentValue) {
      this.utilisateurId = changes['utilisateurId'].currentValue;
      this.#handlecurrentUtilisateurIdChange();
      console.log('id reçu chez enfant user-request-form', this.utilisateurId);
    }
  }

  #handlecurrentUtilisateurIdChange() {
    if (this.utilisateurId) {
      this.getcurrentUtilisateurId();
      this.btnSubmitText = 'Modifier un utilisateur';
    } else {
      this.btnSubmitText = 'Créer un utilisateur';
      this.newUtilisateurFormulaire.reset();
      // this.#modalService.off();
    }
  }

  getUserById(id: any) {
    this.#usersService
      .getListUtilisateur({
        size: ``,
        index: ``,
        id: id,
      })
      .subscribe({
        next: (response) => {
          // console.log("Réponse brute :", response.items);

          const utilisateur = response.items.find((u: any) => u.idUser == id);
          console.log(utilisateur);

          if (!utilisateur) {
            console.warn(`Aucun utilisateur trouvé avec l'id ${id}`);
            return;
          }

          if (utilisateur.isLdap) {
            this.newUtilisateurFormulaire.get('ldap')?.disable()
            this.disableFields(this.newUtilisateurFormulaire, this.fieldsldapupdate);
          }
          this.newUtilisateurFormulaire.patchValue({
            login: utilisateur.login,
            lastName: utilisateur.lastName,
            firstName: utilisateur.firstName,
            telephone: utilisateur.telephone,
            email: utilisateur.email,
            fonction: utilisateur.fonction,
            ldap: utilisateur.isLdap ? utilisateur.isLdap : false,
            idDepartment: utilisateur.idDepartment,
            
          });
          this.Profils = utilisateur.profils.map((profil: any) => ({
            id: profil.id,
            libelle: profil.libelle,
            dateDebutProfil: profil.dateDebutProfil,
            dateFinProfil: profil.dateFinProfil,
          }));
          this.updatePaginatedData();
        },
        error: (err) => {
          console.error(
            "Erreur lors de la récupération de l'utilisateur :",
            err
          );
        },
      });
  }

  getcurrentUtilisateurId() {
    this.#usersService
      .getListUtilisateur({
        size: '',
        index: '',
        id: this.selectedUserId as string,
      })
      .subscribe({
        next: (response) => {
          this.prefillForm(response.items[0]);
          console.log('Utilisateur récupéré:', response.items[0]);
        },
      });
  }

  disableFields(form: FormGroup, fields: string[]) {
    fields.forEach((field) => form.get(field)?.disable());
  }

  enableFields(form: FormGroup, fields: string[]) {
    fields.forEach((field) => form.get(field)?.enable());
  }

  #loadInitialData() {}

  isSubmit = false;

  liste!: Departement;

  getlistDepartments() {
    this.#usersService.getDepart().subscribe({
      next: (response) => {
        this.liste = response;
        console.log('Test departement:', this.liste);
      },
    });
  }

  listDirections: ListDirection = [];

  getListDirections(id: number | null) {
    this.#usersService.getDirections(id).subscribe({
      next: (response) => {
        //
        if (id == null) {
          this.listDirections = response.items;
        } else if (id !== null) {
          this.newUtilisateurFormulaire.patchValue({
            direction: response.items ? response.items[0].id : 0,
          });
          this.getListDirections(null);
        }
        console.log('Test:', this.listDirections);
      },
    });
  }

  listSousDirections: ListSous_Direction = [];
  getListSousDirection(id: number | null, idSousService: number | null) {
    this.#usersService.getSousDirection(id, idSousService).subscribe({
      next: (response) => {
        if (idSousService !== null && id == null) {
          this.listSousDirections = response.items;
        } else if (idSousService == null && id !== null) {
          this.newUtilisateurFormulaire.patchValue({
            sousDirection: response.items ? response.items[0].id : null,
          });
          this.getListSousDirection(null, response.items[0].directionsId);
          this.getListDirections(response.items[0].directionsId);
        }
      },
    });
  }

  // listDepartements: ListDepartement = [];
  // getListDepartements(id: number | null, idDepartement: number | null) {
  //   this.#usersService
  //     .getDepartement(id, idDepartement).subscribe({
  //       next: (response) => {

  //         if (idDepartement !== null && id == null) {
  //           this.listDepartements = response.items
  //         } else if (idDepartement == null && id !== null) {
  //           this.newUtilisateurFormulaire.patchValue({
  //             departement: response.items ? response.items[0].id : null
  //           })
  //           this.getListDepartements(null, response.items[0].sousDirectionId)
  //           this.getListSousDirection(response.items[0].sousDirectionId, null)
  //         }
  //         console.log("Test:", this.listDirections)
  //       },
  //     });
  // }

  // listServices: ListService = [];
  // getListService(id: number | null, idService: number | null) {
  //   this.#usersService
  //     .getService(id, idService).subscribe({
  //       next: (response) => {

  //         if (idService !== null && id == null) {
  //           this.listServices = response.items;
  //         } else if (idService == null && id !== null) {
  //           this.newUtilisateurFormulaire.patchValue({
  //             service: response.items ? response.items[0].id : null
  //           })
  //           this.getListService(null, response.items[0].departementId)
  //           this.getListDepartements(response.items[0].departementId, null)
  //         }
  //       },
  //     });
  // }

  userProfils: ListUserProfil = [];

  getListUserProfil(id: number) {
    this.#usersService.getUserProfil(id).subscribe({
      next: (response) => {
        this.userProfils = response.items;
        this.prefillProfil();
      },
    });
  }

  prefillProfil() {
    this.Profils = this.userProfils.map((item: any) => {
      return {
        id: item.profilId,
        libelle: item.profilLibelle,
        dateDebutProfil: item.dateDebut,
        dateFinProfil: item.dateFin,
      };
    });
    this.count = this.Profils.length;
    this.updatePaginatedData();
  }

  prefillForm(utilisateur: ApiUtilisateur) {
    setTimeout(() => {
      this.getListUserProfil(utilisateur.idUser);
      this.searchHierarchyUser(
        utilisateur.originHierarchieId,
        utilisateur.originHierarchieLibelle
      );
      // this.viewInfos = 'Open'
      if (utilisateur.isLdap) {
        this.disableFields(this.newUtilisateurFormulaire, this.fields);
      }
      this.newUtilisateurFormulaire.patchValue({
        login: utilisateur.login,
        lastName: utilisateur.lastName,
        firstName: utilisateur.firstName,
        email: utilisateur.email,
        telephone: utilisateur.telephone,
        fonction: utilisateur.fonction,
        ldap: utilisateur.isLdap ? utilisateur.isLdap : false,
        idDepartment: utilisateur.idDepartment,
      });
    }, 1000);
    console.log(this.newUtilisateurFormulaire);
  }

  searchHierarchyUser(id: number, libelle: string) {
    if (libelle == 'DIRECTION') {
      this.getListDirections(id);
    } else if (libelle == 'SOUS_DIRECTION') {
      this.getListSousDirection(id, null);
    }
    //else if (libelle == "DEPARTEMENT") {
    //   this.getListDepartements(id, null)
    // } else if (libelle == "SERVICE") {
    //   this.getListService(id, null)
    // }
  }

  OnCancel(event: Event) {
    this.newUtilisateurFormulaire.reset();
    event.stopPropagation();
    // this.#modalService.off();
    this.newProfilFormulaire.reset();
    this.Profils = [];
    this.updatePaginatedData();
  }

  onModalClosed() {
    this.newUtilisateurFormulaire.reset();
    this.newProfilFormulaire.reset();
    this.Profils = [];
    this.updatePaginatedData();
  }

  OnSubmit() {
    let HierarchieLibelle: string = '';
    let HierarchieId: any;
    if (this.newUtilisateurFormulaire.get('service')!.value) {
      HierarchieLibelle = 'SERVICE';
      HierarchieId = this.newUtilisateurFormulaire.get('service')!.value;
    } else if (this.newUtilisateurFormulaire.get('idDepartment')!.value) {
      // alert("je suis rentré");
      HierarchieLibelle = 'DEPARTEMENT';
      HierarchieId = this.newUtilisateurFormulaire.get('idDepartment')!.value;
    } else if (this.newUtilisateurFormulaire.get('sousDirection')!.value) {
      HierarchieLibelle = 'SOUS_DIRECTION';
      HierarchieId = this.newUtilisateurFormulaire.get('sousDirection')!.value;
    } else if (this.newUtilisateurFormulaire.get('direction')!.value) {
      HierarchieLibelle = 'DIRECTION';
      HierarchieId = this.newUtilisateurFormulaire.get('direction')!.value;
    }
    if (
      this.btnSubmitText === 'Créer un utilisateur' &&
      this.newUtilisateurFormulaire.valid &&
      this.Profils.length > 0
    ) {
      let userLdap: UsersLdap = {
        telephone: this.newUtilisateurFormulaire.get('telephone')!.value,
        fonction: this.newUtilisateurFormulaire.get('fonction')!.value,
        login: this.newUtilisateurFormulaire.get('login')!.value,
        profils: this.Profils,
        idDepartment: this.newUtilisateurFormulaire.get('idDepartment')!.value,
        originHierarchieLibelle: HierarchieLibelle,
        originHierarchieId: HierarchieId,
      };
      let utilisateur: Users = {
        lastName: this.newUtilisateurFormulaire.get('lastName')!.value,
        firstName: this.newUtilisateurFormulaire.get('firstName')!.value,
        telephone: this.newUtilisateurFormulaire.get('telephone')!.value,
        email: this.newUtilisateurFormulaire.get('email')!.value,
        fonction: this.newUtilisateurFormulaire.get('fonction')!.value,
        login: this.newUtilisateurFormulaire.get('login')!.value,
        originHierarchieLibelle: HierarchieLibelle,
        originHierarchieId: HierarchieId,
        isLdap: this.newUtilisateurFormulaire.get('ldap')!.value,
        idDepartment: this.newUtilisateurFormulaire.get('idDepartment')!.value,
        profils: this.Profils,
      };
      // this.#toastService
      //   .confirm(
      //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_UTILISATEUR_CREATION.title,
      //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_UTILISATEUR_CREATION.text,
      //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_UTILISATEUR_CREATION.confirmButtonText,
      //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_UTILISATEUR_CREATION.cancelButtonText
      //   )
      //   .then((result) => {
      // if (result.isConfirmed) {
      this.isSubmit = true;
      if (utilisateur.isLdap == false) {
        this.#usersService.createUtilisateur(utilisateur).subscribe({
          next: (reqResponse) => {
            this.isSubmit = false;
            if (!reqResponse.hasError) {
              Swal.fire({
                toast: true,
                icon: 'success',
                title: "L'utilisateur a été créé avec succès.",
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
              this.newUtilisateurFormulaire.reset();
              this.paginatedDataProfil = [];
              // this.#toastService.mixin(
              //   ALERT_MESSAGES_UTILISATEUR.SUCCESS_UTILISATEUR_CREATION.text,
              //   ALERT_MESSAGES_UTILISATEUR.SUCCESS_UTILISATEUR_CREATION.icon
              // );
              this.close();
              // this.utilisateurModifie.emit(); // Émettre un signal de rafraîchissement
              // this.#modalService.off();
            } else {
              this.isSubmit = false;
              Swal.fire({
                toast: true,
                icon: 'error',
                title: "Erreur lors de la création de l'utilisateur",
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
              // this.#toastService.mixin(
              //   reqResponse?.status?.['message'] as string,
              //   ALERT_MESSAGES_UTILISATEUR.ERROR_UTILISATEUR_CREATION.icon
              // );
            }
          },
          error: (error) => {
            this.isSubmit = false;
            console.error(error);
            // this.#toastService.mixin(
            //   ALERT_MESSAGES_UTILISATEUR.ERROR_UTILISATEUR_CREATION.text,
            //   ALERT_MESSAGES_UTILISATEUR.ERROR_UTILISATEUR_CREATION.icon
            // );
          },
        });
      } else {
        this.#usersService.createUtilisateurLdap(userLdap).subscribe({
          next: (reqResponse) => {
            this.isSubmit = false;
            if (!reqResponse.hasError) {
              Swal.fire({
                toast: true,
                icon: 'success',
                title: "L ' utilisateur a été créé avec succès.",
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
              this.newUtilisateurFormulaire.reset();
              this.paginatedDataProfil = [];
              // this.#toastService.mixin(
              //   ALERT_MESSAGES_UTILISATEUR.SUCCESS_UTILISATEUR_CREATION.text,
              //   ALERT_MESSAGES_UTILISATEUR.SUCCESS_UTILISATEUR_CREATION.icon
              // );
              // this.utilisateurModifie.emit(); // Émettre un signal de rafraîchissement
              // this.#modalService.off();
              this.close();
            } else {
              this.isSubmit = false;
              // this.#toastService.mixin(
              //   reqResponse?.status?.['message'] as string,
              //   ALERT_MESSAGES_UTILISATEUR.ERROR_UTILISATEUR_CREATION.icon
              // );
              Swal.fire({
                toast: true,
                icon: 'error',
                title: "Erreur lors de la création de l'utilisateur",
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
            }
          },
          error: (error) => {
            this.isSubmit = false;
            console.error(error);
            // this.#toastService.mixin(
            //   ALERT_MESSAGES_UTILISATEUR.ERROR_UTILISATEUR_CREATION.text,
            //   ALERT_MESSAGES_UTILISATEUR.ERROR_UTILISATEUR_CREATION.icon
            // );
          },
        });
        // }
        // }
        //    else {
        //     return;
      }
      // });
    } else if (
      this.btnSubmitText === 'Modifier un utilisateur' &&
      this.newUtilisateurFormulaire.valid &&
      this.Profils.length > 0
    ) {
      let utilisateur: Users = {
        lastName: this.newUtilisateurFormulaire.get('lastName')!.value,
        firstName: this.newUtilisateurFormulaire.get('firstName')!.value,
        telephone: this.newUtilisateurFormulaire.get('telephone')!.value,
        email: this.newUtilisateurFormulaire.get('email')!.value,
        fonction: this.newUtilisateurFormulaire.get('fonction')!.value,
        login: this.newUtilisateurFormulaire.get('login')!.value,
        originHierarchieLibelle: HierarchieLibelle,
        originHierarchieId: HierarchieId,
        isLdap: this.newUtilisateurFormulaire.get('ldap')!.value,
        profils: this.Profils,
        idUser: this.selectedUserId,
        idDepartment: this.newUtilisateurFormulaire.get('idDepartment')!.value,
      };
      console.log(
        'les données du formulaire au moment du update à envoyer',
        utilisateur
      );

      utilisateur = {
        ...utilisateur,
      };
      // this.#toastService
      //   .confirm(
      //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_CHANGES.title,
      //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_CHANGES.text,
      //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_CHANGES.confirmButtonText,
      //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_CHANGES.cancelButtonText
      //   )
      //   .then((result) => {
      // if (result.isConfirmed) {
      this.isSubmit = true;
      console.log('data back', utilisateur);

      this.#usersService.updateUtilisateur(utilisateur).subscribe({
        next: (reqResponse) => {
          this.isSubmit = false;
          if (!reqResponse.hasError) {
            Swal.fire({
              toast: true,
              icon: 'success',
              title: "L'utilisateur a été modifié avec succès.",
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.newUtilisateurFormulaire.reset();
            this.paginatedDataProfil = [];
            // this.#toastService.mixin(
            //   ALERT_MESSAGES_UTILISATEUR.SUCCESS_CHANGES.text,
            //   ALERT_MESSAGES_UTILISATEUR.SUCCESS_CHANGES.icon
            // );
            // this.#modalService.off();
            // this.utilisateurModifie.emit(); // Émettre un signal de rafraîchissement
            // this.#modalActive.dismiss();

            this.close();
          } else {
            // this.#toastService.mixin(
            //   reqResponse?.status?.['message'] as string,
            //   ALERT_MESSAGES_UTILISATEUR.ERROR_CHANGES.icon
            // );
            Swal.fire({
              toast: true,
              icon: 'error',
              title: "Erreur lors de la modification de l'utilisateur",
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          }
        },
        error: (error) => {
          this.isSubmit = false;
          console.error(error);
          // this.#toastService.mixin(
          //   ALERT_MESSAGES_UTILISATEUR.ERROR_CHANGES.text,
          //   ALERT_MESSAGES_UTILISATEUR.ERROR_CHANGES.icon
          // );
        },
      });
      //   } else {
      //     return;
      //   }
      // });
    }
  }

  AjoutProfil() {
    let objet: {
      id: number;
      libelle: string;
      dateDebutProfil: any;
      dateFinProfil: any;
    };
    let profils: any = this.newProfilFormulaire.controls['profil']!.value;
    let dateDebut: any = this.newProfilFormulaire.get('dateDebut')!.value;
    let dateFin: any = this.newProfilFormulaire.get('dateFin')!.value;
    const today = moment().startOf('day'); // date du jour sans l'heure
    const startDate = moment(dateDebut, 'YYYY-MM-DD');
    const endDate = moment(dateFin, 'YYYY-MM-DD');

    if (dateFin !== '') {
      if (startDate > endDate) {
        // this.#toastService.mixin(
        //   "La date de debut ne doit pas être après la date de fin",
        //   ALERT_MESSAGES_UTILISATEUR.ERROR_CHANGES.icon
        // );
        Swal.fire({
          toast: true,
          icon: 'error',
          title: 'La date de debut ne doit pas être après la date de fin',
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        return;
      }
    }

    if (startDate.isBefore(today)) {
      // this.#toastService.mixin(
      //   "La date de début ne peut pas être antérieure à la date d'aujourd'hui",
      //   ALERT_MESSAGES_UTILISATEUR.ERROR_CHANGES.icon
      // );
      Swal.fire({
        toast: true,
        icon: 'error',
        title:
          "La date de début ne peut pas être antérieure à la date d'aujourd'hui",
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    if (dateDebut == '') {
      objet = {
        id: profils.id,
        libelle: profils.libelle,
        // dateDebutProfil: '',
        dateDebutProfil: this.utilities.getDate(),
        dateFinProfil: dateFin ? moment(dateFin).format('DD/MM/YYYY') : null,
      };
    } else {
      objet = {
        id: profils.id,
        libelle: profils.libelle,
        dateDebutProfil: dateDebut
          ? moment(dateDebut).format('DD/MM/YYYY')
          : null,
        dateFinProfil: dateFin ? moment(dateFin).format('DD/MM/YYYY') : null,
      };
    }
    this.Profils.unshift(objet);
    this.count = this.Profils.length;
    this.updatePaginatedData();
    this.newProfilFormulaire.reset();

    console.log('profile ajouté : ', objet);
  }

  // onDeleteClick(profil: any) {
  //   this.Profils = this.Profils.filter((value: any) => profil.id !== value.id);
  //   this.count = this.Profils.length;
  //   this.updatePaginatedData();
  // }

  onDeleteClick(profil: any) {
    Swal.fire({
      title: 'Retirer un profil',
      html: `Attention vous êtes sur le point de retirer le profil <span class='text-warning'>${profil.libelle}</span> de l'utilisateur, Voulez-vous poursuivre cette action ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF7900',
      cancelButtonColor: '#1E1100',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.Profils = this.Profils.filter(
          (value: any) => profil.id !== value.id
        );
        this.count = this.Profils.length;
        this.updatePaginatedData();
        // Swal.fire({
        //   toast: true,
        //   icon: 'success',
        //   title: 'Profil retiré avec succès',
        //   position: 'top-end',
        //   showConfirmButton: false,
        //   timer: 3000,
        //   timerProgressBar: true,
        // });
      }
    });
  }

  onPageChange(config: {
    [key: string]: string;
    index: string;
    pageSize: string;
  }) {
    console.log('pagination: ', config);
    this.index = +config.index;
    this.pageSize = +config.pageSize;

    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const startIndex = (this.index - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedDataProfil = this.Profils.slice(startIndex, endIndex);
    console.log('Tableau Profil:', this.paginatedDataProfil);
  }

  isListProfil = false;
  // size est le nbr d'element a afficher par page, a set nous meme cote front
  pageSize: number = 6;
  // index-1 2- 3- ...etc
  index: number = 1;
  // le nombre total d'element recuperer depuis le back-end
  count!: number;

  listProfil: ListRole = [];
  paginatedDataProfil: ListProfil = [];
  Profils: ListProfil = [];

  getListRole() {
    this.isListProfil = true;
    this.listProfil = [];

    this.#rolesService
      .getByCriteriaRole(
        {
          size: '',
          index: '',
        },
        false
      )
      .subscribe({
        next: (listRoleResponse) => {
          const { items, count } = listRoleResponse;
          this.listProfil = items;
          this.isListProfil = false;
          this.updatePaginatedData();
          console.log('la liste des roles créées est : ', this.listProfil);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  isListUser = false;
  listUser: ListUser | any = [];
  searchQuery: number = 0;
  currentPage = 1;

  // OnChangeDirection() {
  //   this.newUtilisateurFormulaire.patchValue({
  //     sousDirection: null,
  //     departement: null,
  //     service: null
  //   })
  //   this.getListSousDirection(null, this.newUtilisateurFormulaire.get('direction')!.value)
  // }

  // OnChangeDirection() {
  //   this.newUtilisateurFormulaire.patchValue({
  //     sousDirection: null,
  //     departement: null,
  //     service: null
  //   })
  // }

  // OnChangeSousDirection() {
  //   this.newUtilisateurFormulaire.patchValue({
  //     departement: null,
  //     service: null
  //   })
  //   this.getListDepartements(null, this.newUtilisateurFormulaire.get('sousDirection')!.value)
  // }

  // OnChangeDepartement() {
  //   this.newUtilisateurFormulaire.patchValue({

  //     service: null
  //   })
  //   this.getListService(null, this.newUtilisateurFormulaire.get('departement')!.value)
  // }

  cleanInputUserLdap() {
    // this.EnableFormLdap();
    this.newUtilisateurFormulaire.patchValue({
      email: '',
      lastName: '',
      firstName: '',
      telephone: '',
      fonction: '',
      // nom: userLdap.nom
    });
    // console.log("TEST:",this.formUtilisateur)
  }

  switchLdap() {
    let userLdap: any = this.newUtilisateurFormulaire.controls['ldap']?.value;
    let nom: any =
      this.newUtilisateurFormulaire.controls['lastName']?.value || undefined;
    if (userLdap) {
      // Réinitialiser tous les champs sauf le champ 'ldap'
      this.newUtilisateurFormulaire.reset({
        ldap: true,
      });

      // Désactiver certains champs manuellement (si besoin)
      this.disableFields(this.newUtilisateurFormulaire, this.fields);
    } else {
      // Si décoché, réactiver les champs pour saisie manuelle
      this.enableFields(this.newUtilisateurFormulaire, this.fields);
    }

    if (userLdap == false && nom !== undefined) {
      // this.#toastService
      //   .confirm(
      //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_CHANGES_UTILISATEUR_LDAP.title,
      //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_CHANGES_UTILISATEUR_LDAP.text,
      //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_CHANGES_UTILISATEUR_LDAP.confirmButtonText,
      //     ALERT_MESSAGES_UTILISATEUR.CONFIRM_CHANGES_UTILISATEUR_LDAP.cancelButtonText
      //   )
      // .then((res) => {
      //   if (res.isConfirmed) {
      this.newUtilisateurFormulaire.patchValue({
        ldap: false,
      });
      this.enableFields(this.newUtilisateurFormulaire, this.fields);
    } else {
      this.newUtilisateurFormulaire.patchValue({
        login: '',
        lastName: '',
        firstName: '',
        telephone: '',
        email: '',
        fonction: '',
      });
      if (userLdap) {
        // Réinitialiser tous les champs sauf le champ 'ldap'
        this.newUtilisateurFormulaire.reset({
          ldap: true,
        });
        // this.DisableFormLdap();
        this.disableFields(this.newUtilisateurFormulaire, this.fields);
      } else {
        // this.EnableFormLdap();
        this.enableFields(this.newUtilisateurFormulaire, this.fields);
      }
    }
    // })
    // } else if (userLdap == true && nom !== undefined) {
    //   this.newUtilisateurFormulaire.patchValue({
    //     login: '',
    //   })
    // }
  }

  searchUserLdap: boolean = false;
  getUserLdap() {
    const userLdap = this.newUtilisateurFormulaire.get('login')?.value;
    if (!userLdap) {
      this.newUtilisateurFormulaire
        .get('login')
        ?.markAsTouched({ onlySelf: true });
      return;
    }
    this.searchUserLdap = true;
    this.#usersService.searchUserLdap(userLdap).subscribe({
      next: (res: any) => {
        this.searchUserLdap = false;
        console.log('Réponse du service :', res); // Afficher la réponse pour le débogage
        if (res && !res.hasError) {
          // this.listeSites = res.items;
          if (res.item.email && res.item.lastName && res.item.login) {
            this.newUtilisateurFormulaire.patchValue({
              email: res.item.email,
              lastName: res.item.lastName,
              firstName: res.item.firstName,
              telephone: res.item?.telephone,
              fonction: res.item?.fonction,
            });
            this.disableFields(this.newUtilisateurFormulaire, this.fields);
          } else {
            // this.#toastService.mixin(
            //   "vous n'avez pas de compte Ldpa",
            //   ALERT_MESSAGES_UTILISATEUR.ERROR_CHANGES.icon
            // );
            this.newUtilisateurFormulaire.get('login')?.markAsTouched();
            this.newUtilisateurFormulaire.patchValue({
              email: '',
              lastName: '',
              firstName: '',
              telephone: '',
              fonction: '',
            });
          }
        } else {
          // this.#toastService.mixin(
          //   res.status.message,
          //   ALERT_MESSAGES_UTILISATEUR.ERROR_CHANGES.icon
          // );
        }
      },
      error: (error: any) => {
        this.searchUserLdap = false;
      },
    });
  }

  validerEtSoumettre() {
    if (this.newUtilisateurFormulaire.valid && this.Profils.length > 0) {
      this.utilisateurValide.emit();
      this.OnSubmit(); // ta méthode de soumission existante
    }
  }

  close() {
    console.log('Fin');
    this.#modalActive.close();
    this.newUtilisateurFormulaire.reset();
    // this.viewCodeRole = false;
    // this.isRoleGenerate = false;
    // this.roleId = "";
    // this.utilisateurModifie.emit();
    // this.refreshTable.emit()
    this.#router.navigate(['/administration/utilisateurs']);
    // this.#modalService.off();
  }

  isProfilSelected(profil: any): boolean {
    return this.paginatedDataProfil.some((p: any) => p.id === profil.id);
  }
}
