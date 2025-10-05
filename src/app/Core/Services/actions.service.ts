import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { throwError, map, catchError, tap, BehaviorSubject } from 'rxjs';
import { ActionResponse, ApiAction } from 'src/app/Models/actions.model';
import { environment } from 'src/environments/environment.development';
import { GESTION_ACTIONS_ENDPOINTS } from '../Constants/action.constant';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
   #baseUrl = environment.urlCoreFonctionnalite;
   #http = inject(HttpClient);
   #loaderService = inject(LoaderService);
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

  public getByCriteriaAction
  // (config : {size: string, index: string, id?: string},isLocked?: boolean) 
  (config: {
      size: string;
      index: string;
      ordre? : string;
      champs? : string;
      id?: string;
    },
    isLocked?: boolean | null,
    filter: { [cloumn: string]: string| number[]|number; } | null = null,
    searchQuery: number | null = null
  ) 
  {
    this.#loaderService.show()
    
      // const endpoint = '/fonctionnalite/getByCriteria';
      // const body = {
      //   user: 1,
      //   isSimpleLoading: true,
      //   size: config.size,
      //   index: config.index,
      //   data: {
      //     id: config.id,
      //     isLocked: isLocked
      //   },
      // };
      let body: { [key: string]: any } = {
      user: 1,
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
        size: config.size,
        index: config.index,
        data: {
          ...body['data'],
          ...filter
        },
      };
    }
      return this.#http.post<ActionResponse>(this.#buildUrl(GESTION_ACTIONS_ENDPOINTS.get), body).pipe(
        map((reqResponse:any) => {
          if (!reqResponse.hasError && reqResponse?.items) {
            return { items: reqResponse.items.map((action:any) => ({
              libelle: action.libelle,
              isLocked: action.isLocked,
              statut: action.isActif ? "Actif" : "Inactif",
              parentId: action.parentId,
              parentLibelle: action.parentLibelle,
              code: action.code,
              id: action.id,
            })),
            count: reqResponse.count};
          } else
            throw Error(
              "Une erreur s'est produite pendant la récupération de la liste des action"
            );
        }),
        catchError((error) => {
          this.#loaderService.hide()
          return this.handleError(error, 'Erreur spécifique de la liste des action')
        }
          
        ),
        tap(() => this.#loaderService.hide())
      );
    }

    public getByCriteriaActionNoHierarchy(id:string) {
      // const endpoint = '/fonctionnalite/getByCriteria';
      const body = {
        user: 1,
        hierarchyFormat: false,
        data: {
          id: id,
          idParam: {
              operator: "!="
        }
    }
      };
      return this.#http.post<ActionResponse>(this.#buildUrl(GESTION_ACTIONS_ENDPOINTS.get), body).pipe(
        map((reqResponse:any) => {
          if (!reqResponse.hasError && reqResponse?.items) {
            return reqResponse.items.map((action:any) => ({
              libelle: action.libelle,
              statut: action.statusFonctionnaliteLibelle,
              code: action.code,
              id: action.id,
            }));
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


    public getByCriteriaActionHierarchy() {
      // const endpoint = '/fonctionnalite/getByCriteria';
      const body = {
        user: 1,
        hierarchyFormat: true,
        data: {
          isLocked: false,
    }
      };
      return this.#http.post<ActionResponse>(this.#buildUrl(GESTION_ACTIONS_ENDPOINTS.get), body).pipe(
        map((reqResponse:any) => {
          if (!reqResponse.hasError && reqResponse?.items) {
            return reqResponse.items.map((action:any) => ({
              libelle: action.libelle,
              statut: action.statusFonctionnaliteLibelle,
              fonctionnalitesEnfant: action.fonctionnalitesEnfant,
              code: action.code,
              id: action.id,
            }));
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

  public createAction(data: any) {
      const body = {
        user: 1,
        data,
      };
      // const endpoint = '/fonctionnalite/createFonctionnalite';
      return this.#http
        .post(
          this.#buildUrl(GESTION_ACTIONS_ENDPOINTS.create),
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
  
    public updateAction( data: any) { 
      const body = {
        user: 1,
        data,
      };
      // const endpoint = `/fonctionnalite/updateFonctionnalite`;
      
      return this.#http
        .post(
          this.#buildUrl(GESTION_ACTIONS_ENDPOINTS.update),
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

  public lockAction(actionId: number) { 
    const body = {
      user: 1,
      data: {id:actionId},
    };
    // const endpoint = `/fonctionnalite/lockFonctionnalite`;
    
    return this.#http
      .post(
        this.#buildUrl(GESTION_ACTIONS_ENDPOINTS.lock),
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

public unlockAction(actionId: number) { 
  const body = {
    user: 1,
    data: {id:actionId},
  };
  // const endpoint = `/fonctionnalite/unlockFonctionnalite`;
  
  return this.#http
    .post(
      this.#buildUrl(GESTION_ACTIONS_ENDPOINTS.unlock),
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

public generateCodeAction(actionLibelle: string) {
  // const endpoint = '/fonctionnalite/generateCode';
  const body = {
    user: 1,
    data: {
      libelle: actionLibelle
    },
  };
  return this.#http.post(this.#buildUrl(GESTION_ACTIONS_ENDPOINTS.generateCode), body).pipe(
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

 private selectedActionSubject = new BehaviorSubject<ApiAction | null>(null);
  selectedPermission$ = this.selectedActionSubject.asObservable();
 selectAction(action: ApiAction) {
    this.selectedActionSubject.next(action);
  }

}
