import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoaderService } from '../loader.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { catchError, map, tap, throwError } from 'rxjs';
import { QUESTIONNAIRE_ENDPOINT } from '../../Constants/questionnaire.constant';
import { PLATEFORME_ENDPOINT } from '../../Constants/plateforme.constant';
import { DIRECTION_ENDPOINT } from '../../Constants/direction.constant';

@Injectable({
  providedIn: 'root',
})
export class ParametrageService {
  #http = inject(HttpClient);
  #loaderService = inject(LoaderService);
  #router = inject(Router);
  #baseUrl = environment.urlCore;

  #buildUrl(endpoint: string) {
    return `${this.#baseUrl}${endpoint}`;
  }
  #handleError(error: any, message?: string) {
    // Ici tu peux personnaliser le traitement (log, notification, etc.)
    console.error('[ERREUR API CAMPAGNE] :', error);
    return throwError(() => new Error(message ?? 'Erreur Api'));
  }

  constructor() {}

  //Debut Questionnaire organigrame

  createQuestion(data: any) {
    const body = {
      user: 1,
      datas: [data],
    };
    return this.#http
      .post(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.createQ), body)
      .pipe(
        tap((response: any) =>
          console.log(
            'reponse de creation de nouvelle offre abondance',
            response
          )
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la creation de offre Abondance'
          )
        )
      );
  }

  choiceQuestionType() {
    this.#loaderService.show();
    const body = {
      user: 36,
      data: {},
    };
    return this.#http
      .post<any>(
        this.#buildUrl(QUESTIONNAIRE_ENDPOINT.choiceQuestionType),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError) {
            return reqResponse;
          } else {
            throw new Error(
              "Une erreur s'est produite pendant la récupération du temps OTP"
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

  createResponse(data: any) {
    const body = {
      user: 1,
      datas: [data],
    };
    return this.#http
      .post(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.createR), body)
      .pipe(
        tap((response: any) =>
          console.log(
            'reponse de creation de nouvelle offre abondance',
            response
          )
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la creation de offre Abondance'
          )
        )
      );
  }

  getListQ(
    config: {
      size: string;
      index: string;
      ordre?: string;
      champs?: string;
      id?: string;
    },
    isLocked?: boolean | null,
    filter: {
      [cloumn: string]: string | number[] | number | boolean;
    } | null = null,
    searchQuery: number | null = null
  ) {
    this.#loaderService.show();
    let body: { [key: string]: any } = {
      user: 1,
      isSimpleLoading: false,
      size: config.size,
      index: config.index,
      data: {
        idQuestion: config?.id ?? '',
        orderDirection: config?.ordre ?? '',
        orderField: config?.champs ?? '',
        // isLock: isLocked
      },
    };
    if (searchQuery) {
      body = {
        user: 1,
        isSimpleLoading: false,
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
        isSimpleLoading: false,
        size: config.size,
        index: config.index,
        data: {
          ...body['data'],
          ...filter,
        },
      };
    }
    return this.#http
      .post<any>(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.getQuestion), body)
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError && reqResponse.count !== undefined) {
            const questionData = {
              items: reqResponse.items ?? [],
              count: reqResponse.count ?? 0,
            };
            return questionData;
          } else {
            throw new Error(
              "Une erreur s'est produite pendant la récupération du temps OTP"
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

  getListR(
    config: {
      size: string;
      index: string;
      ordre?: string;
      champs?: string;
      id?: string;
    },
    isLocked?: boolean | null,
    filter: {
      [cloumn: string]: string | number[] | number | boolean;
    } | null = null,
    searchQuery: number | null = null
  ) {
    this.#loaderService.show();
     let body: { [key: string]: any } = {
      user: 1,
      isSimpleLoading: false,
      size: config.size,
      index: config.index,
      data: {
        idQuestion: config?.id ?? '',
        orderDirection: config?.ordre ?? '',
        orderField: config?.champs ?? '',
        // isLock: isLocked
      },
    };
    if (searchQuery) {
      body = {
        user: 1,
        isSimpleLoading: false,
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
        isSimpleLoading: false,
        size: config.size,
        index: config.index,
        data: {
          ...body['data'],
          ...filter,
        },
      };
    }
    return this.#http
      .post<any>(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.getReponse), body)
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError&& reqResponse.count !== undefined) {
            const reponseData = {
              items: reqResponse.items ?? [],
              count: reqResponse.count ?? 0,
            };
            return reponseData;
          } else {
            throw new Error(
              "Une erreur s'est produite pendant la récupération du temps OTP"
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

  getStatusAssignQuestion() {
    this.#loaderService.show();
    const body = {
      user: 36,
      data: {},
    };
    return this.#http
      .post<any>(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.statusAsignQ), body)
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError) {
            return reqResponse;
          } else {
            throw new Error(
              "Une erreur s'est produite pendant la récupération du temps OTP"
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

  getListQuestionnaire() {
    this.#loaderService.show();
    const body = {
      user: 36,
      data: {},
    };
    return this.#http
      .post<any>(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.get), body)
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError) {
            return reqResponse;
          } else {
            throw new Error(
              "Une erreur s'est produite pendant la récupération du temps OTP"
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

  AssignQuestion(data: any) {
    const body = {
      user: 36,
      data: data,
    };
    return this.#http
      .post(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.asignQuestion), body)
      .pipe(
        tap((response: any) =>
          console.log(
            'Reponse de creation de nouvelle offre abondance',
            response
          )
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la creation de offre Abondance'
          )
        )
      );
  }

  getQuestionAssignById(id: any) {
    const body = {
      user: 56,
      data: {
        idQuestion: id,
      },
    };
    return this.#http
      .post<any>(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.getByIdAssignQ), body)
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError) {
            return reqResponse;
          } else {
            throw new Error(
              "Une erreur s'est produite pendant la récupération du temps OTP"
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

  updateAssignQuestion(data: any) {
    const body = {
      user: 36,
      data: data,
    };
    return this.#http
      .post<any>(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.update), body)
      .pipe(
        tap((response) =>
          console.log('Réponse de mise à jour de l’offre abondance', response)
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la mise à jour de l’offre Abondance'
          )
        )
      );
  }

  // organigramme
  DeleteQuestion(id: any) {
    const body = {
      user: 1,
      data: id,
    };

    return this.#http
      .post(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.delete), body)
      .pipe(
        tap((response: any) =>
          console.log(
            'reponse de suppression de nouvelle offre abondance',
            response
          )
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la suppression de offre Abondance'
          )
        )
      );
  }
  DeleteOptionQ(data: any) {
    const body = {
      user: 36,
      data: data,
    };
    return this.#http
      .post(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.deletOption), body)
      .pipe(
        tap((response: any) =>
          console.log(
            'reponse de suppression de nouvelle offre abondance',
            response
          )
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la suppression de offre Abondance'
          )
        )
      );
  }
  // organigramme


  // Gestion question et reponse
  DeleteQuestionG(id : any){
    const body = {
      user: 1,
      datas: [id],
    };

    return this.#http
      .post(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.deleteQ), body)
      .pipe(
        tap((response: any) =>
          console.log(
            'reponse de suppression de nouvelle offre abondance',
            response
          )
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la suppression de offre Abondance'
          )
        )
      );

  }

  updateQuestionG(data: any) {
    const body = {
      user: 1,
      datas: [data],
    };
    return this.#http
      .post(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.updateQ), body)
      .pipe(
        tap((response) =>
          console.log('Réponse de mise à jour de l’offre abondance', response)
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la mise à jour de l’offre Abondance'
          )
        )
      );
  }

  updateReponseG(data: any) {
    const body = {
      user: 1,
      datas: [data],
    };
    return this.#http
      .post(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.updateR), body)
      .pipe(
        tap((response) =>
          console.log('Réponse de mise à jour de l’offre abondance', response)
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la mise à jour de l’offre Abondance'
          )
        )
      );
  }

  DeleteReponseG(id : any){
    const body = {
      user: 1,
      datas: [id],
    };

    return this.#http
      .post(this.#buildUrl(QUESTIONNAIRE_ENDPOINT.deleteR), body)
      .pipe(
        tap((response: any) =>
          console.log(
            'reponse de suppression de nouvelle offre abondance',
            response
          )
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la suppression de offre Abondance'
          )
        )
      );

  }
  // Gestion question et reponse
  

  
  //fin questionnaire organigrame

  // Debut Gestion de la plateforme
  getListPlateforme(
    config: {
      size: string;
      index: string;
      ordre?: string;
      champs?: string;
      id?: string;
    },
    isLocked?: boolean | null,
    filter: {
      [cloumn: string]: string | number[] | number | boolean;
    } | null = null,
    searchQuery: number | null = null
  ) {
    this.#loaderService.show();
    let body: { [key: string]: any } = {
      user: 1,
      isSimpleLoading: false,
      size: config.size,
      index: config.index,
      data: {
        idApplication: config?.id ?? '',
        orderDirection: config?.ordre ?? '',
        orderField: config?.champs ?? '',
        // isLock: isLocked
      },
    };

    if (searchQuery) {
      body = {
        user: 1,
        isSimpleLoading: false,
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
        isSimpleLoading: false,
        size: config.size,
        index: config.index,
        data: {
          ...body['data'],
          ...filter,
        },
      };
    }

    return this.#http
      .post<any>(this.#buildUrl(PLATEFORME_ENDPOINT.get), body)
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError && reqResponse.count !== undefined) {
            const plateformeData = {
              items: reqResponse.items ?? [],
              count: reqResponse.count ?? 0,
            };
            return plateformeData;
          } else {
            throw new Error(
              "Une erreur s'est produite pendant la récupération du temps OTP"
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

  createPlateforme(data: any) {
    const body = {
      user: 1,
      datas: [data],
    };
    return this.#http
      .post(this.#buildUrl(PLATEFORME_ENDPOINT.create), body)
      .pipe(
        tap((response: any) =>
          console.log(
            'reponse de modification de nouvelle offre abondance',
            response
          )
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la modification de offre Abondance'
          )
        )
      );
  }

  updatePlateforme(data: any) {
    const body = {
      user: 1,
      datas: [data],
    };
    return this.#http
      .post(this.#buildUrl(PLATEFORME_ENDPOINT.update), body)
      .pipe(
        tap((response) =>
          console.log('Réponse de mise à jour de l’offre abondance', response)
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la mise à jour de l’offre Abondance'
          )
        )
      );
  }

  DeletePlateforme(id: any) {
    const body = {
      user: 1,
      datas: [id],
    };

    return this.#http
      .post(this.#buildUrl(PLATEFORME_ENDPOINT.delete), body)
      .pipe(
        tap((response: any) =>
          console.log(
            'reponse de suppression de nouvelle offre abondance',
            response
          )
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la suppression de offre Abondance'
          )
        )
      );
  }
  // fin Gestion de la plateforme

  //Debut Gestion de la direction

  getListDirection(
    config: {
      size: string;
      index: string;
      ordre?: string;
      champs?: string;
      id?: string;
    },
    isLocked?: boolean | null,
    filter: {
      [cloumn: string]: string | number[] | number | boolean;
    } | null = null,
    searchQuery: number | null = null
  ) {
    this.#loaderService.show();
    let body: { [key: string]: any } = {
      user: 1,
      isSimpleLoading: false,
      size: config.size,
      index: config.index,
      data: {
        idDepartment: config?.id ?? '',
        orderDirection: config?.ordre ?? '',
        orderField: config?.champs ?? '',
        // isLock: isLocked
      },
    };

    if (searchQuery) {
      body = {
        user: 1,
        isSimpleLoading: false,
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
        isSimpleLoading: false,
        size: config.size,
        index: config.index,
        data: {
          ...body['data'],
          ...filter,
        },
      };
    }

    return this.#http
      .post<any>(this.#buildUrl(DIRECTION_ENDPOINT.get), body)
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError && reqResponse.count !== undefined) {
            const directionData = {
              items: reqResponse.items ?? [],
              count: reqResponse.count ?? 0,
            };
            return directionData;
          } else {
            throw new Error(
              "Une erreur s'est produite pendant la récupération du temps OTP"
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

  DeleteDirection(id: any) {
    const body = {
      user: 1,
      datas: [id],
    };

    return this.#http
      .post(this.#buildUrl(DIRECTION_ENDPOINT.delete), body)
      .pipe(
        tap((response: any) =>
          console.log(
            'reponse de suppression de nouvelle offre abondance',
            response
          )
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la suppression de offre Abondance'
          )
        )
      );
  }

  updateDirection(data: any) {
    const body = {
      user: 1,
      datas: [data],
    };
    return this.#http
      .post(this.#buildUrl(DIRECTION_ENDPOINT.update), body)
      .pipe(
        tap((response) =>
          console.log('Réponse de mise à jour de l’offre abondance', response)
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la mise à jour de l’offre Abondance'
          )
        )
      );
  }

  createDirection(data: any) {
    const body = {
      user: 1,
      datas: [data],
    };
    return this.#http
      .post(this.#buildUrl(DIRECTION_ENDPOINT.create), body)
      .pipe(
        tap((response: any) =>
          console.log(
            'reponse de creation de nouvelle offre abondance',
            response
          )
        ),
        catchError((error) =>
          this.#handleError(
            error,
            'Erreur spécifique lors de la creation de offre Abondance'
          )
        )
      );
  }

  //fin Gestion de la direction
}
