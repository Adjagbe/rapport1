import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Subscription, switchMap, tap } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { GestionCampagnesService } from 'src/app/Core/Services/gestion-campagnes.service';
import { UsersService } from 'src/app/Core/Services/users.service';
import {
  AppFiles,
  ApplicationDetail,
} from 'src/app/Models/gestion-campagnes.model';
import { ACCOUNTS_STATUS } from 'src/app/Core/Constants/gestion-utilisateurs.constant';
import { PaginationComponent } from 'src/app/Shared/Components/pagination/pagination.component';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CertifiedUserDetailsComponent } from 'src/app/Certification/components/certified-user-details/certified-user-details.component';
import { GenericTableV2Component } from 'src/app/Shared/Components/generic-table-v2/generic-table-v2.component';
import { DownloadIconComponent } from 'src/app/Core/icons/download-icon.component';
import { HasPermissionDirective } from 'src/app/Core/hasPermission/has-permission.directive';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    BtnGenericComponent,
    GenericTableV2Component,
    BtnGenericComponent,
    DownloadIconComponent,
    HasPermissionDirective
  ],
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.scss'],
})
export class AppListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selectedApp: ApplicationDetail | null = null;
  @Output() backToDetails = new EventEmitter<void>();

  columns:
    | {
        label: string;
        key: string;
        sortable?: boolean | undefined;
      }[] = [
    { label: 'Login', key: 'login' },
    { label: 'Nom', key: 'name' },
    { label: 'Adresse', key: 'email' },
    { label: 'Cuid', key: 'cuid' },
    { label: 'Profils', key: 'profileName' },
    { label: 'Statut', key: 'finalCertificationStatus' },
    { label: 'Direction', key: 'departmentName' },
  ];
  datas: { [key: string]: any }[] | null = null;

  // Propriété pour déterminer s'il y a au moins un compte certifié
  hasCertifiedAccounts: boolean = false;

  // Pagination
  currentPage = 1;
  pageSize = 4;
  totalUsers = 0;

  // Filtrage
  currentFilter: { column: string; value: string } | null = null;

  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #campagneService = inject(GestionCampagnesService);
  #usersService = inject(UsersService);
  #ngModal = inject(NgbModal);

  ACCOUNTS_STATUS = ACCOUNTS_STATUS;

  #usersSubscription!: Subscription;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedApp'] && this.selectedApp) {
      this.currentPage = 1;
      this.loadUsers();
      this.#loadCurrentAppList();
    }
  }

  ngOnInit(): void {
    this.#loadCurrentAppList();
    this.#route.queryParamMap
      .pipe(
        tap((params) => {
          if (params.get('campagne') && !params.get('application')) {
            this.uploadedFiles = null;
          }
        })
      )
      .subscribe();
  }

  loadUsers() {
    this.#usersSubscription?.unsubscribe();
    this.#usersSubscription = this.#route.queryParamMap
      .pipe(
        map((querys) => ({
          idCampaign: +(querys.get('campagne') ?? -1),
          idApplication: +(querys.get('application') ?? -1),
        })),
        tap((ids) => {
          if (ids.idCampaign === -1 || ids.idApplication === -1) {
            this.datas = null;
            this.totalUsers = 0;
            return;
          }
        }),
        switchMap((ids) => {
          if (ids.idCampaign === -1 || ids.idApplication === -1) {
            return [];
          }
          return this.#campagneService.getUsersByCampaignApplication(
            ids.idCampaign,
            ids.idApplication,
            this.currentPage,
            this.pageSize,
            this.currentFilter || undefined
          );
        }),
        map((response: any) => {
          this.totalUsers = response.count;
          return response.items;
        }),
        map((users) => {
          return users.map((user: any) => {
            const {
              accountStatusImported,
              campaignName,
              createdAt,
              idCampaign,
              idDepartment,
              idFile,
              idUserAccount,
              isDeleted,
              ...rest
            } = user;
            return rest;
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
  uploadedFiles: AppFiles[] | null = null;
  #loadCurrentAppList() {
    const campagneId = this.#route.snapshot.queryParamMap.get('campagne');
    if (!campagneId) return;
    this.#campagneService
      .getCampagneDetails(+campagneId)
      .pipe(
        map(
          (campagne) =>
            campagne.applicationDetails.find(
              (app) => app.applicationId === this.selectedApp?.applicationId
            ) ?? null
        ),
        tap((app) => (this.uploadedFiles = app?.files ?? null))
      )
      .subscribe();
  }

  downloadFile(file: AppFiles) {
    if (!file.id) {
      console.error('ID du fichier manquant');
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'Erreur',
        text: 'ID du fichier manquant',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    this.#campagneService.getFile(file.id).subscribe({
      next: (blob: Blob) => {
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Nommer le fichier avec l'extension .csv
        const fileName = file.fileName
          ? `${file.fileName}.csv`
          : `export_comptes_${file.id}.csv`;
        link.download = fileName;

        // Déclencher le téléchargement
        document.body.appendChild(link);
        link.click();

        // Nettoyer le DOM
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Notification de succès
        Swal.fire({
          toast: true,
          icon: 'success',
          title: 'Téléchargement réussi',
          text: `Le fichier ${fileName} a été téléchargé avec succès`,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement du fichier:', error);
        Swal.fire({
          toast: true,
          icon: 'error',
          title: 'Erreur de téléchargement',
          text: 'Une erreur est survenue lors du téléchargement du fichier',
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
      },
    });
  }

  /**
   * Télécharge le fichier Excel de certification d’une plateforme uniquement si tous les comptes sont certifiés.
   */
  downloadCertifiedAccountsExcel() {
    // Vérifier si la plateforme sélectionnée existe et si tous les comptes sont certifiés
    if (!this.selectedApp) {
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
    if (
      this.selectedApp.uncertifiedAccountsInApp &&
      this.selectedApp.uncertifiedAccountsInApp > 0
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
    const campagneId = this.#route.snapshot.queryParamMap.get('campagne');
    if (!campagneId) {
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'Erreur',
        text: 'ID campagne manquant',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }
    this.#campagneService
      .downloadCertifiedAccountsFile(
        +campagneId,
        this.selectedApp.applicationName
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

  ngOnDestroy(): void {
    this.#usersSubscription?.unsubscribe();
  }

  backToCampagneDetails() {
    this.selectedApp = null;
    this.backToDetails.emit();
  }

  details(idCampaignApplicationUseraccount: number) {
    console.log('before passe: ', idCampaignApplicationUseraccount);
    const modalRef = this.#ngModal.open(CertifiedUserDetailsComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });

    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: {
        details: idCampaignApplicationUseraccount,
      },
      queryParamsHandling: 'merge',
    });
  }
}
