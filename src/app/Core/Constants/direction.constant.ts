export const DIRECTION_ENDPOINT = {
    get:'/departments/getByCriteria',
    create:'/departments/create',
    update:'/departments/update',
    delete:'/departments/delete'
}
   

export const columnsDirection = [
    {key: 'name', label:'Nom de la direction'},
    {key: 'description', label:'Description'},
    {key: 'isActive', label:'Statut'}
]