export const PLATEFORME_ENDPOINT = {
    get:'/applications/getByCriteria',
    create:'/applications/create',
    update:'/applications/update',
    delete:'/applications/delete'
}
   

export const columnsPlateforme = [
    {key: 'name', label:'Nom de la plateforme'},
    {key: 'description', label:'Description'},
    {key: 'isActive', label:'Statut'}
]