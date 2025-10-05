export const ONLYEXCELFILE =
  '.xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv';
export const ERROR_MSG =
  'Une erreur est survenue lors de la validation du formulaire. Veuillez vérifier tous les champs et réessayer.';

// Colonnes attendues pour les fichiers d'utilisateurs importés dans une campagne
export const EXPECTED_USER_COLUMNS: string[] = [
  'Login',
  'Nom',
  'Prenom',
  'Mail',
  'CUID',
  'Profil',
  'Statut',
  'Direction',
];

export const GESTION_CAMPAGNES_ENDPOINTS = {
  export_file: '/files/exportAccounts',
  get: '/campaign/getByCriteria',
  get_edit_history: '/audit/getByCriteria',
  create: '/campaign/create-with-accounts',
  update: '/campaign/create-with-accounts',
  disable: '/campaign/disable',
  enable: '/campaign/enable',
  close: '/campaign/terminate',
  launch: '/campaign/launch',
  update_users_list: '/campaign/update-with-accounts',
  campaign_details: '/statistics/campaign/certifier-stats', // Endpoint pour récupérer les détails d'une campagne (applications liées, etc.)
  get_users_by_campaign_application: '/user-accounts/getByCriteria', // Endpoint pour récupérer les utilisateurs d'une application liée à une campagne
};

export const APPLICATIONS_ENDPOINT = {
  get: '/applications/getByCriteria',
};

export const CAMPAGNE_STATUS_FILTERS = [
  { label: 'Planifiée', value: 'PLANIFIE' },
  { label: 'Active', value: 'ACTIVE' },
  // { label: 'Finalisée', value: 'FINALISE' },
  { label: 'Terminé', value: 'TERMINATE' },
  { label: 'Désactivée', value: 'DESACTIVE' },
  { label: 'Clôturée', value: 'CLOTURE' },
  { label: 'Tous', value: '' },
];
