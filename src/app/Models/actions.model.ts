export interface ActionResponse {
    status: {};
    hasError: boolean;
    count: number;
    items: Array<{
      code: string;
      id: number;
      libelle: string;
      parentId: number;
      statusProfilLibelle: string;
    }>
}

export interface ApiAction {
    id: number;
    libelle: string;
    statut: string;
    parentId?: number;
    parentLibelle: string;
    code: string;
}

export interface ActionPreviewCardModel {
    id: number;
    libelle: string;
    statut: string;
    parentId?: number;
    parentLibelle: string;
    code: string;
  }

export type ListAction = Array<{
    id: number;
    action: string;
    statut: string;
    parentId?: number;
    code: string;
}>