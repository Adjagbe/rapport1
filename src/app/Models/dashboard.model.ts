export interface ProgressTrackerData {
  id: number;
  status: 'active' | 'Clôturer' | 'Terminé';
  title?: string;
  dates?: string;
  progression?: number;
  certifiedUsers?: number;
  totalUsers?: number;
}

export type GetCampagnesGlobalStatsResponse = {
  status: Record<string, any>;
  hasError: boolean;
  item: {
    totalActiveCampaigns: number;
    totalScheduledCampaigns: number;
    totalDeactivatedCampaigns: number;
    totalEndedCampaigns: number;
    totalClosedCampaigns: number;
    totalCampaigns: number;
  };
};

export type GetCampagneDetailsResponse = {
  status: Record<string, any>;
  hasError: boolean;
  item: {
    totalAccounts: number;
    certifiedAccounts: number;
    notCertifiedAccounts: number;
    toDeactivateAccounts: number;
    mobilityAccounts: number;
    profileChangeNeededAccounts: number;
    certificationRate: number;
    responseRateByDepartment: Record<string, number>;
    responseRateByApplication: Record<string, number>;
    advancementRate: number;
    statusByApplication: Record<
      string,
      {
        total: number;
        certified: number;
        pending: number;
      }
    >;
    statusByDepartment: Record<
      string,
      {
        total: number;
        certified: number;
        pending: number;
      }
    >;
    totalApplications: number;
    ihaveNotIdea: number;
    totalDepartments: number;
    detailedDepartmentApplicationStatus: Record<
      string,
      Record<
        string,
        {
          'Comptes à investiguer': number;
          'Comptes Légitimes': number;
          Total: number;
        }
      >
    >;
  };
};

export type EvolutionDataEntry = {
  groupName: string;
  totalAccounts: number;
  certifiedAccounts: number;
  pendingAccounts: number;
  certificationRate: number;
};

export type GetEvolutionCertificationResponse = {
  status: Record<string, any>;
  hasError: boolean;
  item: {
    campaignId: number;
    groupBy: string;
    granularity: string;
    evolutionData: Record<string, EvolutionDataEntry[]>;
  };
};

export type ExportAccountStatus =
  | 'TO_DEACTIVATE'
  | 'PROFILE_CHANGE_NEEDED'
  | 'MOVED_DEPARTMENT'
  | 'PENDING';

// Types pour graphiques et barres de progression
export interface ChartData {
  name?: string;
  data: number[] | { name: string; y: number }[];
  color?: string;
  categories?: string[];
  showInLegend?: boolean;
}

export interface ChartConfig {
  title?: string;
  subtitle?: string;
  xAxis?: {
    categories?: string[];
    title?: string;
  };
  yAxis?: {
    title?: string;
    min?: number;
    max?: number;
  };
  colors?: string[];
  legend?: {
    enabled?: boolean;
    layout?: 'horizontal' | 'vertical';
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
  };
}

export interface ProgressItem {
  label: string;
  value: number; // pourcentage 0-100
  color?: string;
}

// ici
