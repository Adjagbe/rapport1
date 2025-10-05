export interface ApplicationApiResponse {
  status: any;
  hasError: boolean;
  item: Application[];
}

export interface Application {
  description: string | null;
  idApplication: number;
  isActive: boolean;
  isDeleted: boolean;
  name: string | null;
}
