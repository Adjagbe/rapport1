import { CertificationIconComponent } from '../icons/certification-icon.component';
import { DashboradIconComponent } from '../icons/dashborad-icon.component';
import { GuardIconComponent } from '../icons/guard-icon.component';
import { SettingIconComponent } from '../icons/setting-icon.component';
import { SoundIconComponent } from '../icons/sound-icon.component';

export const MAIN_NAVIGATION_MENU = [
  {
    route: '/dashboard',
    label: 'Dashboard',
    icon: DashboradIconComponent,
    code: 'dashb',
  },
  {
    route: '/gestion-campagnes',
    label: 'Gestion des campagnes',
    icon: SoundIconComponent,
    code: 'GESTION_DES_CAMPAGNES',
  },
  {
    route: '/certifications',
    label: 'Certification',
    icon: CertificationIconComponent,
    code: 'CERTIFICATION',
  },
  {
    route: '/administration',
    label: 'Administration',
    icon: GuardIconComponent,
    code: 'ADMINISTRATION',
  },
  {
    route: '/parametrage',
    label: 'Paramétrage',
    icon: SettingIconComponent,
    code: 'PARAMETRAGE',
  },
];

export const CAMPAGNES = [
  {
    id: 1,
    nom: 'Certification Q1 2025',
    statut: 'Active',
    applications: [
      {
        nom: 'Reversement marchand',
        utilisateurs: 218,
        fichiers: 1,
        dernierImport: '20/06/2025',
      },
      {
        nom: 'Work auto/bâtiment',
        utilisateurs: 350,
        fichiers: 3,
        dernierImport: '15/07/2025',
      },
      {
        nom: 'Pcam',
        utilisateurs: 218,
        fichiers: 1,
        dernierImport: '20/06/2025',
      },
      {
        nom: 'DigiGpt',
        utilisateurs: 350,
        fichiers: 3,
        dernierImport: '15/07/2025',
      },
    ],
    periode: {
      debut: '19/02/2025',
      fin: '04/06/2025',
    },
    dateCreation: '2025-02-19',
    modifiable: true,
    supprimable: true,
  },
  {
    id: 2,
    nom: 'Audit Sécurité Juin',
    statut: 'Active',
    applications: [
      {
        nom: 'Orange Tracking',
        utilisateurs: 350,
        fichiers: 3,
        dernierImport: '15/07/2025',
      },
      {
        nom: 'Reporting Workflow',
        utilisateurs: 350,
        fichiers: 3,
        dernierImport: '15/07/2025',
      },
    ],
    periode: {
      debut: '10/06/2025',
      fin: '15/09/2025',
    },
    dateCreation: '2025-06-10',
    modifiable: true,
    supprimable: true,
  },
];

export const USER_PROFIL = {
  DIRECTEUR: 'DIRECTEUR',
  EXPLOITANT: 'EXPLOITANT',
  CERTIFICATEUR: 'CERTIFICATEUR',
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
};

export const GLOBAL_CONSTANT = {
  reloadAllow :'/user/infoConnexionParLogin'
}

export const warningSVG = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 16C11.2833 16 11.521 15.904 11.713 15.712C11.905 15.52 12.0007 15.2827 12 15C11.9993 14.7173 11.9033 14.48 11.712 14.288C11.5207 14.096 11.2833 14 11 14C10.7167 14 10.4793 14.096 10.288 14.288C10.0967 14.48 10.0007 14.7173 10 15C9.99933 15.2827 10.0953 15.5203 10.288 15.713C10.4807 15.9057 10.718 16.0013 11 16ZM11 12C11.2833 12 11.521 11.904 11.713 11.712C11.905 11.52 12.0007 11.2827 12 11V7C12 6.71667 11.904 6.47933 11.712 6.288C11.52 6.09667 11.2827 6.00067 11 6C10.7173 5.99933 10.48 6.09533 10.288 6.288C10.096 6.48067 10 6.718 10 7V11C10 11.2833 10.096 11.521 10.288 11.713C10.48 11.905 10.7173 12.0007 11 12ZM7.65 19H5C4.45 19 3.97933 18.8043 3.588 18.413C3.19667 18.0217 3.00067 17.5507 3 17V14.35L1.075 12.4C0.891667 12.2 0.75 11.9793 0.65 11.738C0.55 11.4967 0.5 11.2507 0.5 11C0.5 10.7493 0.55 10.5037 0.65 10.263C0.75 10.0223 0.891667 9.80133 1.075 9.6L3 7.65V5C3 4.45 3.196 3.97933 3.588 3.588C3.98 3.19667 4.45067 3.00067 5 3H7.65L9.6 1.075C9.8 0.891667 10.021 0.75 10.263 0.65C10.505 0.55 10.7507 0.5 11 0.5C11.2493 0.5 11.4953 0.55 11.738 0.65C11.9807 0.75 12.2013 0.891667 12.4 1.075L14.35 3H17C17.55 3 18.021 3.196 18.413 3.588C18.805 3.98 19.0007 4.45067 19 5V7.65L20.925 9.6C21.1083 9.8 21.25 10.021 21.35 10.263C21.45 10.505 21.5 10.7507 21.5 11C21.5 11.2493 21.45 11.4953 21.35 11.738C21.25 11.9807 21.1083 12.2013 20.925 12.4L19 14.35V17C19 17.55 18.8043 18.021 18.413 18.413C18.0217 18.805 17.5507 19.0007 17 19H14.35L12.4 20.925C12.2 21.1083 11.9793 21.25 11.738 21.35C11.4967 21.45 11.2507 21.5 11 21.5C10.7493 21.5 10.5037 21.45 10.263 21.35C10.0223 21.25 9.80133 21.1083 9.6 20.925L7.65 19ZM8.5 17L11 19.5L13.5 17H17V13.5L19.5 11L17 8.5V5H13.5L11 2.5L8.5 5H5V8.5L2.5 11L5 13.5V17H8.5Z" fill="#FAB900"/>
</svg>`;
