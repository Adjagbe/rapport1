import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';
import { distinctUntilChanged, map, Subscription, switchMap, tap } from 'rxjs';
import { GestionCampagnesService } from 'src/app/Core/Services/gestion-campagnes.service';
import { ACCOUNTS_STATUS } from 'src/app/Core/Constants/gestion-utilisateurs.constant';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CertifiedAccountFormComponent } from '../certified-account-form/certified-account-form.component';
import { PaginationComponent } from 'src/app/Shared/Components/pagination/pagination.component';
import { CertificationService } from 'src/app/Core/Services/certification.service';
import { CertifiedUserDetailsComponent } from '../certified-user-details/certified-user-details.component';
import { GetCampaignApplicationUsersResponse } from 'src/app/Models/gestion-campagnes.model';
import { GenericTableV2Component } from 'src/app/Shared/Components/generic-table-v2/generic-table-v2.component';
import Swal from 'sweetalert2';
import { HasPermissionDirective } from 'src/app/Core/hasPermission/has-permission.directive';

@Component({
  selector: 'details-list',
  standalone: true,
  imports: [
    CommonModule,
    BtnGenericComponent,
    PaginationComponent,
    GenericTableV2Component,
    HasPermissionDirective,
  ],
  templateUrl: './app-details.component.html',
  styleUrls: ['./app-details.component.scss'],
})
export class DetailsListComponent implements OnInit, OnChanges {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #commonUtils = inject(CommonUtils);
  #campagneService = inject(GestionCampagnesService);
  #certificationService = inject(CertificationService);
  #ngModal = inject(NgbModal);

  ACCOUNTS_STATUS = ACCOUNTS_STATUS;
  idApplication!: number;
  idCampagne!: number;

  @Input() selectedAppCertification: any | null = null;
  @Output() backToDetails = new EventEmitter<void>();

  datas: { [key: string]: any }[] | null = null;

  // Propriété pour déterminer s'il y a au moins un compte certifié
  hasCertifiedAccounts: boolean = false;

  columns: { label: string; key: string }[] = [
    { label: 'Login', key: 'login' },
    { label: 'Nom', key: 'name' },
    { label: 'Adresse', key: 'email' },
    { label: 'Cuid', key: 'cuid' },
    { label: 'Profils', key: 'profileName' },
    { label: 'Direction', key: 'departmentName' },
    { label: 'Statut', key: 'finalCertificationStatus' },
  ];

  #usersSubscription: Subscription | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 15;
  totalUsers = 0;

