import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
// import { ToastService } from './toast.service';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import type {
  CreateUserModel,
  Fonctionnalite,
  LoginData,
  ResponseCreatUser,
  ServiceResponse,
} from 'src/app/Models/connexion.model';
import { Router } from '@angular/router';
// import { CryptoService } from './crypto.service';
import {
  ApiUtilisateur,
  CreateUserResponse,
  Departement,
  DepartementResponse,
  DirectionResponse,
  ServicesResponse,
  Sous_DirectionResponse,
  UserLdapResponse,
  UserProfilResponse,
  UserResponse,
  Users,
  UsersLdap,
} from 'src/app/Models/user.model';
import { GESTION_UTILISATEURS_ENDPOINTS } from '../Constants/gestion-utilisateurs.constant';
import { LoaderService } from './loader.service';
import { STORAGE_KEYS } from 'src/app/Models/storage-keys.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // #crypto = inject(CryptoService);
  #http = inject(HttpClient);
  // #urlCoreAPI = environment.urlCoreAPI;
  // #toastService = inject(ToastService);
  #loaderService = inject(LoaderService);
  login = new BehaviorSubject('');
  login$ = this.login.asObservable();
  savedLogin = localStorage.getItem('LOGIN_OTP');
  #currentLogin = '';
  #router = inject(Router);

  #baseUrl = environment.urlCore;
  constructor() {}
  #buildUrl(endpoint: string) {
    return `${this.#baseUrl}${endpoint}`;
  }
  #handleError(error: any, message?: string) {
    // Ici tu peux personnaliser le traitement (log, notification, etc.)
    console.error('[ERREUR API CAMPAGNE] :', error);
    return throwError(() => new Error(message ?? 'Erreur Api'));
  }

  /** Connexion utilisateur */
  connexion(data: LoginData) {
    this.#loaderService.show();
    // const body = {
    //   serviceLibelle: 'Connexion à la plateforme',
    //   data: dataLoginForm,
    //   isConnexionWs: true,
    // };

    const body = {
      serviceLibelle: 'Connexion à la plateforme',
      data,
    };

    return this.#http
      .post<ServiceResponse>(
        // this.#buildUrl(
        //   isLdap
        //     ? GESTION_UTILISATEURS_ENDPOINTS.loginLdap
        //     : GESTION_UTILISATEURS_ENDPOINTS.login
        // ),
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.login),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError && reqResponse?.item) {
            // console.log("RESPONSE:",reqResponse)
            if (reqResponse?.item?.isFirstConnection == true) {
              // this.#toastService.mixin(reqResponse.status.message, 'error');

              localStorage.setItem('LOGIN', data.login);
              this.login.next(data.login);
              this.#currentLogin = data.login;
              this.#router.navigateByUrl('/authentication/reset-password');
              this.#loaderService.hide();
              return reqResponse?.item?.isFirstConnection;
            } else {
              // Stocker les informations de l'utilisateur (localStorage)
              Swal.fire({
                toast: true,
                icon: 'success',
                title: 'Connexion réussie',
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });

              this.setUser(reqResponse);
              this.#loaderService.hide();
              return reqResponse?.item; // Retourne les infos de l'utilisateur connecté
            }
          } else if (reqResponse.status.code == '936') {
            // this.#toastService.mixin(reqResponse.status.message, 'error');
            this.login.next(data.login);
            this.#currentLogin = data.login;
            this.#loaderService.hide();
            // this.#router.navigate(['/authentification', 'reset-password']);
            return reqResponse.status.code;
          } else {
            // this.#toastService.mixin(reqResponse.status.message, 'error');
            this.#loaderService.hide();
            return reqResponse;
            throw new Error("Une erreur s'est produite pendant la connexion");
          }
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  user?: ServiceResponse;

  setUser(user: ServiceResponse) {
    this.user = user;
    localStorage.setItem(
      STORAGE_KEYS.USER_INFO,
      // this.#crypto.encrypted(
      JSON.stringify(this.user)
      // )
    );
  }

  clearUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  }

  // getUser(): ServiceResponse | null {
  //   const user = JSON.parse(
  //     // this.#crypto.decrypted(
  //     localStorage.getItem(STORAGE_KEYS.USER_INFO) ?? '{}'
  //     // )
  //   );
  //   const notEmpty = Object.keys(user).length > 0;
  //   return user && notEmpty ? user : null;
  // }

  /**
   * @description Récupère les données utilisateur depuis le localStorage
   * @example
   * const user = this.usersService.getUser();
   * if (user) {
   *   console.log(user) // {id: 36, login: 'admin', nom: 'Admin', prenom: 'Admin', email: 'admin@admin.com', ...}
   * } else {
   *   console.log('Aucun utilisateur trouvé') //null;
   * }
   * @returns ServiceResponse | null
   */
  getUser(): ServiceResponse | null {
    try {
      const userDataString = localStorage.getItem(STORAGE_KEYS.USER_INFO);

      if (!userDataString?.trim()) {
        return null;
      }

      const userData = JSON.parse(userDataString);

      if (!this.isValidUserData(userData)) {
        return null;
      }

      return userData;
    } catch (error) {
      console.warn(
        'Erreur lors de la récupération des données utilisateur:',
        error
      );
      this.clearCorruptedUserData();
      return null;
    }
  }

  /**
   * @description Vérifie si les données utilisateur sont valides
   * @example
   * const isValid = this.usersService.isValidUserData(user);
   * if (isValid) {
   *   console.log('Les données sont valides') //true;
   * } else {
   *   console.log('Les données sont invalides') //false;
   * }
   * @param data Les données utilisateur à vérifier
   * @returns true si les données sont valides, false sinon
   */
  private isValidUserData(data: any): data is ServiceResponse {
    return (
      data &&
      typeof data === 'object' &&
      !Array.isArray(data) &&
      Object.keys(data).length > 0
    );
  }

  /**
   * @description Nettoie les données utilisateur corrompues
   * @example
   * this.usersService.clearCorruptedUserData();
   * console.log('Les données utilisateur ont été nettoyées dans localStorage');
   */
  private clearCorruptedUserData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    } catch (error) {
      console.error('Impossible de nettoyer les données corrompues:', error);
    }
  }

  logout() {
    //@abdoulaye-dev: " j'ai rajouter un toast de confirmation avant de deconnecter l'utilisateur "
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, me déconnecter',
      cancelButtonText: 'Annuler',
      customClass: {
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
        popup: 'swal-custom-popup',
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      this.user = undefined;
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
      this.#router.navigate(['/authentication']);
    });
    return;
  }

  createUser(dataCreatUserForm: CreateUserModel) {
    // const endpoint = "/user/createUser"
    const body = {
      serviceLibelle: "Création d'un nouvel utilisateur à la plateforme",
      data: dataCreatUserForm,
    };
    return this.#http
      .post<ResponseCreatUser>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.create),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError) {
            Swal.fire({
              toast: true,
              icon: 'success',
              title: reqResponse.status.message,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            // this.#toastService.showSuccess(reqResponse.status.message); // Retourne le message de succes
          } else {
            Swal.fire({
              toast: true,
              icon: 'error',
              title: reqResponse.status.message,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            // this.#toastService.mixin(reqResponse.status.message, 'error');
            throw new Error(
              "Une erreur s'est produite pendant la création du user"
            );
          }
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  timeOtp() {
    this.#loaderService.show();
    const body = {
      data: {
        key: 'TIME_OTP_PASSWORD_OUBLIER_FRONT',
      },
      user: 36,
    };
    return this.#http
      .post<any>(this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.timeOtp), body)
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError) {
            return reqResponse;
          } else {
            throw new Error(
              "Une erreur s'est produite pendant la récupération du temps OTP"
            );
          }
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  forgetPassword(dataForgetPassword: { login: string }) {
    this.#loaderService.show();
    const body = {
      serviceLibelle: "réinitialisation du mot de passe de l'utisateur",
      data: dataForgetPassword,
    };
    return this.#http
      .post<ResponseCreatUser>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.forgetPassword),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError) {
            // this.#toastService.showSuccess(`Un code OTP de récupération vous a été envoyé par sms`); // Retourne le message de succes
            this.login.next(dataForgetPassword.login);
            this.#currentLogin = dataForgetPassword.login;
            this.#loaderService.hide();
            return reqResponse;
          } else {
            // Swal.fire({
            //   toast: true,
            //   icon: 'error',
            //   title: reqResponse.status.message,
            //   position: 'top-end',
            //   showConfirmButton: false,
            //   timer: 3000,
            //   timerProgressBar: true,
            // });
            this.#loaderService.hide();
            // this.#toastService.mixin(reqResponse.status.message, 'error');
            return reqResponse;
            throw new Error(
              "Une erreur s'est produite pendant la reinitialisation du password"
            );
          }
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }
  //   forgetPassword(dataForgetPassword : {login : string}){
  //     // const endpoint = "/user/forgetPassword";
  //     const body = {
  //       serviceLibelle : "réinitialisation du mot de passe de l'utisateur",
  //       data : dataForgetPassword
  //     }
  //     return this.#http.post<ResponseCreatUser>(`${this.#urlCoreAPI}${endpoint}`, body)
  //     .pipe(map((reqResponse) => {
  //       if (!reqResponse.hasError) {
  //         this.#toastService.showSuccess(`Un code OTP de récupération vous a été envoyé par sms`); // Retourne le message de succes
  //         this.login.next(dataForgetPassword.login)
  //         this.#currentLogin = dataForgetPassword.login

  //       } else {
  //         this.#toastService.mixin(reqResponse.status.message, 'error');
  //         throw new Error("Une erreur s'est produite pendant la reinitialisation du password");
  //       }
  //     }),
  //     catchError((error) =>
  //       this.handleError(error, 'Erreur spécifique de réinitialisation du password')
  //     )
  //   );

  //   }

  verifyOtp(confirmOtp: { otp: string }) {
    this.#loaderService.show();
    // const endpoint = "/user/verifyOtp";
    if (this.savedLogin) {
      this.#currentLogin = this.savedLogin;
      console.log(
        'Login récupéré depuis le localStorage :',
        this.#currentLogin
      );
    } else {
      // this.handleError('Aucun login trouvé dans le localStorage.');
    }
    const body = {
      // serviceLibelle:
      //   'Service de vérification du code otp lors de parcours de mot de passe oublié',
      data: { ...confirmOtp },
      user: 36,
    };
    return this.#http
      .post<ResponseCreatUser>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.verifyOtp),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError) {
            Swal.fire({
              toast: true,
              icon: 'success',
              title: 'Code OTP vérifié avec succès !',
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.#loaderService.hide();
            return reqResponse;
            // this.#toastService.showSuccess(`Code OTP vérifié avec succès !`); // Retourne le message de succes
          } else {
            // Swal.fire({
            //   toast: true,
            //   icon: 'error',
            //   title: reqResponse.status.message,
            //   position: 'top-end',
            //   showConfirmButton: false,
            //   timer: 3000,
            //   timerProgressBar: true,
            // });
            this.#loaderService.hide();
            return reqResponse;
            // this.#toastService.mixin(reqResponse.status.message, 'error');
            throw new Error(
              "Une erreur s'est produite pendant la vérification du code otp"
            );
          }
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  updatePassword(updatePasswordData: {
    passwordUpdate: string;
    passwordUpdateConfirm: string;
    login?: string;
  }) {
    this.#loaderService.show();
    let body: {};
    if (updatePasswordData?.login) {
      body = {
        serviceLibelle: 'Service de modification de mot de passe',
        data: updatePasswordData,
      };
    } else {
      body = {
        serviceLibelle: 'Service de modification de mot de passe',
        data: { ...updatePasswordData, login: this.#currentLogin },
      };
    }

    console.log(
      'Body de update de mot de passe +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-',
      body
    );

    return this.#http
      .post<ResponseCreatUser>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.updatePassword),
        body
      )
      .pipe(
        map((reqResponse: any) => {
          if (!reqResponse.hasError) {
            Swal.fire({
              toast: true,
              icon: 'success',
              title: reqResponse.status.message,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.#loaderService.hide();
            // this.#toastService.mixin(reqResponse.status.message, 'success'); // Retourne le message de succes
            return reqResponse;
          } else {
            // Swal.fire({
            //   toast: true,
            //   icon: 'error',
            //   title: reqResponse.status.message,
            //   position: 'top-end',
            //   showConfirmButton: false,
            //   timer: 3000,
            //   timerProgressBar: true,
            // });
            this.#loaderService.hide();
            // this.#toastService.mixin(reqResponse.status.message, 'error');
            return reqResponse;
            throw new Error(
              "Une erreur s'est produite pendant la modificaton du mot de passe"
            );
          }
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  //   getUserPermission() {

  //   }

  getMenusActionsUser(): any {
    return this.getUser()?.item?.fonctionnalites
      ? this.getUser()?.item?.fonctionnalites[0].fonctionnalitesEnfant
      : null;
  }

  getActionUser(parentCode: string, enfant1Code?: string): any {
    console.log('TEST');
    const user = this.getUser()?.item;
    if (!user) return null;

    const fonctionnalites = user.fonctionnalites?.[0]?.fonctionnalitesEnfant;
    if (!fonctionnalites) return null;

    const parent = fonctionnalites.find((f) => f.code === parentCode);
    if (!parent?.fonctionnalitesEnfant) return null;

    let enfant1: any;
    enfant1 = parent.fonctionnalitesEnfant.find((f) => f.code === enfant1Code);
    if (enfant1Code) {
      return enfant1?.fonctionnalitesEnfant ?? null;
    }

    return parent.fonctionnalitesEnfant;
  }

  private selectedUtilisateurSubject =
    new BehaviorSubject<ApiUtilisateur | null>(null);
  selectedUtilisateur$ = this.selectedUtilisateurSubject.asObservable();

  selectUtilisateur(indicateur: ApiUtilisateur) {
    this.selectedUtilisateurSubject.next(indicateur);
  }

  getSelectedUtilisateur() {
    return this.selectedUtilisateurSubject.value;
  }

  public createUtilisateur(userRequest: Users) {
    this.#loaderService.show();
    const body = {
      user: 1,
      data: { ...userRequest },
    };
    // // const endpoint = '/user/createUser';

    // console.log('create de offre : ', body);
    return this.#http
      .post<CreateUserResponse>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.createUser),
        body
      )
      .pipe(
        tap((response) =>
          console.log(
            'reponse de création de nouvelle offre abondance',
            response
          )
        ),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  public createUtilisateurLdap(userRequest: UsersLdap) {
    this.#loaderService.show();
    const body = {
      user: 1,
      data: { ...userRequest },
    };
    // // const endpoint = '/user/createUserLdap';

    // console.log('create de offre : ', body);
    return this.#http
      .post<CreateUserResponse>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.createUserLdap),
        body
      )
      .pipe(
        tap((response) => console.log('reponse de nouvel user ldap', response)),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  public updateUtilisateur(userRequest: Users) {
    this.#loaderService.show();
    const body = {
      user: 1,
      data: userRequest,
    };
    // // const endpoint = `/user/updateUser`;

    return this.#http
      .post<CreateUserResponse>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.updateUser),
        body
      )
      .pipe(
        tap((response) =>
          console.log('Reponse de mise à jour de l’offre abondance', response)
        ),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  getExportutilisateur(filter?:any) {
    this.#loaderService.show();
    const body = {
      data: {
        idUser: '',
        login: '',
        lastName: '',
        firstName: '',
        dateDerniereConnexion: '',
        ...(filter || {})
      },
      user: 36,
    };
    return this.#http
      .post<any>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.exportUtilisateur),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError) {
            return reqResponse;
          } else {
            throw new Error(
              "Une erreur s'est produite pendant la récupération du temps OTP"
            );
          }
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  public getListUtilisateur(
    config: {
      size: string;
      index: string;
      ordre?: string;
      champs?: string;
      id?: string;
    },
    isLocked?: boolean | null,
    filter: {
      [cloumn: string]: string | number[] | number | boolean;
    } | null = null,
    searchQuery: number | null = null
  ) {
    this.#loaderService.show();
    let body: { [key: string]: any } = {
      user: 1,
      isSimpleLoading: false,
      size: config.size,
      index: config.index,
      data: {
        idUser: config?.id ?? '',
        orderDirection: config?.ordre ?? '',
        orderField: config?.champs ?? '',
        // isLock: isLocked
      },
    };
    if (searchQuery) {
      body = {
        user: 1,
        isSimpleLoading: false,
        size: config.size,
        index: config.index,
        data: {
          isLocked: isLocked,
          ...body['data'],
          id: String(searchQuery),
        },
      };
    }
    if (filter) {
      body = {
        user: 1,
        isSimpleLoading: false,
        size: config.size,
        index: config.index,
        data: {
          ...body['data'],
          ...filter,
        },
      };
    }
    console.log('index befor the get User request', body['index']);

    return this.#http
      .post<UserResponse>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.get),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError && reqResponse.count !== undefined) {
            const utilisateur = {
              items: reqResponse.items ?? [],
              count: reqResponse.count,
            };
            return utilisateur;
          } else {
            throw Error(
              'Erreur spécifique au niveau de la récupération de la liste des utilisateurs'
            );
          }
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  searchUserLdap(ldap: string) {
    // const endpoint = '/user/searchUserLdap';
    const body = {
      user: 1,
      data: {
        login: ldap,
      },
    };
    return this.#http
      .post<UserLdapResponse>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.searchUserLdap),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError && reqResponse?.item) {
            return reqResponse;
          } else
            throw Error(
              "Une erreur s'est produite pendant la récupération de la liste des offres business"
            );
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  getDirections(id?: number | null) {
    // // const endpoint = '/directions/getByCriteria';
    const body = {
      user: 1,
      isSimpleLoading: false,
      data: {
        idDepartment: '',
        // orderDirection: 'ASC',
        // orderField: 'libelle'
      },
    };
    return this.#http
      .post<DirectionResponse>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.getDepartement),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError && reqResponse?.items) {
            const direction = {
              items: reqResponse.items.map((direction) => ({
                ...direction,
              })),
            };
            return direction;
          } else
            throw Error(
              "Une erreur s'est produite pendant la récupération de la liste des offres business"
            );
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  getDepart() {
    const body = {
      user: 36,
      isSimpleLoading: false,
      data: {
        idDepartment: '',
        isActive:true,
        // orderDirection: 'ASC',
        // orderField: 'libelle'
      },
    };
    return this.#http
      .post<Departement>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.getDepartement),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError && reqResponse?.items) {
            const direction = {
              status: reqResponse.status,
              count: reqResponse.count,
              hasError: reqResponse.hasError,
              items: reqResponse.items.map((direction) => ({
                ...direction,
              })),
            };
            return direction;
          } else
            throw Error(
              "Une erreur s'est produite pendant la récupération de la liste des offres business"
            );
        }),

        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  getSousDirection(id?: number | null, directionsId?: number | null) {
    // // const endpoint = '/sousDirection/getByCriteria';
    const body = {
      user: 1,
      isSimpleLoading: false,
      data: {
        id: id,
        directionsId: directionsId,
        orderDirection: 'ASC',
        orderField: 'libelle',
      },
    };
    return this.#http
      .post<Sous_DirectionResponse>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.getSousDirection),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError && reqResponse?.items) {
            const sous_direction = {
              items: reqResponse.items.map((sous_direction) => ({
                ...sous_direction,
              })),
            };
            return sous_direction;
          } else
            throw Error(
              "Une erreur s'est produite pendant la récupération de la liste des offres business"
            );
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  getDepartement(id?: number | null, sousDirectionId?: number | null) {
    // // const endpoint = '/departement/getByCriteria';
    const body = {
      user: 1,
      isSimpleLoading: false,
      data: {
        idDepartment: id,
        sousDirectionId: sousDirectionId,
        orderDirection: 'ASC',
        orderField: 'libelle',
      },
    };
    return this.#http
      .post<DepartementResponse>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.getDepartement),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError && reqResponse?.items) {
            const departement = {
              items: reqResponse.items.map((departement) => ({
                ...departement,
              })),
            };
            return departement;
          } else
            throw Error(
              "Une erreur s'est produite pendant la récupération de la liste des offres business"
            );
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }
  getService(id?: number | null, departementId?: number | null) {
    // const endpoint = '/service/getByCriteria';
    const body = {
      user: 1,
      isSimpleLoading: false,
      data: {
        id: id,
        departementId: departementId,
        orderDirection: 'ASC',
        orderField: 'libelle',
      },
    };
    return this.#http
      .post<ServicesResponse>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.getService),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError && reqResponse?.items) {
            const service = {
              items: reqResponse.items.map((service) => ({
                ...service,
              })),
            };
            return service;
          } else
            throw Error(
              "Une erreur s'est produite pendant la récupération de la liste des offres business"
            );
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  getUserProfil(id: number) {
    // const endpoint = '/userProfil/getByCriteria';
    const body = {
      user: 1,
      isSimpleLoading: false,
      data: {
        userId: id,
      },
    };
    return this.#http
      .post<UserProfilResponse>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.getUserProfil),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError && reqResponse?.items) {
            const userProfil = {
              items: reqResponse.items.map((userProfil) => ({
                ...userProfil,
              })),
            };
            return userProfil;
          } else
            throw Error(
              "Une erreur s'est produite pendant la récupération de la liste des profils"
            );
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  public lockUtilisateur(permissionId: number, motif: string) {
    const body = {
      user: 1,
      data: {
        idUser: permissionId,
        motifDesactivation: motif,
      },
    };
    // // const endpoint = `/user/lockUser`;
    this.#loaderService.show();
    return this.#http
      .post<ResponseCreatUser>(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.lockUser),
        body
      )
      .pipe(
        map((reqResponse) => {
          if (!reqResponse.hasError) {
            tap((response) =>
              console.log('reponse de requete de lockuser', response)
            ),
              tap(() => this.#loaderService.hide());
          } else {
            Swal.fire({
              toast: true,
              icon: 'error',
              title: reqResponse.status.message,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.#loaderService.hide();
          }
        }),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  public unlockUtilisateur(permissionId: number) {
    const body = {
      user: 1,
      data: { idUser: permissionId },
    };
    // // const endpoint = `/user/unlockUser`;
    this.#loaderService.show();
    return this.#http
      .post(this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.unlockUser), body)
      .pipe(
        tap((response) =>
          console.log('Réponse de requete de unlockuser', response)
        ),
        tap(() => this.#loaderService.hide()),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }

  public resendAccesUtilisateur(login: string) {
    const body = {
      user: 1,
      data: {
        login: login,
      },
    };
    // const endpoint = `/user/resendAccesTemporaire`;

    return this.#http
      .post(
        this.#buildUrl(GESTION_UTILISATEURS_ENDPOINTS.resendAccesTemporaire),
        body
      )
      .pipe(
        tap((response) =>
          console.log('Réponse de mise à jour de l’offre abondance', response)
        ),
        catchError((error) => {
          this.#loaderService.hide();
          return this.#handleError(error);
        }),
        tap(() => this.#loaderService.hide())
      );
  }
}
