import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import { environment } from 'src/environments/environment.development';
import { catchError, map, tap, throwError, Subject } from 'rxjs';
import { CERTIFICATION_ENDPOINTS } from '../Constants/certification.constant';
import {
  CertificationDetailsApiResponse,
  QuestionApiResponse,
  QuestionFlowApiResponse,
} from 'src/app/Models/certification.model';

@Injectable({
  providedIn: 'root',
})
export class CertificationService {
  #httpClient = inject(HttpClient);
  #loaderService = inject(LoaderService);
  #baseUrl = environment.urlCore;

  certificationSuccess$ = new Subject<void>();

  #buildUrl(endpoint: string) {
    return `${this.#baseUrl}${endpoint}`;
  }
  #handleError(error: any, message?: string) {
    // Ici tu peux personnaliser le traitement (log, notification, etc.)
    console.error('[ERREUR API CERTIFICATION] :', error);
    return throwError(() => new Error(message ?? 'Erreur Api'));
  }

  getQuestions() {
    return this.#httpClient
      .post<QuestionApiResponse>(
        this.#buildUrl(CERTIFICATION_ENDPOINTS.GET_QUESTIONS),
        { data: { id: '' } }
      )
      .pipe(
        map((response) => {
          if (!response.hasError) {
            return response.items;
          }
          return [];
        }),
        catchError((error) => this.#handleError(error))
      );
  }

  getQuestionsFlow() {
    return this.#httpClient
      .post<QuestionFlowApiResponse>(
        this.#buildUrl(CERTIFICATION_ENDPOINTS.GET_QUESTIONS_FLOW),
        { data: { id: '' } }
      )
      .pipe(
        map((response) => {
          if (!response.hasError) {
            return response.items;
          }
          return [];
        }),
        catchError((error) => this.#handleError(error))
      );
  }

  sendCertification(payload: any) {
    this.#loaderService.show();
    return this.#httpClient
      .post<any>(
        this.#buildUrl(CERTIFICATION_ENDPOINTS.SEND_CERTIFICATION),
        payload
      )
      .pipe(
        map((response) => {
          if (!response.hasError) {
            return response;
          }
          // Lève une erreur pour déclencher le bloc error du subscribe
          throw new Error(
            response.message || 'Erreur lors de la certification'
          );
        }),
        tap(() => {
          this.#loaderService.hide();
          console.log('response: ', Response);
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        })
      );
  }

  getCertificationDetails(idCamppaignApplicationUseraccount: string) {
    this.#loaderService.show();
    const payload = {
      data: {
        idCamppaignApplicationUseraccount,
      },
    };
    return this.#httpClient
      .post<CertificationDetailsApiResponse>(
        this.#buildUrl(CERTIFICATION_ENDPOINTS.GET_CERTIFICATION_DETAILS),
        payload
      )
      .pipe(
        map((response) => {
          if (!response.hasError) {
            return response.item;
          }
          return null;
        }),
        catchError((error) => this.#handleError(error)),
        tap(() => this.#loaderService.hide())
      );
  }
}
