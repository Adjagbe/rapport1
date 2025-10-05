export const CERTIFICATION_STATUS_FILTERS = [
  // { label: 'Planifiée', value: 'PLANIFIE' },
  { label: 'Active', value: 'ACTIVE' },
  // { label: 'Terminé', value: 'TERMINATE' },
  // { label: 'Désactivée', value: 'DESACTIVE' },
  // { label: 'Clôturée', value: 'CLOTURE' },
  // { label: 'Tous', value: '' },
];

export const CERTIFICATION_QUESTION_TYPE = {
  LISTE: 'select',
  TEXT_INPUT: 'input',
  BOOLEAN: 'boolean',
};

export const CERTIFICATION_ENDPOINTS = {
  GET_QUESTIONS: '/questions/options',
  GET_QUESTIONS_FLOW: '/questionflow/getByCriteria',
  SEND_CERTIFICATION: '/certifications/certifyAccount',
  GET_CERTIFICATION_DETAILS: '/statistics/certifications/details',
};
