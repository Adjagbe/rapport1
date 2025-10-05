export interface QuestionOption {
  displayOrder: number;
  idQuestion: number;
  idQuestionOption: number;
  isDeleted: boolean;
  optionText: string;
  optionValue: string;
}

export interface QuestionItem {
  idQuestion: number;
  isDeleted: boolean;
  isMandatory: boolean;
  options?: QuestionOption[];
  orderInFlow: number;
  questionText: string;
  questionType: 'BOOLEAN' | 'LISTE' | 'TEXT_INPUT' | string;
}

export interface QuestionApiResponse {
  status: Record<string, any>;
  hasError: boolean;
  items: QuestionItem[];
}

export interface QuestionFlowItem {
  actionType?: string;
  actionValueRequired: boolean;
  finalCertificationStatusId?: number;
  finalCertificationStatusName?: string;
  idChosenOption?: number;
  idCurrentQuestion: number;
  idNextQuestion?: number;
  idQuestionFlow: number;
  isDeleted: boolean;
  warning?: string;
  warningColor?: {
    backgroundColor: string;
    fontColor: string;
    borderColor: string;
  };
}

export interface QuestionFlowApiResponse {
  status: Record<string, any>;
  hasError: boolean;
  count: number;
  items: QuestionFlowItem[];
}

export interface CertificationQuestionResponse {
  questionId: number;
  questionText: string;
  questionType: string;
  chosenOptionId: number | null;
  chosenOptionText: string | null;
  textResponse: string | null;
  relatedDepartmentId: number | null;
  relatedDepartmentName: string | null;
  suggestedProfile: string | null;
  responseDate: string;
}

export interface CertificationDetailsItem {
  certificationEntryId: number;
  userAccountId: number;
  userAccountLogin: string;
  userAccountLastName: string;
  userAccountFirstName: string;
  userAccountEmail: string;
  userAccountCuid: string;
  userAccountProfileNameImported: string;
  userAccountStatusImported: string;
  userAccountDepartmentName: string;
  certifierId: number;
  certifierLogin: string;
  certifierLastName: string;
  certifierFirstName: string;
  certifierEmail: string;
  campaignId: number;
  campaignName: string;
  applicationId: number;
  applicationName: string;
  finalCertificationStatusName: string;
  certificationDate: string;
  certificationComment: string | null;
  questionResponses: CertificationQuestionResponse[];
}

export interface CertificationDetailsApiResponse {
  status: Record<string, any>;
  hasError: boolean;
  item: CertificationDetailsItem;
}
