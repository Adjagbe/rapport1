import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, map, tap, throwError } from 'rxjs';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';
import { environment } from 'src/environments/environment.development';
import { LoaderService } from './loader.service';
import { DASHBOARD_ENDPOINTS } from '../Constants/Dashboard.constant';
import {
  EvolutionDataEntry,
  ExportAccountStatus,
  GetCampagneDetailsResponse,
  GetCampagnesGlobalStatsResponse,
  GetEvolutionCertificationResponse,
} from 'src/app/Models/dashboard.model';
import { GestionCampagnesService } from './gestion-campagnes.service';
import { ProgressTrackerData } from 'src/app/Models/dashboard.model';
import Swal from 'sweetalert2';

export type FilterCriteria = {
  startDate: string;
  estimatedEndDate: string;
  search: string;
};

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  #commonUtils = inject(CommonUtils);
  #httpClient = inject(HttpClient);
  #loaderService = inject(LoaderService);
  #gestionCampagnesService = inject(GestionCampagnesService);
  #baseUrl = environment.urlCore;

  #buildUrl(endpoint: string) {
    return `${this.#baseUrl}${endpoint}`;
  }

  #handleError(error: any, message?: string) {
    // Ici tu peux personnaliser le traitement (log, notification, etc.)
    console.error('[ERREUR API DASHBOARD] :', error);
    return throwError(() => new Error(message ?? 'Erreur Api'));
  }

  #filterCampagne: BehaviorSubject<FilterCriteria> = new BehaviorSubject({
    startDate: this.#commonUtils.formatDateForInput(new Date()),
    estimatedEndDate: this.#commonUtils.formatDateForInput(
      this.#commonUtils.additionnerJours(new Date(), 6)
    ),
    search: '',
  });

  get filterCampagne$() {
    return this.#filterCampagne.asObservable();
  }

  setFilterCampagne(filter: FilterCriteria) {
    this.#filterCampagne.next(filter);
  }

  getCampagnesGlobalStats() {
    this.#loaderService.show();
    const body = {
      data: {},
    };
    return this.#httpClient
      .post<GetCampagnesGlobalStatsResponse>(
        this.#buildUrl(DASHBOARD_ENDPOINTS.get_campagnes_global_stats),
        body
      )
      .pipe(
        tap((res) => {
          this.#loaderService.hide();
        }),
        map((response) => {
          if (!response.hasError) {
            const {
              totalActiveCampaigns,
              totalClosedCampaigns,
              totalDeactivatedCampaigns,
              totalScheduledCampaigns,
              totalEndedCampaigns,
              totalCampaigns,
            } = response.item;
            return {
              campagnes_actives: totalActiveCampaigns,
              campagnes_plainifier: totalScheduledCampaigns,
              campagnes_desactive: totalDeactivatedCampaigns,
              campagnes_terminees: totalEndedCampaigns,
              campagnes_cloturer: totalClosedCampaigns,
              total_campagnes: totalCampaigns,
            };
          } else {
            Swal.fire({
              title: 'Erreur',
              text: 'Erreur lors de la récupération des stats',
              icon: 'error',
            });
            return {
              campagnes_en_cours: 0,
              campagnes_terminees: 0,
              total_campagnes: 0,
            };
          }
        }),
        catchError((error) =>
          this.#handleError(error, 'Erreur lors de la récupération des stats')
        )
      );
  }

  getActiveCampagnes(page: number = 1, pageSize: number = 4) {
    return this.#gestionCampagnesService
      .getCampagnes('ACTIVE', '', page, pageSize, true)
      .pipe(
        map((response) => {
          const progressTrackerData: ProgressTrackerData[] =
            response.campagnesList.map((campagne) => ({
              id: campagne.idCampaign,
              title: campagne.name,
              dates: `${this.#commonUtils.formatDateForBackend(
                campagne.startDate
              )} - ${this.#commonUtils.formatDateForBackend(
                campagne.estimatedEndDate
              )}`,
              progression: Math.round(campagne.progressionRate || 0),
              certifiedUsers: campagne.certifiedAccounts || 0,
              totalUsers: campagne.totalAccounts || 0,
              status: 'active' as const,
            }));

          return {
            campagnes: progressTrackerData,
            totalCampagnes: response.totalCampagnes,
          };
        }),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur lors de la récupération des campagnes actives'
          )
        )
      );
  }

  getClosedCampagnes(page: number = 1, pageSize: number = 4) {
    return this.#gestionCampagnesService
      .getCampagnes('CLOTURE', '', page, pageSize, true)
      .pipe(
        map((response) => {
          const progressTrackerData: ProgressTrackerData[] =
            response.campagnesList.map((campagne) => ({
              id: campagne.idCampaign,
              title: campagne.name,
              dates: `${this.#commonUtils.formatDateForBackend(
                campagne.startDate
              )} - ${this.#commonUtils.formatDateForBackend(
                campagne.estimatedEndDate
              )}`,
              progression: Math.round(campagne.progressionRate || 0),
              certifiedUsers: campagne.certifiedAccounts || 0,
              totalUsers: campagne.totalAccounts || 0,
              status: 'Clôturer' as const,
            }));

          return {
            campagnes: progressTrackerData,
            totalCampagnes: response.totalCampagnes,
          };
        }),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur lors de la récupération des campagnes clôturées'
          )
        )
      );
  }

  getTerminatedCampagnes(page: number = 1, pageSize: number = 4) {
    return this.#gestionCampagnesService
      .getCampagnes('TERMINATE', '', page, pageSize, true)
      .pipe(
        map((response) => {
          const progressTrackerData: ProgressTrackerData[] =
            response.campagnesList.map((campagne) => ({
              id: campagne.idCampaign,
              title: campagne.name,
              dates: `${this.#commonUtils.formatDateForBackend(
                campagne.startDate
              )} - ${this.#commonUtils.formatDateForBackend(
                campagne.estimatedEndDate
              )}`,
              progression: Math.round(campagne.progressionRate || 0),
              certifiedUsers: campagne.certifiedAccounts || 0,
              totalUsers: campagne.totalAccounts || 0,
              status: 'Terminé' as const,
            }));

          return {
            campagnes: progressTrackerData,
            totalCampagnes: response.totalCampagnes,
          };
        }),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur lors de la récupération des campagnes terminées'
          )
        )
      );
  }

  getDetails(idCampaign: number) {
    const body = {
      data: {
        idCampaign,
      },
    };

    return this.#httpClient
      .post<GetCampagneDetailsResponse>(
        this.#buildUrl(DASHBOARD_ENDPOINTS.get_campagne_details),
        body
      )
      .pipe(
        map((response) => {
          if (!response.hasError) {
            return response.item;
          } else {
            Swal.fire({
              title: 'Erreur',
              text: 'Erreur lors de la récupération des détails',
              icon: 'error',
            });
            return null;
          }
        }),
        catchError((error) =>
          this.#handleError(error, 'Erreur lors de la récupération des détails')
        )
      );
  }

  evolutionCertification(idCampaign: number, granularity: string) {
    const body = {
      data: {
        idCampaign,
        groupBy: 'department',
        granularity,
      },
    };

    return this.#httpClient
      .post<GetEvolutionCertificationResponse>(
        this.#buildUrl(DASHBOARD_ENDPOINTS.get_evolution_certification),
        body
      )
      .pipe(
        map((response) => {
          if (!response.hasError) {
            return response.item;
          } else {
            Swal.fire({
              title: 'Erreur',
              text: 'Erreur lors de la récupération des données',
              icon: 'error',
            });
            return null;
          }
        }),
        catchError((error) =>
          this.#handleError(error, 'Erreur lors de la récupération des données')
        )
      );
  }

  exportReportByStatus(
    idCampaign: number,
    exportAccountStatus: ExportAccountStatus
  ) {
    const body = {
      data: {
        idCampaign,
        exportAccountStatus,
      },
    };

    return this.#httpClient
      .post(this.#buildUrl(DASHBOARD_ENDPOINTS.get_report_by_status), body, {
        responseType: 'blob',
      })
      .pipe(
        map((blob: Blob) => {
          // Créer un lien de téléchargement
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;

          // Nommer le fichier selon le statut
          const statusLabels = {
            TO_DEACTIVATE: 'comptes_a_desactiver',
            PROFILE_CHANGE_NEEDED: 'comptes_modification_profil',
            MOVED_DEPARTMENT: 'comptes_mobilite_interne',
            PENDING: 'comptes_a_investiguer',
          };

          const fileName = `export_${statusLabels[exportAccountStatus]}_campagne_${idCampaign}.csv`;
          link.download = fileName;

          // Déclencher le téléchargement
          document.body.appendChild(link);
          link.click();

          // Nettoyer
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          return blob;
        }),
        catchError((error) =>
          this.#handleError(error, "Erreur lors de l'export du rapport")
        )
      );
  }

  exportCampagneRaportAsCSV({
    idCampaign,
    campaignName,
  }: {
    idCampaign: number;
    campaignName: string | null;
  }) {
    const payload = {
      data: {
        idCampaign,
      },
    };

    return this.#httpClient
      .post(this.#buildUrl(DASHBOARD_ENDPOINTS.get_raport_csv), payload)
      .pipe(
        tap((response: any) => {
          if (!response.fileContent) {
            Swal.fire({
              title: 'Erreur',
              text: 'Aucun contenu de fichier retourné',
              icon: 'error',
              showConfirmButton: false,
              timer: 5000,
              timerProgressBar: true,
            });
            return;
          }

          // Décoder le base64 en Blob
          const byteCharacters = atob(response.fileContent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {
            type: response.mimeType || 'application/octet-stream',
          });

          // Créer un lien de téléchargement
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;

          // Utiliser le nom de fichier retourné par l'API ou générer un nom par défaut
          const fileName =
            response.fileName ||
            `rapport_${campaignName || `campagne_${idCampaign}`}.xlsx`;
          link.download = fileName;

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          Swal.fire({
            title: 'Succès',
            text: `Le rapport de la campagne "${campaignName}" a été téléchargé avec succès`,
            icon: 'success',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
          });
        }),
        catchError((error) => {
          Swal.fire({
            title: 'Erreur',
            text: `Erreur lors de l'export du rapport de la ${
              campaignName ? campaignName : 'campagne'
            }`,
            icon: 'error',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
          });
          return this.#handleError(
            error,
            "Erreur lors de l'export du rapport de campagne"
          );
        })
      );
  }
}

// TO_DEACTIVATE = "Comptes illégitimes à désactiver",
// PROFILE_CHANGE_NEEDED = changement de profil,MOVED_DEPARTMENT = mobilité interne,
// PENDING = "Comptes à investiguer"
