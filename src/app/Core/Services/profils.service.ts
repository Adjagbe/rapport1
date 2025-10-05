import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { throwError, map, catchError, tap, BehaviorSubject } from 'rxjs';
import { ApiRole, RoleResponse } from 'src/app/Models/roles.model';
import { environment } from 'src/environments/environment.development';
import { GESTION_PROFILS_ENDPOINTS } from '../Constants/profils.constant';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilsService {
#loaderService = inject(LoaderService);
  #baseUrl = environment.urlCore;
//  #baseUrl = environment.urlCoreAPI;
   #http = inject(HttpClient);
  //  #commonUtils = inject(CommonUtils);
  constructor() { }
  #buildUrl(endpoint: string) {
    return `${this.#baseUrl}${endpoint}`;
  }
  handleError = (
      error: any,
      customMessage?: string,
      transformError?: (error: any) => any
    ) => {
      console.error('Une erreur est survenue:', error);
      if (transformError) {
        error = transformError(error);
      }
  
      const errorMessage = customMessage || 'Une erreur inattendue est survenue';
      return throwError(() => new Error(errorMessage));
    };

  public getByCriteriaRole(
    // config: { size: string; index: string; id?: string }
    config: {
      size: string;
      index: string;
      ordre? : string;
      champs? : string;
      id?: string;
    },
    isLocked?: boolean | null,
    filter: { [cloumn: string]: string| number[]|number; } | null = null,
    searchQuery: number | null = null
  ) {
      // const endpoint = '/profil/getByCriteria';
    this.#loaderService.show();
      let body: { [key: string]: any } = {
      user: 1,
      isSimpleLoading: true,
      size: config.size,
      index: config.index,
      data: {
        id: config?.id ?? '',
        orderDirection: config?.ordre ?? '',
        orderField: config?.champs?? '',
        isLocked: isLocked
      },
    };
    if (searchQuery) {
      body = {
        user: 1,
        isSimpleLoading: true,
        size: config.size,
        index: config.index,
        data: {
          isLocked: isLocked,
          ...body['data'],
          id: String(searchQuery),
        },
      };
    }
    if (filter) {
      
      body = {
        user: 1,
        isSimpleLoading: true,
        size: config.size,
        index: config.index,
        data: {
          ...body['data'],
          ...filter
        },
      };
    }
      return this.#http.post<RoleResponse>(this.#buildUrl(GESTION_PROFILS_ENDPOINTS.get), body).pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError && reqResponse?.items) {
            return {
              items:reqResponse.items.map((action) => ({
              libelle: action.libelle,
              fonctionnalites: action.fonctionnalites,
              statut: action.isActif ? "Actif" : "Inactif",
              isLocked: action.isLocked,
              code: action.code,
              id: action.id,
              filterByDirection: action.filterByDirection
            })),
            count: reqResponse.count,
          };
          } else
            throw Error(
              "Une erreur s'est produite pendant la récupération de la liste des action"
            );
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.handleError(error, 'Erreur spécifique de la liste des action')

        }),
         tap(() => this.#loaderService.hide())
      );
    }

  public createRole(data: any) {
      const body = {
        user: 1,
        data,
      };
      // const endpoint = '/profil/createProfil';
      return this.#http
        .post(
          this.#buildUrl(GESTION_PROFILS_ENDPOINTS.create),
          body
        )
        .pipe(
          tap((response: any) =>
            console.log(
              'reponse de création de nouvelle offre abondance',
              response
            )
          ),
          catchError((error) =>
            this.handleError(
              error,
              'Erreur spécifique lors de la création de offre Abondance'
            )
          )
        );
    }
  
    public updateRole( data: any) { 
      const body = {
        user: 1,
        data
      };
      // const endpoint = `/profil/updateProfil`;
      
      return this.#http
        .post(
          this.#buildUrl(GESTION_PROFILS_ENDPOINTS.update),
          body
        )
        .pipe(
          tap((response) =>
            console.log('Réponse de mise à jour de l’offre abondance', response)
          ),
          catchError((error) =>
            this.handleError(
              error,
              'Erreur spécifique lors de la mise à jour de l’offre Abondance'
            )
          )
        );
  }

  public lockRole(permissionId: number) { 
    const body = {
      user: 1,
      data: {id:permissionId},
    };
    const endpoint = `/profil/lockProfil`;
    
    return this.#http
      .post(
        this.#buildUrl(GESTION_PROFILS_ENDPOINTS.lock),
        body
      )
      .pipe(
        tap((response) =>
          console.log('Réponse de mise à jour de l’offre abondance', response)
        ),
        catchError((error) =>
          this.handleError(
            error,
            'Erreur spécifique lors de la mise à jour de l’offre Abondance'
          )
        )
      );
}

public unlockRole(permissionId: number) { 
  const body = {
    user: 1,
    data: {id:permissionId},
  };
  // const endpoint = `/profil/unlockProfil`;
  
  return this.#http
    .post(
      this.#buildUrl(GESTION_PROFILS_ENDPOINTS.unlock),
      body
    )
    .pipe(
      tap((response) =>
        console.log('Réponse de mise à jour de l’offre abondance', response)
      ),
      catchError((error) =>
        this.handleError(
          error,
          'Erreur spécifique lors de la mise à jour de l’offre Abondance'
        )
      )
    );
}

public generateCodeRole(roleLibelle: string) {
  const endpoint = '/profil/generateCode';
  const body = {
    user: 1,
    data: {
      libelle: roleLibelle
    },
  };
  return this.#http.post(this.#buildUrl(GESTION_PROFILS_ENDPOINTS.generateCode), body).pipe(
    map((reqResponse:any) => {
      if (!reqResponse.hasError) {
        return reqResponse
      } else
        throw Error(
          "Une erreur s'est produite pendant la récupération de la liste des action"
        );
    }),
    catchError((error) =>
      this.handleError(error, 'Erreur spécifique de la liste des action')
    )
  );
}

 private selectedRoleSubject = new BehaviorSubject<ApiRole | null>(null);
  selectedRole$ = this.selectedRoleSubject.asObservable();
 selectRole(role: ApiRole) {
    this.selectedRoleSubject.next(role);
  }


}
