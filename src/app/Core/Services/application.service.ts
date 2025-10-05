import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { APPLICATIONS_ENDPOINT } from '../Constants/gestion-campagnes.constant';
import { ApplicationsGetResponse } from 'src/app/Models/applications.model';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  #baseUrl = environment.urlCore;
  #httpClient = inject(HttpClient);
  #loaderService = inject(LoaderService);

  constructor() {}

  #buildUrl(endpoint: string) {
    return `${this.#baseUrl}${endpoint}`;
  }
  #handleError(error: any, message?: string) {
    // Ici tu peux personnaliser le traitement (log, notification, etc.)
    console.error('[ERREUR API APPLICATION] :', error);
    return throwError(() => new Error(message ?? 'Erreur Api Application'));
  }

  getApplications() {
    this.#loaderService.show();
    const body = {
      data: {
        id: '',
        isActive:true
      },
    };

    return this.#httpClient
      .post<ApplicationsGetResponse>(
        this.#buildUrl(APPLICATIONS_ENDPOINT.get),
        body
      )
      .pipe(
        map((response) => {
          if (!response.hasError && response.items.length)
            return response.items;
          else
            throw Error(
              'Erreur survenu pendant la recuperation d une application'
            );
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }
}
