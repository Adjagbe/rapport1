import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoaderService } from '../loader.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { GLOBAL_CONSTANT } from '../../Constants/common.constant';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  
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

  reloadAllow(login: string) {
    this.#loaderService.show();
    const body = {
      data: {
        login: login,
      },
    };
    return this.#http
      .post<any>(this.#buildUrl(GLOBAL_CONSTANT.reloadAllow), body)
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError) {
            this.#loaderService.hide();
            return reqResponse;
          } else {
            throw new Error(
              "Une erreur s'est produite pendant l'actualisateion"
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
}
