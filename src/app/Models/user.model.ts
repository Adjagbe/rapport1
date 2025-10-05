export type UsersBusiness = {
    status: {};
    hasError: boolean;
    count: number;
    items: Array<{
      createdAt: string;
      createdBy: number;
      description: string;
      id: number;
      isDeleted: boolean;
      libelle: string;
    }>;
  };
  
  export type User = {
    status: {};
    hasError: boolean;
    count: number;
    items: Array<{
      email: string,
      fonction: string,
      login: string,
      createdAt: string,
      createdBy: number,
      nom: string,
      prenom: string,
      statusUserLibelle: string,
      id: string,
      telephone: string
    }>;
  };
  
  export interface Users {
    lastName: string,
    firstName: string,
    telephone: string,
    email: string,
    fonction: string,
    login: string,
    originHierarchieLibelle: string,
    originHierarchieId: number,
    isLdap: boolean,
    profils: ListProfil
    idUser?: string;
    idDepartment?: number | null  ,
    

  }

  export interface UsersLdap{
    telephone: string,
    fonction: string,
    login: string,
    profils: ListProfil
    originHierarchieLibelle: string,
    originHierarchieId: number,
    idDepartment?: number | null,
   
  }
  
  export interface CreateUserResponse {
    status: Record<string, unknown>; // Objet dont la structure n'est pas précisée
    hasError: boolean;
    items: ApiUser[];
  }
  
  export interface deleteResponse {
    status: Record<string, unknown>; // Objet dont la structure n'est pas précisée
    hasError: boolean;
  }
  
  export interface ApiUser {
      idUser: number;
      lastName: string;
      firstName: string;
      telephone: string;
      email: string;
      fonction: string;
      login: string;
      password: string;
      isActif: boolean;
      isDeleted: boolean;
      isFirstConnection: boolean;
      isLdap: boolean;
      isLock: boolean;
      createdAt: string; // Format : "DD/MM/YYYY"
      createdBy: number;
      originHierarchieId: number;
      originHierarchieLibelle: string;
      originHierarchieDescription: string;
      profils: ListProfil
     
  }
  
  export interface UserResponse {
    status: {};
    hasError: boolean;
    count: number;
    items: Array<{
      idUser: number;
      lastName: string;
      firstName: string;
      telephone: string;
      email: string;
      fonction: string;
      login: string;
      password: string;
      isActif: boolean;
      isDeleted: boolean;
      isFirstConnection: boolean;
      isLdap: boolean;
      isLock: boolean;
      createdAt: string; // Format : "DD/MM/YYYY"
      createdBy: number;
      originHierarchieId: number;
      originHierarchieLibelle: string;
      originHierarchieDescription: string;
      idDepartment?: number | null
      departmentName: string,
      profils: ListProfil

    }>;
  }

  export interface UserLdapResponse {
    status: {};
    hasError: boolean;
    count: number;
    item: Array<{
      email: string,
      fonction: string,
      login: string,
      nom: string,
      prenom: string,
    }>;
  }
  
  export interface PeriodesResponse {
    status: {};
    hasError: boolean;
    count: number;
    itemiis: Array<{
    periode_min: string,
    periode_max: string,
    indicateur_libelle: string,
    frequence: string,
    indicateur_id: number,
    annee: number
    }>;
  }
  
  
  export interface Sous_ServiceResponse {
    status: {};
    hasError: boolean;
    count: number;
    items: Array<{
    libelle: string,
    createdAt: string,
    createdBy: number,
    id: number,
    serviceId: number,
    serviceLibelle: string
    }>;
  }
  export type ListSous_Service = Array<{
    libelle: string,
    createdAt: string,
    createdBy: number,
    id: number,
    serviceId: number,
    serviceLibelle: string
  }>
  
  export interface ApiSous_Service {
    libelle: string,
    createdAt: string,
    createdBy: number,
    id: number,
    serviceId: number,
    serviceLibelle: string
  }
  
  export type ListUser = Array<{
    idUser: number;
      lastName: string;
      firstName: string;
      telephone: string;
      email: string;
      fonction: string;
      login: string;
      password: string;
      isActif: boolean;
      isDeleted: boolean;
      isFirstConnection: boolean;
      isLdap: boolean;
      isLock: boolean;
      createdAt: string; // Format : "DD/MM/YYYY"
      createdBy: number;
      originHierarchieId: number;
      originHierarchieLibelle: string;
      originHierarchieDescription: string;
      profils: ListProfil
      
  }>;
  
  export interface UserPreviewCardModel {
    idUser: number;
    lastName: string;
    firstName: string;
    telephone: string;
    email: string;
    fonction: string;
    login: string;
    password: string;
    isActif: boolean;
    isDeleted: boolean;
    isFirstConnection: boolean;
    isLdap: boolean;
    isLock: boolean;
    createdAt: string; // Format : "DD/MM/YYYY"
    createdBy: number;
    originHierarchieId: number;
    originHierarchieLibelle: string;
    originHierarchieDescription: string;
    profils: ListProfil
  }
  

  export interface ApiUtilisateur {
    idUser: number;
    lastName: string;
    firstName: string;
    telephone: string;
    email: string;
    fonction: string;
    login: string;
    password: string;
    isActif: boolean;
    isDeleted: boolean;
    isFirstConnection: boolean;
    isLdap: boolean;
    isLock: boolean;
    createdAt: string; // Format : "DD/MM/YYYY"
    createdBy: number;
    originHierarchieId: number;
    originHierarchieLibelle: string;
    originHierarchieDescription: string;
    idDepartment?: number | null;
    departmentName: string;
    profils: ListProfil
    
  }

  // Direction

  export interface DirectionResponse {
    status: {};
    hasError: boolean;
    count: number;
    items: Array<{
    libelle: string,
    createdAt: string,
    createdBy: number,
    id: number,
    }>;
  }
  export type ListDirection = Array<{
    libelle: string,
    createdAt: string,
    createdBy: number,
    id: number,
  }>

  // Sous direction

  export interface Sous_DirectionResponse {
    status: {};
    hasError: boolean;
    count: number;
    items: Array<{
    libelle: string,
    createdAt: string,
    createdBy: number,
    id: null,
    directionsId: null
    }>;
  }

  export interface FilterObjectModel {
    dateDemande: string;
    dateRealisation: string;
    typeOffreId: string;
    indicateursDto: string[];
    porteurId: string;
    demandeurId?: string;
    demandeurLibelle?: string;
    statut: string;
  }

  export type ListSous_Direction = Array<{
    libelle: string,
    createdAt: string,
    createdBy: number,
    id: null,
    directionsId: null
  }>

  // Departement

  export interface DepartementResponse {
    status: {};
    hasError: boolean;
    count: number;
    items: Array<{
    libelle: string,
    createdAt: string,
    createdBy: number,
    id: null,
    sousDirectionId: null
    }>;
  }
  export type ListDepartement = Array<{
    libelle: string,
    createdAt: string,
    createdBy: number,
    id: null,
    sousDirectionId: null
  }>

  export interface Departement {
    status: {};
    hasError: boolean;
    count: number;
    items: Array<{
    description: string,
    createdAt: string,
    idDepartment?: number | null,
    isDeleted: boolean
    name:string
    }>;
  }




  // Service

  export interface ServicesResponse {
    status: {};
    hasError: boolean;
    count: number;
    items: Array<{
    libelle: string,
    createdAt: string,
    createdBy: number,
    id: null,
    departementId: null
    }>;
  }
  export type ListService = Array<{
    libelle: string,
    createdAt: string,
    createdBy: number,
    id: null,
    departementId: null
  }>

  export interface UserProfilResponse {
    status: {};
    hasError: boolean;
    count: number;
    items: Array<{
    profilId: number,
    profilCode: string,
    profilLibelle: string,
    dateDebut: string,
    dateFin: string,
    id: number,
    }>;
  }
  export type ListUserProfil = Array<{
    profilId: number,
    profilCode: string,
    profilLibelle: string,
    dateDebut: string,
    dateFin: string,
    id: number,
  }>

  export type ListProfil = Array<{
    id: number,
    libelle: string,
    dateDebutProfil: Date | null,
    dateFinProfil: Date | null,
  }>;
