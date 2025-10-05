import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class CustomValidatorsUtils {
  /**
   * Valide qu'une saisie ne commence pas par un espace.
   * Ajoute l'erreur { leadingSpace: true } si la première lettre est un espace.
   */
  noLeadingSpace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = (control.value ?? '').toString();
      if (!value) return null;
      return /^\s/.test(value) ? { leadingSpace: true } : null;
    };
  }

  /**
   * Valide qu'une saisie ait une longueur minimale stricte (après trim).
   * Retourne { minLengthStrict: { requiredLength: min, actualLength } } si invalide.
   */
  minLengthStrict(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const raw = (control.value ?? '').toString();
      if (!raw) return null; // la gestion du 'required' est faite ailleurs
      const length = raw.trim().length;
      return length < min
        ? { minLengthStrict: { requiredLength: min, actualLength: length } }
        : null;
    };
  }
}
