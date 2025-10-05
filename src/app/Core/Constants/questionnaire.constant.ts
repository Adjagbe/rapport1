export const QUESTIONNAIRE_ENDPOINT = {
    get:'/questionflow/tree',
    createQ:'/questions/create',
    createR:'/optiontemplate/create',
    getQuestion:'/questions/getByCriteria',
    getReponse:'/optiontemplate/getByCriteria',
    choiceQuestionType:'/question-type/getByCriteria',
    asignQuestion:'/questionflow/addTree ',
    update:'/questionflow/updateTree',
    delete:'/questionflow/deleteTree',
    deletOption:'/questionflow/deleteOption',
    statusAsignQ:'/account-action/getByCriteria',
    getByIdAssignQ:'/questionflow/questionDetail',
    deleteQ:'/questions/delete',
    deleteR:'/optiontemplate/delete',
    updateQ:'/questions/update',
    updateR:'/optiontemplate/update'
}

export const columnsQuestion = [
    {key: 'questionText', label:'Questions'},
    {key: 'questionType', label:'Type de question'},
]

export const columnsReponse = [
    {key: 'optionText', label:'Reponses'},
]

