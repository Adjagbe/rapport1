export interface Campagnes {
  createdAt?: string; // optionnel car parfois absent
  estimatedEndDate: string;
  idCampaign: number;
  isDeleted: boolean;
  name: string;
  campaignName?: string;
  startDate: string;
  status: string;
  userFirstName: string;
  userLastName: string;
  // Propriétés manquantes ajoutées
  certifiedAccounts: number;
  notCertifiedAccounts: number;
  progressionRate: number;
  totalAccounts: number;
  updatedAt: string;
  userLogin: string;
}

export interface GetCampagnesResponse {
  status: { [key: string]: any };
  hasError: boolean;
  count: number;
  items: Campagnes[];
}

export enum CAMPAGNES_STATUS_ENUM {
  PLANIFIE = 'PLANIFIE',
  EN_COURS = 'ACTIVE',
  CLOTURE = 'CLOTURE',
  DESACTIVE = 'DESACTIVE',
  TERMINATE = 'TERMINATE',
}

export type CampagneModelForm = {
  data: {
    name: string;
    startDate: string;
    estimatedEndDate: string;
    infos: Array<{ idApplication: number; fileName: string; content: string }>;
  };
};

export type CampagneModelUpdateForm = {
  data: {
    idCampaign: number;
    name: string;
    startDate: string;
    estimatedEndDate: string;
    infos: Array<{ idApplication: number; fileName: string; content: string }>;
  };
};

// Interfaces pour les détails d'une campagne
export interface ApplicationDetail {
  applicationId: number;
  applicationName: string;
  totalAccountsInApp: number;
  certifiedAccountsInApp: number;
  uncertifiedAccountsInApp: number;
  totalFilesForApp: number;
  lastFileImportDate: string;
  files?: Array<{
    id: number;
    fileName: string;
    fileUrl: string;
    importDate: string;
  }>;
}

export type AppFiles = {
  id: number;
  fileName: string;
  fileUrl: string;
  importDate: string;
};

export interface CampagneDetails {
  campaignId: number;
  campaignName: string;
  totalAccounts: number;
  certifiedAccounts: number;
  uncertifiedAccounts: number;
  certifiedApplications: string[];
  uncertifiedApplications: string[];
  totalCertifiedApplications: number;
  totalUncertifiedApplications: number;
  applicationDetails: ApplicationDetail[];
}

export interface GetCampagneDetailsResponse {
  status: { [key: string]: any };
  hasError: boolean;
  item: CampagneDetails;
}

// Utilisateur d'une campagne/application
export interface CampaignApplicationUser {
  accountStatusImported: string;
  campaignName: string;
  createdAt: string;
  cuid: string;
  departmentName: string;
  idCampaignApplicationUseraccount: number;
  email: string;
  firstName: string;
  idCampaign: number;
  idDepartment: number;
  idFile: number;
  idUserAccount: number;
  isDeleted: boolean;
  lastName: string;
  login: string;
  profileName: string;
  finalCertificationStatus: string;
}

export interface GetCampaignApplicationUsersResponse {
  status: { [key: string]: any };
  hasError: boolean;
  count: number;
  items: CampaignApplicationUser[];
}

// Typage pour l'ajout/remplacement d'utilisateurs dans une application de campagne
export type CampaignApplicationUsersAction = 'REPLACE' | 'ADD';

export interface AddOrReplaceUsersToCampaignApplicationPayload {
  data: {
    action: CampaignApplicationUsersAction;
    idCampaign: number;
    idApplication: number;
    fileName: string;
    content: string;
  };
}

export interface AddOrReplaceUsersToCampaignApplicationResponse {
  status: { [key: string]: any };
  hasError: boolean;
  item: {
    createdAt: string;
    estimatedEndDate: string;
    idCampaign: number;
    isDeleted: boolean;
    name: string;
    startDate: string;
    status: string;
    updatedAt: string;
  };
}

export type EditCampagneHistoryApiResponse = {
  status: { [key: string]: any };
  hasError: boolean;
  count: number;
  items: EditCampagneHistoryItem[];
};

export interface EditCampagneHistoryItem {
  actionDate: string;
  auditActionType: string;
  campaignName: string;
  createdAt: string;
  department: string;
  userDepartment: string;
  description: string;
  idAudit: number;
  idCampaign: number;
  isDeleted: boolean;
  legendeType?: string;
  applicationName?: string;
  idApplication?: number;
  modifications: EditCampagneHistoryModification[];
  userFirstName: string;
  userLastName: string;
  userLogin: string;
}

export interface EditCampagneHistoryModification {
  idAuditModification: number;
  isDeleted: boolean;
  modifType?: string;
  modifValue?: string;
  newValue?: string;
  oldValue?: string;
  modifLable?: string;
}

export enum AuditModifTypeEnum {
  END_DATE = 'END_DATE',
  START_DATE = 'START_DATE',
  ADD_ACCOUNT = 'ADD_ACCOUNT',
  REPLACE_ACCOUNT = 'REPLACE_ACCOUNT',
  DEPARTMENT = 'DEPARTMENT',
  NAME = 'NAME',
  DELETE_APP = 'DELETE_APP',
}

export interface DownloadCertifiedAccountsFileResponse {
  fileName: string;
  fileContent: string; // base64
  mimeType: string;
  status: string;
  serviceStatus: {
    code: string;
    message: string;
  };
  originalFilePath: string;
}
