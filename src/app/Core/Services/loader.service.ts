import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private isLoading$ = new BehaviorSubject<boolean>(false);

  /**
   * Observable pour surveiller l'état du loader
   */
  get isLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  /**
   * Active le loader
   */
  show(): void {
    this.isLoading$.next(true);
  }

  /**
   * Désactive le loader
   */
  hide(): void {
    this.isLoading$.next(false);
  }

  /**
   * Retourne l'état actuel du loader (synchronement).
   *
   * @returns {boolean} true si le loader est actif, false sinon.
   *
   * @example
   * // Vérifier si le loader est actif
   * if (loaderService.isCurrentLoading()) {
   *   console.log('Le loader est en cours d\'affichage');
   * }
   *
   * @example
   * // Utilisation dans une condition pour afficher un message
   * const message = loaderService.isCurrentLoading() ? 'Chargement...' : 'Prêt';
   * console.log(message);
   */
  isCurrentLoading(): boolean {
    return this.isLoading$.getValue();
  }

  /**
   * Exécute une fonction avec le loader actif
   * @param operation - La fonction à exécuter
   * @returns Promise avec le résultat de l'opération
   */
  async withLoader<T>(operation: () => Promise<T>): Promise<T> {
    try {
      this.show();
      return await operation();
    } finally {
      this.hide();
    }
  }
}
