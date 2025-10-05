import {
  EditCampagneHistoryItem,
  EditCampagneHistoryModification,
} from './gestion-campagnes.model';

// Interfaces locales pour gérer les dates converties
export interface EditCampagneHistoryItemWithDates
  extends Omit<EditCampagneHistoryItem, 'createdAt' | 'modifications'> {
  title?: string | null;
  createdAt: string | Date;
  modifications: EditCampagneHistoryModificationWithDates[];
}

export interface EditCampagneHistoryModificationWithDates
  extends Omit<EditCampagneHistoryModification, 'oldValue' | 'newValue'> {
  oldValue?: string | Date;
  newValue?: string | Date;
  heading?: string;
}

export enum AuditLegendeTypeEnum {
  LAUNCH_CAMPAGNE = 'LAUNCH_CAMPAGNE',
  DISABLE_CAMPAGNE = 'DISABLE_CAMPAGNE',
  ENABLE_CAMPAGNE = 'ENABLE_CAMPAGNE',
  CLOSE_CAMPAGNE = 'CLOSE_CAMPAGNE',
  EXTEND_CAMPAGNE = 'EXTEND_CAMPAGNE',
  MODIF_CAMPAGNE = 'MODIF_CAMPAGNE',
  ADD_APP_ACCOUNT_IN_CAMPAGNE = 'ADD_APP_ACCOUNT_IN_CAMPAGNE',
  REPLACE_APP_ACCOUNT_IN_CAMPAGNE = 'REPLACE_APP_ACCOUNT_IN_CAMPAGNE',
}
