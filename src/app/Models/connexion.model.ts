type Status = {
  code: string;
  message: string;
}
export interface ServiceResponse {
    status: Status;
    hasError: boolean;
    sessionUser: string;
    item: User;
  }
  
  export interface User {
    email: string;
    fonction: string;
    fonctionnalites: Fonctionnalite[];
    idUser: number;
    login: string;
    nom: string;
    prenom: string;
    isLdap: boolean;
    statusUserLibelle: string;
    telephone: string;
    isFirstConnection: boolean;
  }
  
  export interface Fonctionnalite {
    code: string;
    id: number;
    libelle: string;
    parentId: number;
    statusFonctionnaliteLibelle: string;
    fonctionnalitesEnfant: Array<Fonctionnalite>
  }

  export interface LoginData {
    isLdap? : boolean;
    login: string;
    password: string;
  }

export interface CreateUserModel {
  data: {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    fonction?: string;
    login: string;
    originHierarchieLibelle?: string;
    originHierarchieId?: string;
    isLdap: boolean;
    profils?: Profil[];
  };
}

export interface Profil {
  id: string;
  dateDebutProfil: string; 
  dateFinProfilx: string;
}

export interface ResponseCreatUser {
  status : Status;
  hasError: boolean;
}