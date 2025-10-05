
export const GESTION_PROFILS_ENDPOINTS = {
  get: '/profil/getByCriteria',
  create: '/profil/createProfil',
  update: '/profil/updateProfil',
  lock: '/profil/lockProfil',
  unlock: '/profil/unlockProfil',
  generateCode: '/profil/generateCode'
};

// export const APPLICATIONS_ENDPOINT = {
//   get: '/applications/getByCriteria',
// };

export const columnsProfils = [
    { key: 'libelle', label: 'Libéllé' },
    { key: 'fonctionnalites', label: 'Fonctionnalités' },
    { key: 'code', label: 'Code' },
    { key: 'statut', label: 'Statut' },
    // { key: 'action', label: 'Actions'}
]

export const PROFILS_FILTER_FORM_OPTIONS = [
  { value: 'libelle', label: 'Libéllé' },
    // { value: 'fonctionnalites', label: 'Actions' },
    { value: 'code', label: 'Code' },
    { value: 'isLocked', label: 'Statut' },
]