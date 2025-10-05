export const GESTION_UTILISATEURS_ENDPOINTS = {
  // login: '/user/login',
  // loginLdap: '/user/loginLdap',
  login:'/user/connexion',
  get: '/user/getByCriteria',
  create: '/user/create-user',
  createUser: '/user/createUser',
  createUserLdap: '/user/createUserLdap',
  updateUser: '/user/updateUser',
  updatePassword: '/user/updatePassword',
  searchUserLdap: '/user/searchUserLdap',
  getDirections: '/directions/getByCriteria',
  getSousDirection: '/sousDirection/getByCriteria',
  getDepartement: '/departments/getByCriteria',
  getService: '/service/getByCriteria',
  getUserProfil: '/userProfil/getByCriteria',
  lockUser: '/user/lockUser',
  unlockUser: '/user/unlockUser',
  resendAccesTemporaire: '/user/resendAccesTemporaire',
  forgetPassword: '/user/forgetPassword',
  verifyOtp: '/user/verifyOtp',
  timeOtp:'/settings/getByCriteria',
  exportUtilisateur:'/user/extractionCompteUtilisateur',
  update: '',
  campaign_details: '/statistics/campaign/certifier-stats', // Endpoint pour récupérer les détails d'une UTILISATEUR (applications liées, etc.)
  get_users_by_campaign_application: '/user-accounts/getByCriteria', // Endpoint pour récupérer les utilisateurs d'une application liée à une UTILISATEUR
};

export const APPLICATIONS_ENDPOINT = {
  get: '/applications/getByCriteria',
};

export const UTILISATEUR_STATUS_FILTERS = [
  { value: 'nom', label: 'Nom' },
  { value: 'prenom', label: 'Prenoms' },
  { value: 'telephone', label: 'Numéro' },
  { value: 'email', label: 'Email' },
  { value: 'fonction', label: 'Fonction' },
  { value: 'createdAt', label: 'Date de creation' },
  { value: 'isLock', label: 'Statut' },
];

export const ACCOUNTS_STATUS = {
  VALID: 'certifié',
  TO_DEACTIVATE: 'certifié',
  PROFILE_CHANGE_NEEDED: 'certifié',
  MOVED_DEPARTMENT: 'certifié',
  PENDING: 'non certifié',
};

export const columnsProfil = [
  { key: 'libelle', label: 'Profil' },
  { key: 'dateDebutProfil', label: 'Date de debut' },
  { key: 'dateFinProfil', label: 'Date de fin' },
];

export const columnsUser = [
  { key: 'login', label: 'Login' },
  { key: 'lastName', label: 'Nom' },
  { key: 'firstName', label: 'Prenoms' },
  { key: 'telephone', label: 'Numéro' },
  { key: 'email', label: 'Email' },
  { key: 'fonction', label: 'Fonction' },
  { key: 'createdAt', label: 'Date de creation' },
  { key: 'isLock', label: 'Statut' },
  // { key: 'action', label: 'Actions'}
];