  // Filtrage
  currentFilter: { column: string; value: string } | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedAppCertification'] && this.selectedAppCertification) {
      this.currentPage = 1;
      this.loadUsers();
    }
  }

  ngOnInit(): void {
    this.#route.queryParams.subscribe((params) => {
      this.idApplication = params['application'];
      this.idCampagne = params['certification'];
    });
    this.#certificationService.certificationSuccess$.subscribe(() => {
      this.loadUsers();
    });
  }

  loadUsers() {
    this.#usersSubscription?.unsubscribe();
    this.#usersSubscription = this.#route.queryParamMap
      .pipe(
        map((querys) => ({
          idCertification: +(querys.get('certification') ?? -1),
          idApplication: +(querys.get('application') ?? -1),
        })),
        tap((ids) => {
          if (ids.idCertification === -1 || ids.idApplication === -1) {
            this.datas = null;
            this.totalUsers = 0;
            return;
          }
        }),
        switchMap((ids) => {
          if (ids.idCertification === -1 || ids.idApplication === -1) {
            return [];
          }
          // Appel correct avec pagination
          return this.#campagneService.getUsersByCampaignApplication(
            ids.idCertification,
            ids.idApplication,
            this.currentPage,
            this.pageSize,
            this.currentFilter || undefined
          );
        }),
        map((response) => {
          // On attend { items, count }
          this.totalUsers = response.count;
          return response.items;
        }),
        map((users) => {
          return users.map((user: any) => {
            const {
              accountStatusImported,
              campaignName,
              createdAt,
              idDepartment,
              idFile,
              isDeleted,
              ...rest
            } = user;
            return rest as Partial<GetCampaignApplicationUsersResponse>;
          });
        })
      )
      .subscribe({
        next: (users) => {
          this.datas = users.map((user: any) => ({
            ...user,
            name: `${user.firstName} ${user.lastName}`,
            finalCertificationStatus:
              ACCOUNTS_STATUS[
                user.finalCertificationStatus as keyof typeof ACCOUNTS_STATUS
              ],
          }));
          this.hasCertifiedAccounts =
            this.datas?.some(
              (user) => user['finalCertificationStatus'] === 'certifié'
            ) ?? false;
        },
        error: (error) => {
          this.datas = null;
          this.totalUsers = 0;
          this.hasCertifiedAccounts = false;
        },
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  onFilter(filter: { column: string; value: string }) {
    console.log('Filtre appliqué:', filter);
    this.currentFilter = filter.value ? filter : null;
    this.currentPage = 1; // Réinitialiser à la première page lors du filtrage
    this.loadUsers();
  }

  openCertifiedAccountForm(user: any) {
    console.log('idAccount: ', user);
    console.log('selected app: ', this.selectedAppCertification);
    const modalRef = this.#ngModal.open(CertifiedAccountFormComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });

    modalRef.componentInstance.idAccount = user.idUserAccount;
    modalRef.componentInstance.userDetails = { ...user };
    modalRef.componentInstance.idApplication = +this.idApplication;
    modalRef.componentInstance.idCampagne = +this.idCampagne;
    modalRef.componentInstance.appName =
      this.selectedAppCertification?.applicationName ?? null;
  }

  details(idCamppaignApplicationUseraccount: number) {
    console.log('before passe: ', idCamppaignApplicationUseraccount);
    const modalRef = this.#ngModal.open(CertifiedUserDetailsComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });

    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: {
        details: idCamppaignApplicationUseraccount,
      },
      queryParamsHandling: 'merge',
    });
  }

  goBack() {
    this.backToDetails.emit();

    const config: NavigationExtras = {
      relativeTo: this.#route,
      queryParams: {
        details: null,
      },
      queryParamsHandling: 'merge',
    };
    this.#router.navigate([], config);
  }

  /**
   * Télécharge le fichier Excel de certification d'une plateforme uniquement si tous les comptes sont certifiés.
   */
  downloadCertifiedAccountsExcel() {
    console.log(this.selectedAppCertification);
    // Vérifier si la plateforme sélectionnée existe et si tous les comptes sont certifiés
    if (!this.selectedAppCertification) {
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'Erreur',
        text: 'Aucune application sélectionnée',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    // Vérifier si tous les comptes sont certifiés
    if (
      this.selectedAppCertification.uncertifiedAccountsInApp &&
      this.selectedAppCertification.uncertifiedAccountsInApp > 0
    ) {
      Swal.fire({
        toast: true,
        icon: 'warning',
        title: 'Comptes non certifiés',
        text: 'Tous les comptes de cette plateforme doivent être certifiés pour télécharger le fichier.',
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });
      return;
    }

    // Appel du service pour télécharger le fichier Excel certifié
    this.#campagneService
      .downloadCertifiedAccountsFile(
        this.idCampagne,
        this.selectedAppCertification.applicationName
      )
      .subscribe({
        next: (res) => {
          if (!res.fileContent) {
            Swal.fire({
              toast: true,
              icon: 'error',
              title: 'Erreur',
              text: 'Aucun contenu de fichier retourné',
              position: 'top-end',
              showConfirmButton: false,
              timer: 4000,
              timerProgressBar: true,
            });
            return;
          }
          // Décoder le base64 en Blob
          const byteCharacters = atob(res.fileContent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: res.mimeType });
          // Créer un lien de téléchargement
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = res.fileName || 'certification.xlsx';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          Swal.fire({
            toast: true,
            icon: 'success',
            title: 'Téléchargement réussi',
            text: `Le fichier ${res.fileName} a été téléchargé avec succès`,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        },
        error: (error) => {
          Swal.fire({
            toast: true,
            icon: 'error',
            title: 'Erreur de téléchargement',
            text: 'Une erreur est survenue lors du téléchargement du fichier Excel',
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
          });
        },
      });
  }
}
