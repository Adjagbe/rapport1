export const GESTION_ACTIONS_ENDPOINTS = {
  get: '/fonctionnalite/getByCriteria',
  create: '/fonctionnalite/createFonctionnalite',
  update: '/fonctionnalite/updateFonctionnalite',
  lock: '/fonctionnalite/lockFonctionnalite',
  unlock: '/fonctionnalite/unlockFonctionnalite',
  generateCode: '/fonctionnalite/generateCode'
};

export const columnsAction = [
    { key: 'libelle', label: 'Libéllé' },
    { key: 'parentLibelle', label: 'Parent' },
    { key: 'code', label: 'Code' },
    { key: 'statut', label: 'Statut' },
    // { key: 'action', label: 'Actions'}
  ]

export const ACTION_FILTER_FORM_OPTIONS = [
  { value: 'libelle', label: 'Libéllé' },
    { value: 'parentLibelle', label: 'Parent' },
    { value: 'code', label: 'Code' },
    { value: 'isLocked', label: 'Statut' },
]

  export const ACTION_TEXTS = {
    NEW_OFFER_FORM: {
      NEW_OFFER_FORM_HEADING: "Enregistrement d'action",
      EDIT_OFFER_FORM_HEADING: "Modification d'action",
      CONTROLERS_HEADING: {
        LIBELLE: 'libéllé',
        ROLE: 'Parent',
        CODE: 'Code',
        STATUT: 'Statut',
      },
      PLACEHOLDERS: {
        LIBELLE: 'Saisissez une action',
        CODE: 'Saisissez un code',
        ROLE: 'Selectionnez une action'
      },
      CANCLE_BTN: 'Annuler',
      SUBMIT_BTN: 'Enregistrer'
    },
  };