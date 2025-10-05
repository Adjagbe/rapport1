export interface DepartementApiResponse {
  status: any;
  hasError: boolean;
  item: Departement[];
}

export interface Departement {
  description: string | null;
  idDepartment: number;
  isActive: boolean;
  isDeleted: boolean;
  name: string | null;
}
