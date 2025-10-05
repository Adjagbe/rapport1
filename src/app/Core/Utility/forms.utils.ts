import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormsUtils {
  /**
   * Permet de récupérer un contrôle enfant à partir d'un AbstractControl (FormGroup ou FormArray)
   * @param groupe Le groupe de contrôle parent
   * @returns Une fonction qui prend un chemin (string ou string[]) et retourne le contrôle ou null
   */
  getControl<T extends AbstractControl = AbstractControl>(
    groupe: AbstractControl
  ) {
    return (path: string | (string | number)[]): T | null =>
      groupe.get(path) as T | null;
  }
}
