export interface QuestionnaireApiResponse {
  status: any;
  hasError: boolean;
  item: Question[];
}

export interface Question {
  id: number;
  questionText: string;
  questionType: string;
  orderInFlow: number;
  isMandatory: boolean;
  options: Option[];
}

export interface Option {
  id: number | null;
  optionText: string;
  optionValue: string | null;
  displayOrder: number;
  displayValue: string | null;
  actionType: string | null;
  warning: string | null;
  warningColor: warningColor | {};
  nextQuestion: Question | null;
}

export interface warningColor {
  backgroundColor: string;
  fontColor: string;
  borderColor: string;
}

export interface QuestionApi {
  status: any;
  hasError: boolean;
  items: listeQuestion[];
}

export interface listeQuestion {
  idQuestion: number;
  isMandatory: boolean;
  orderInFlow: number;
  questionText: string;
  questionType: string;
}

export interface ReponseApi {
  status: any;
  hasError: boolean;
  items: listeReponse[]
}

export interface listeReponse {
  idOptionTemplate: number;
  isDeleted: boolean;
  optionText: string;
  optionValue: string;
}
