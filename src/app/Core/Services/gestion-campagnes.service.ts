import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { GESTION_CAMPAGNES_ENDPOINTS } from '../Constants/gestion-campagnes.constant';
import { catchError, map, tap, throwError, Subject } from 'rxjs';
import {
  CampagneModelForm,
  CampagneModelUpdateForm,
  GetCampagnesResponse,
  GetCampagneDetailsResponse,
  GetCampaignApplicationUsersResponse,
  AddOrReplaceUsersToCampaignApplicationPayload,
  AddOrReplaceUsersToCampaignApplicationResponse,
  EditCampagneHistoryApiResponse,
  DownloadCertifiedAccountsFileResponse,
} from 'src/app/Models/gestion-campagnes.model';
import { LoaderService } from './loader.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class GestionCampagnesService {
  #httpClient = inject(HttpClient);
  #loaderService = inject(LoaderService);
  #baseUrl = environment.urlCore;
  constructor() {}
  #buildUrl(endpoint: string) {
    return `${this.#baseUrl}${endpoint}`;
  }
  #handleError(error: any, message?: string) {
    // Ici tu peux personnaliser le traitement (log, notification, etc.)
    console.error('[ERREUR API CAMPAGNE] :', error);
    return throwError(() => new Error(message ?? 'Erreur Api'));
  }

  #refreshCampagnes$ = new Subject<void>();
  refreshCampagnes$ = this.#refreshCampagnes$.asObservable();

  #refreshCampagneDetails$ = new Subject<void>();
  refreshCampagneDetails$ = this.#refreshCampagneDetails$.asObservable();

  public triggerRefreshCampagnes() {
    this.#refreshCampagnes$.next();
  }

  public triggerRefreshCampagneDetails() {
    this.#refreshCampagneDetails$.next();
  }

  getCampagnes(
    status?: string,
    name?: string,
    page?: number,
    pageSize?: number,
    strictEquality = false
  ) {
    this.#loaderService.show();
    let body: {
      index: number;
      size: number;
      data: {
        id: string;
        status: string;
        name: string;
        statusParam?: string;
      };
    } = {
      index: page ? page - 1 : 0,
      size: pageSize ?? 4,
      data: {
        id: '',
        status: status ?? '',
        name: name ?? '',
      },
    };
    if (strictEquality) {
      body = { ...body, data: { ...body.data, statusParam: '=' } };
    }
    return this.#httpClient
      .post<GetCampagnesResponse>(
        this.#buildUrl(GESTION_CAMPAGNES_ENDPOINTS.get),
        body
      )
      .pipe(
        map((response) => {
          if (!response?.hasError && response?.items) {
            const { items: campagnes = [] } = response;
            const campagnesList = campagnes.map((campagne) => {
              const {
                name,
                status,
                startDate,
                estimatedEndDate,
                idCampaign,
                userLastName,
                userFirstName,
                notCertifiedAccounts,
                progressionRate,
                certifiedAccounts,
                totalAccounts,
              } = campagne;
              return {
                name,
                status,
                startDate,
                estimatedEndDate,
                idCampaign,
                userLastName,
                userFirstName,
                notCertifiedAccounts,
                progressionRate,
                certifiedAccounts,
                totalAccounts,
              };
            });
            return {
              campagnesList,
              totalCampagnes: response.count,
            };
          } else {
            return {
              campagnesList: [],
              totalCampagnes: 0,
            };
          }
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  getCampagneById(idCampaign: number) {
    this.#loaderService.show();
    const body = {
      data: { idCampaign },
    };
    return this.#httpClient
      .post<GetCampagnesResponse>(
        this.#buildUrl(GESTION_CAMPAGNES_ENDPOINTS.get),
        body
      )
      .pipe(
        map((response) => {
          if (!response?.hasError) {
            return response.items[0];
          }
          return null;
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  getCampagneEditHistory(idCampaign: number) {
    this.#loaderService.show();
    const payload = {
      data: {
        idCampaign,
        auditActionType: 'MODIFICATION_CAMPAGNE',
      },
    };
    return this.#httpClient
      .post<EditCampagneHistoryApiResponse>(
        this.#buildUrl(GESTION_CAMPAGNES_ENDPOINTS.get_edit_history),
        payload
      )
      .pipe(
        map((response) => {
          if (!response.hasError && response?.items?.length) {
            return response.items;
          } else {
            return null;
          }
        }),
        catchError((error) => {
          this.#loaderService.hide();
          // On peut logger l'erreur ici si besoin
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  getCampagneDetails(idCampaign: number) {
    this.#loaderService.show();
    const campagne = {
      data: { idCampaign },
    };
    console.log('[B]: ', campagne);
    return this.#httpClient
      .post<GetCampagneDetailsResponse>(
        this.#buildUrl(GESTION_CAMPAGNES_ENDPOINTS.campaign_details),
        campagne
      )
      .pipe(
        map((response) => {
          if (!response.hasError && response.item) {
            return response.item;
          } else {
            throw Error(
              'Erreur survenue pendant la récupération des détails de la campagne'
            );
          }
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  createCampagne(campagne: CampagneModelForm) {
    this.#loaderService.show();
    return this.#httpClient
      .post(this.#buildUrl(GESTION_CAMPAGNES_ENDPOINTS.create), campagne)
      .pipe(
        tap((response) =>
          console.log('[Apres creation de la campagne]: ', response)
        ),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  updateCampagne(idCampaign: number, campagne: CampagneModelForm) {
    this.#loaderService.show();
    const campagneToUpdate: CampagneModelUpdateForm = {
      data: {
        ...campagne.data,
        idCampaign,
      },
    };
    return this.#httpClient
      .post<{ [key: string]: any; hasError: boolean }>(
        this.#buildUrl(GESTION_CAMPAGNES_ENDPOINTS.update),
        campagneToUpdate
      )
      .pipe(
        tap((response) =>
          console.log('[Apres mise a jour de la campagne]: ', response)
        ),
        map((response) => {
          if (!response?.hasError) {
            return response?.['item'] ?? response;
          }
          Swal.fire({
            toast: true,
            icon: 'error',
            title: 'Échec de la mise à jour',
            text:
              response?.['status']?.['message'] ??
              'Une erreur est survenue lors de la mise à jour de la campagne. Veuillez réessayer.',
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            customClass: {
              confirmButton: 'swal-custom-confirm',
              cancelButton: 'swal-custom-cancel',
              popup: 'swal-custom-popup',
            },
          });
          throw Error(
            response?.['status']?.['message'] ??
              'Une erreur est survenue lors de la mise à jour de la campagne. Veuillez réessayer.'
          );
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(
            error,
            'Erreur lors de la mise à jour de la campagne'
          );
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  /**
   * Récupère les utilisateurs d'une application liée à une campagne
   * @param user id de l'utilisateur effectuant la requête
   * @param idCampaign id de la campagne
   * @param idApplication id de l'application
   */
  getUsersByCampaignApplication(
    idCampaign: number,
    idApplication: number,
    page?: number,
    pageSize?: number,
    filter?: { column: string; value: string }
  ) {
    this.#loaderService.show();
    const body: any = {
      data: {
        byCampaignApplication: true,
        idCampaign,
        idApplication,
      },
    };
    if (typeof page === 'number' && typeof pageSize === 'number') {
      body.index = page - 1; // page commence à 1 côté UI, à 0 côté backend
      body.size = pageSize;
    }

    // Ajout du filtrage si fourni
    if (filter && filter.column && filter.value) {
      // Mapping des colonnes de l'interface vers les champs de l'API
      const columnMapping: { [key: string]: string } = {
        name: 'firstName', // Le nom complet est composé de firstName + lastName
        login: 'login',
        email: 'email',
        cuid: 'cuid',
        profileName: 'profileName',
        finalCertificationStatus: 'finalCertificationStatus',
        departmentName: 'departmentName',
        statusLibelle: 'statusLibelle',
      };

      const apiField = columnMapping[filter.column];

      if (apiField) {
        const shouldSkip = apiField === 'statusLibelle' && filter.value === '';

        if (!shouldSkip) {
          body.data[apiField] = filter.value;
        }
      }
    }
    return this.#httpClient
      .post<GetCampaignApplicationUsersResponse>(
        this.#buildUrl(
          GESTION_CAMPAGNES_ENDPOINTS.get_users_by_campaign_application
        ),
        body
      )
      .pipe(
        map((response) => {
          console.log('[USERS DE LA CAMPAGNE]: ', response);
          if (!response?.hasError && response?.items) {
            // Si le backend retourne count, on le garde, sinon fallback
            return {
              items: response.items,
              count: response.count ?? response.items.length,
            };
          } else {
            throw Error(
              'Erreur lors de la récupération des utilisateurs de la campagne/application'
            );
          }
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  disableCampagne(idCampaign: number) {
    this.#loaderService.show();
    const campagne = {
      datas: [
        {
          idCampaign: idCampaign,
        },
      ],
    };
    return this.#httpClient
      .post<{ [key: string]: any; hasError: boolean }>(
        this.#buildUrl(GESTION_CAMPAGNES_ENDPOINTS.disable),
        campagne
      )
      .pipe(
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(
            error,
            'Erreur lors de la désactivation de la campagne'
          );
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  enableCampagne(idCampagne: number) {
    this.#loaderService.show();
    const campagne = {
      datas: [
        {
          idCampaign: idCampagne,
        },
      ],
    };
    return this.#httpClient
      .post<{ [key: string]: any; hasError: boolean }>(
        this.#buildUrl(GESTION_CAMPAGNES_ENDPOINTS.enable),
        campagne
      )
      .pipe(
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(
            error,
            'Erreur lors de la réactivation de la campagne'
          );
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  closeCampagne(idCampaign: number) {
    this.#loaderService.show();
    const campagne = {
      datas: [
        {
          idCampaign: idCampaign,
        },
      ],
    };
    return this.#httpClient
      .post<GetCampagnesResponse>(
        this.#buildUrl(GESTION_CAMPAGNES_ENDPOINTS.close),
        campagne
      )
      .pipe(
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(
            error,
            'Erreur lors de la clôture de la campagne'
          );
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  launchCampagne(idCampaign: number) {
    this.#loaderService.show();
    const campagne = {
      datas: [{ idCampaign }],
    };
    return this.#httpClient
      .post(this.#buildUrl(GESTION_CAMPAGNES_ENDPOINTS.launch), campagne)
      .pipe(
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(
            error,
            'Erreur lors du lancement de la campagne'
          );
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  updateUsersList(body: {
    data: {
      idCampaign: number;
      idApplication: number;
      fileName: string;
      content: string;
    };
  }) {
    this.#loaderService.hide();
    return this.#httpClient
      .post(this.#buildUrl(GESTION_CAMPAGNES_ENDPOINTS.update_users_list), body)
      .pipe(
        tap(() => this.#loaderService.hide()),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(
            error,
            'Erreur lors de la mise à jour de la liste des utilisateurs'
          );
        })
      );
  }

  addUsersToCampaignApplication(
    payload: AddOrReplaceUsersToCampaignApplicationPayload
  ) {
    this.#loaderService.show();
    const body = {
      data: {
        ...payload.data,
        action: 'ADD',
      },
    };
    return this.#httpClient
      .post<AddOrReplaceUsersToCampaignApplicationResponse>(
        this.#buildUrl(GESTION_CAMPAGNES_ENDPOINTS.update_users_list),
        body
      )
      .pipe(
        tap(() => this.#loaderService.hide()),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(
            error,
            "Erreur lors de l'ajout des utilisateurs à la campagne"
          );
        })
      );
  }

  replaceUsersToCampaignApplication(
    payload: AddOrReplaceUsersToCampaignApplicationPayload
  ) {
    this.#loaderService.show();
    const body = {
      data: {
        ...payload.data,
        action: 'REPLACE',
      },
    };
    return this.#httpClient
      .post<AddOrReplaceUsersToCampaignApplicationResponse>(
        this.#buildUrl(GESTION_CAMPAGNES_ENDPOINTS.update_users_list),
        body
      )
      .pipe(
        tap(() => this.#loaderService.hide()),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(
            error,
            'Erreur lors du remplacement des utilisateurs de la campagne'
          );
        })
      );
  }

  getFile(idFile: number) {
    this.#loaderService.show();
    const payload: any = {
      data: {
        idFile,
      },
    };

    return this.#httpClient
      .post(this.#buildUrl(GESTION_CAMPAGNES_ENDPOINTS.export_file), payload, {
        responseType: 'blob',
      })
      .pipe(
        tap(() => this.#loaderService.hide()),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        })
      );
  }

  /**
   * Télécharge le fichier Excel de certification d’une plateforme uniquement quand tous les comptes sont certifiés.
   * @param idCampaign L'identifiant de la campagne
   * @param idApplication L'identifiant de l'application/plateforme
   * @returns Observable<{ fileName: string; fileContent: string; mimeType: string; status: string; serviceStatus: any; originalFilePath: string; }>
   */
  downloadCertifiedAccountsFile(campaignId: number, applicationName: string) {
    this.#loaderService.show();
    const payload = {
      user: 36,
      data: {
        campaignId,
        userAccountDepartmentName: '',
        finalCertificationStatusName: '',
        applicationName,
      },
    };
    return this.#httpClient
      .post<DownloadCertifiedAccountsFileResponse>(
        this.#buildUrl('/statistics/certifications/extractionCompteClient'),
        payload
      )
      .pipe(
        tap(() => this.#loaderService.hide()),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(
            error,
            'Erreur lors du téléchargement du fichier de certification (Excel)'
          );
        })
      );
  }
}
