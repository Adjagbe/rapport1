export interface ApplicationItem {
  description: string;
  idApplication: number;
  isDeleted: boolean;
  isSoxCritical: boolean;
  name: string;
}

export interface ApplicationsGetResponse {
  status: Record<string, unknown>;
  hasError: boolean;
  count: number;
  items: ApplicationItem[];
}
