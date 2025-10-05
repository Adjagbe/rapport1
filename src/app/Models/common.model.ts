export type Application = {
  nom: string;
  utilisateurs: number;
  fichiers: number;
  dernierImport: string;
};

export type Campagne = {
  id: number;
  nom: string;
  statut: string;
  applications: Application[];
  periode: {
    debut: string;
    fin: string;
  };
  dateCreation: string;
  modifiable: boolean;
  supprimable: boolean;
};

export type CampagneList = Campagne[];

export type ObserverConfig = {
  el: HTMLElement;
  classList: string[];
  breakpoint: number;
};

// Types pour la gestion des fichiers Excel et base64
export type ExcelRow = { [key: string]: string | number | boolean | null };
export type ExcelData = ExcelRow[];

export interface ParsedExcelFile {
  name: string;
  data: ExcelData;
}

export interface Base64File {
  name: string;
  base64: string;
  type: string;
}
