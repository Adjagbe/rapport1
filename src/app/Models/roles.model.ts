export interface RoleResponse {
    status: {};
    hasError: boolean;
    count: number;
    items: Array<{
      code: string;
      id: number;
      libelle: string;
      fonctionnalites: any;
      statusProfilLibelle: string;
      isActif: boolean;
      isLocked: boolean;
      filterByDirection : boolean
    }>
}

export interface ApiRole {
    id: number;
    fonctionnalites: any;
    libelle: string;
    statut: string;
    code: string;
}

export interface RolePreviewCardModel {
    id: number;
    fonctionnalites: any;
    libelle: string;
    statut: string;
    code: string;
  }

export type ListRole = Array<{
    id: number;
    libelle: string;
    statut: string;
    code: string;
}>