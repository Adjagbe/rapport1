export const AUTH_TEXT = {
  LOGIN_FORM: {
    FORM_HEADING: 'Connexion',
    PLACHOLDERS: {
      LOGIN_PLACEHOLDER: 'Entrez le login',
      PASS_PLACHOLDER: '****************',
    },
    LABELS: {
      LOGIN_LABEL: 'Login',
      PASS_LABEL: 'mot de passe',
    },
    COMMON: {
      LDAP_HEADING: 'Login LDAP',
      PASS_FORGET: 'Mot de passe oublié ?',
      BTN_SUBMIT: 'Se connecter',
    },
  },

  REGISTER_FORM: {
    FORM_HEADING: 'Demande d’inscription',
    PLACHOLDERS: {
      LOGIN_PLACEHOLDER: 'Entrez le login',
      NAME_PLACHOLDER: 'Entrez votre nom',
      SURNAME_PLACHOLDER: 'Entrez vos prénoms',
      NUMBER_PLACEHOLDER: 'Entrez votre numéro',
      EMAIL_PLACEHOLDER: 'Entrez votre e-mail',
      SEARCH_LDAP_PLACEHOLDER: 'Rechercher un login',
    },
    LABELS: {
      LOGIN_LABEL: 'Login',
      SURNAME_LABEL: 'Nom',
      NAME_LABEL : 'Prénoms' ,
      NUMBER_LABEL: 'Numéro',
      EMAIL_LABEL: 'Email',
    },
    COMMON: {
      LDAP_HEADING: 'Login LDAP',
      BTN_SUBMIT: 'S’inscrire',
    },
  },

  FORGOT_PASSWORD_FORM: {
    FORM_HEADING: 'Réinitialisation du Mot de Passe',
    FORM_HEADING_SPAN:
      'Entrer votre login pour procéder à la réinitialisation',
    PLACHOLDER: {
      EMAIL_PLACEHOLDER: 'Entrez votre login',
    },
    LABELS: {
      EMAIL_LABEL: 'Login',
    },
    COMMON: {
      BTN_SECONDARY: 'Annuler',
      BTN_PRIMARY: 'Se connecter',
      BTN_SUIVANT: 'Valider'
    },
  },
  CONFIRM_OTP_FORM:{
    FORM_HEADING: 'Vérification',
    FORM_HEADING_SPAN:
      'Nous avons envoyé un code à votre numéro de téléphone. Veuillez le saisir ci-dessous.',
    PLACHOLDER: {
      OTP_PLACEHOLDER: 'code OTP',
    },
    LABELS: {
      OTP_LABEL: 'Code OTP',
    },
    COMMON: {
      BTN_SECONDARY: 'Annuler',
      BTN_PRIMARY: 'Suivant',
    },
  },
  RESET_PASSWORD : {
    FORM_HEADING: "Création d'un nouveau mot de passe",
    PLACHOLDERS: {
      PASS_PLACHOLDER: '****************',
    },
    LABELS: {
      LOGIN_LABEL: 'Login',
      PASS_LABEL: 'Nouveau mot de passe',
      CONF_PASS_LABEL: 'Confirmer le mot de passe',
    },
    COMMON: {
      BTN_SECONDARY: 'Annuler',
      BTN_SUBMIT: 'Enregistrer',
    },
  }
};
