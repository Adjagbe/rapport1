import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ObserverConfig } from 'src/app/Models/common.model';
import * as XLSX from 'xlsx';
import {
  ParsedExcelFile,
  Base64File,
  ExcelData,
} from 'src/app/Models/common.model';
import {
  addDays,
  subDays,
  differenceInDays,
  isBefore,
  isAfter,
  format as formatDateFns,
  parse as parseDateFns,
} from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class CommonUtils {
  #toggleNavbar$ = new BehaviorSubject<boolean>(false);

  widthListener(
    config: ObserverConfig,
    callback: (entries: ResizeObserverEntry[], config: ObserverConfig) => any
  ) {
    const { el } = config;
    if (!el) {
      console.warn('widthListener: el est undefined');
      return;
    }
    const ro = new ResizeObserver((entries) => callback(entries, config));
    ro.observe(el);
    return ro;
  }

  /**
   * Lit un fichier Excel (xlsx, xls, csv) et retourne son contenu sous forme d'objet JS typé.
   *
   * @param file - Le fichier Excel à parser (File issu d'un input type="file")
   * @returns Promise<ParsedExcelFile> - Un objet contenant le nom du fichier et un tableau d'objets représentant les lignes du fichier Excel.
   *
   * @example
   * const parsed = await commonUtils.parseExcelFile(file);
   * console.log(parsed.data); // Affiche les lignes du fichier Excel sous forme de tableau d'objets
   */
  async parseExcelFile(file: File): Promise<ParsedExcelFile> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json: ExcelData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    return {
      name: file.name,
      data: json,
    };
  }

  /**
   * Vérifie qu'un fichier Excel contient au moins une ligne de données (hors en-têtes).
   * Retourne true si le fichier est vide (aucune ligne de données), false sinon.
   */
  async isExcelFileEmpty(file: File): Promise<boolean> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    return rows.length === 0;
  }

  /**
   * Lit uniquement les en-têtes (première ligne) d'un fichier Excel.
   */
  async readExcelHeaders(file: File): Promise<string[]> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const headers: string[] = [];
    const range = XLSX.utils.decode_range(worksheet['!ref'] as string);
    const firstRow = range.s.r; // start row index
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: firstRow, c: C });
      const cell = worksheet[cellAddress];
      const header = cell ? String(cell.v).trim() : '';
      headers.push(header);
    }
    return headers;
  }

  /**
   * Compare deux listes de colonnes, en tolérant la casse, les espaces et les équivalences.
   * Retourne {valid: boolean, missing: string[], extra: string[]}
   */
  compareColumns(
    expected: string[],
    received: string[]
  ): { valid: boolean; missing: string[]; extra: string[] } {
    // Définition des équivalences entre colonnes
    const columnEquivalences: { [key: string]: string[] } = {
      direction: ['département', 'departement'],
      profils: ['profil'],
      adresse: ['mail', 'email', 'adresse email'],
    };

    const normalize = (s: string) => s.trim().toLowerCase();

    const normalizedExpected = expected.map(normalize);
    const normalizedReceived = received.map(normalize);

    // Créer un set étendu avec les équivalences
    const extendedExpectedSet = new Set(normalizedExpected);
    normalizedExpected.forEach((expectedCol) => {
      if (columnEquivalences[expectedCol]) {
        columnEquivalences[expectedCol].forEach((equiv) => {
          extendedExpectedSet.add(equiv);
        });
      }
    });

    const receivedSet = new Set(normalizedReceived);

    const missing: string[] = [];
    expected.forEach((e) => {
      const normalized = normalize(e);
      const hasDirectMatch = receivedSet.has(normalized);
      const hasEquivalentMatch =
        columnEquivalences[normalized]?.some((equiv) =>
          receivedSet.has(equiv)
        ) || false;

      if (!hasDirectMatch && !hasEquivalentMatch) {
        missing.push(e);
      }
    });

    const extra: string[] = [];
    received.forEach((r) => {
      const normalized = normalize(r);
      const isExpected = extendedExpectedSet.has(normalized);
      if (!isExpected) {
        extra.push(r);
      }
    });

    return { valid: missing.length === 0, missing, extra };
  }

  /**
   * Convertit un fichier en base64 (dataURL), utile pour l'envoi au backend ou l'affichage d'un aperçu.
   *
   * @param file - Le fichier à convertir (File issu d'un input type="file")
   * @returns Promise<Base64File> - Un objet contenant le nom, le type MIME et la chaîne base64 du fichier.
   *
   * @example
   * const base64 = await commonUtils.fileToBase64(file);
   * console.log(base64.base64); // Affiche la chaîne base64 du fichier
   */
  async fileToBase64(file: File): Promise<Base64File> {
    return new Promise<Base64File>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // On enlève le préfixe "data:...;base64,"
        const base64 = result.split(',')[1] ?? '';
        resolve({
          name: this.sanitizeFileName(file.name),
          base64,
          type: file.type,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  sanitizeFileName(fileName: string): string {
    // Remplace les espaces par des underscores et enlève les caractères spéciaux sauf . et _
    return fileName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
  }

  /**
   * Convertit une chaîne de caractères en nombre.
   * @param value La chaîne à convertir
   * @returns Le nombre ou NaN si la conversion échoue
   */
  toNumber(value: string): number {
    return Number(value);
  }

  /**
   * Convertit un nombre en chaîne de caractères.
   * @param value Le nombre à convertir
   * @returns La chaîne correspondante
   */
  toStringNumber(value: number): string {
    return value.toString();
  }

  /**
   * Formate une date en string selon un format donné (utilise date-fns)
   * @param date La date à formater (Date ou string ou number)
   * @param formatStr Le format souhaité (ex: 'dd/MM/yyyy')
   * @returns La date formatée en string
   */
  formatDate(
    date: Date | string | number,
    formatStr: string = 'dd/MM/yyyy'
  ): string {
    // Import dynamique pour éviter d'alourdir le bundle si non utilisé
    // (à adapter selon la config, sinon importer en haut du fichier)
    // @ts-ignore
    const { format } = require('date-fns');
    return format(new Date(date), formatStr);
  }

  /**
   * Ajoute un nombre de jours à une date.
   * @param date La date de départ (Date | string | number)
   * @param nbJours Nombre de jours à ajouter
   * @returns La nouvelle date
   */
  additionnerJours(date: Date | string | number, nbJours: number): Date {
    return addDays(new Date(date), nbJours);
  }

  /**
   * Soustrait un nombre de jours à une date.
   * @param date La date de départ (Date | string | number)
   * @param nbJours Nombre de jours à soustraire
   * @returns La nouvelle date
   */
  soustraireJours(date: Date | string | number, nbJours: number): Date {
    return subDays(new Date(date), nbJours);
  }

  /**
   * Calcule la différence en jours entre deux dates.
   * @param date1 Première date (Date | string | number)
   * @param date2 Deuxième date (Date | string | number)
   * @returns Nombre de jours entre date1 et date2
   */
  differenceEnJours(
    date1: Date | string | number,
    date2: Date | string | number
  ): number {
    return differenceInDays(new Date(date1), new Date(date2));
  }

  /**
   * Vérifie si date1 est avant date2.
   * @param date1 Première date (Date | string | number)
   * @param date2 Deuxième date (Date | string | number)
   * @returns true si date1 < date2
   */
  estAvant(
    date1: Date | string | number,
    date2: Date | string | number
  ): boolean {
    return isBefore(new Date(date1), new Date(date2));
  }

  /**
   * Vérifie si date1 est après date2.
   * @param date1 Première date (Date | string | number)
   * @param date2 Deuxième date (Date | string | number)
   * @returns true si date1 > date2
   */
  estApres(
    date1: Date | string | number,
    date2: Date | string | number
  ): boolean {
    return isAfter(new Date(date1), new Date(date2));
  }

  /**
   * Formate une date selon un format donné (utilise date-fns)
   * @param date La date à formater (Date | string | number)
   * @param formatStr Le format souhaité (ex: 'dd/MM/yyyy')
   * @returns La date formatée en string
   */
  formaterDate(
    date: Date | string | number,
    formatStr: string = 'dd/MM/yyyy'
  ): string {
    return formatDateFns(new Date(date), formatStr);
  }

  /**
   * Parse une chaîne en objet Date selon un format donné (utilise date-fns)
   * @param str La chaîne à parser
   * @param formatStr Le format de la chaîne (ex: 'dd/MM/yyyy')
   * @returns L'objet Date correspondant
   */
  parseDate(str: string, formatStr: string = 'dd/MM/yyyy'): Date {
    return parseDateFns(str, formatStr, new Date());
  }

  /**
   * Formate une date en format compatible avec input type="date" (yyyy-MM-dd)
   * @param date La date à formater (Date | string | number)
   * @returns La date formatée en string au format yyyy-MM-dd
   */
  formatDateForInput(date: Date | string | number): string {
    return formatDateFns(new Date(date), 'yyyy-MM-dd');
  }

  /**
   * Formate une date en format supporté par le backend (dd/MM/yyyy)
   * @param date La date à formater (Date | string | number)
   * @returns La date formatée en string au format dd/MM/yyyy
   */
  formatDateForBackend(date: Date | string | number): string {
    return formatDateFns(new Date(date), 'dd/MM/yyyy');
  }

  /**
   * Retourne les dates par défaut pour les campagnes (aujourd'hui)
   * @returns Objet avec startDate et estimatedEndDate formatées pour input type="date"
   */
  getDefaultCampagneDates() {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    // Format yyyy-MM-dd pour input type="date"
    const toInputDate = (d: Date) => d.toISOString().split('T')[0];

    return {
      start: toInputDate(start),
      end: toInputDate(end),
    };
  }

  get navBarValue() {
    return this.#toggleNavbar$.getValue();
  }

  get toggleNavBar$() {
    return this.#toggleNavbar$.asObservable();
  }

  setToggleNavBar(value: boolean) {
    this.#toggleNavbar$.next(value);
  }

  createValidator = (regex: RegExp) => {
    return (text: string) => {
      return regex.test(text);
    };
  };

  base64ToBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data); // decode base64
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
}
