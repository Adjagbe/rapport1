 const _base = 'http://accountcertification.adm.plateforme.ci';
//const _base = `${location.origin}/api-v2`;

 //const _base = 'http://192.168.1.110:8080'
  //const _base = 'https://192.168.1.164:8080'

export const environment = {
  production: false,
  urlCore: `${_base}/accountcertification/api`,
   //urlCore: `${_base}/api`,
  urlCoreFonctionnalite: `${_base}/accountcertification`,
  //urlCoreFonctionnalite: `${_base}`,
  urlCorePrime: `${_base}`,
};
