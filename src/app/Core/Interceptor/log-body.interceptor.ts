import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';

const logBodyInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Regroupement des logs par requête
  const startedAt =
    typeof performance !== 'undefined' && performance.now
      ? performance.now()
      : Date.now();
  const groupLabel = `🚀 Requête HTTP: ${req.method.toUpperCase()} ${req.url}`;
  console.groupCollapsed(groupLabel);

  // Log du body si il existe
  if (req.body) {
    console.log('📦 Body de la requête:', req.body);
  } else {
    console.log('📦 Body de la requête: Aucun body');
  }

  // Log des headers si nécessaire
  if (req.headers.keys().length > 0) {
    console.log('📋 Headers de la requête:', req.headers);
  }

  // Log de la réponse et gestion des erreurs
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        console.log('✅ Réponse reçue:', {
          status: event.status,
          statusText: event.statusText,
          body: event.body,
          headers: event.headers,
        });
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Log détaillé des erreurs
      if (error instanceof HttpErrorResponse) {
        // Erreur côté serveur (4xx, 5xx)
        if (error.error instanceof ErrorEvent) {
          // Erreur côté client (erreur réseau, CORS, etc.)
          console.error('❌ Erreur côté client:', {
            message: error.error.message,
            type: 'Client Error',
            url: req.url,
            method: req.method,
          });
        } else {
          // Erreur côté serveur
          console.error('❌ Erreur côté serveur:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            url: req.url,
            method: req.method,
            body: error.error,
            headers: error.headers,
          });
        }
      } else {
        // Erreur générique
        console.error('❌ Erreur inconnue:', {
          error: error,
          url: req.url,
          method: req.method,
        });
      }

      // Log spécifique pour les erreurs CORS et réseau
      if (error.status === 0) {
        if (!navigator.onLine) {
          console.error('🌐 Erreur de réseau - Pas de connexion internet');
        } else {
          console.error(
            '🚫 Erreur CORS détectée - La requête a été bloquée par la politique CORS'
          );
        }
      }

      // Log spécifique pour les erreurs de timeout (basé sur le message)
      if (error.message && error.message.includes('timeout')) {
        console.error(
          '⏰ Timeout de la requête - La requête a pris trop de temps'
        );
      }

      // Relancer l'erreur pour que l'application puisse la gérer
      return throwError(() => error);
    }),
    finalize(() => {
      const endedAt =
        typeof performance !== 'undefined' && performance.now
          ? performance.now()
          : Date.now();
      const durationMs = Math.round(endedAt - startedAt);
      console.log(`⏱️ Durée: ${durationMs} ms`);
      console.groupEnd();
    })
  );
};

export default logBodyInterceptor;
