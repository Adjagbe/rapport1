import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EditIconComponent,
  PlusIconComponent,
  TrashIconComponent,
} from 'src/app/Core/icons';
import { QuestionApiResponse } from 'src/app/Models/certification.model';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { QuestionSelectComponent } from '../question-select/question-select.component';
import Swal from 'sweetalert2';
import { AlertIconComponent } from 'src/app/Core/icons/alert.component';
import { ParametrageService } from 'src/app/Core/Services/Parametrage/parametrage.service';
import { Question } from 'src/app/Models/questionnaire.model';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { FirstQuestionComponent } from '../question-select/first-question/first-question.component';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [
    CommonModule,
    EditIconComponent,
    PlusIconComponent,
    TrashIconComponent,
    AlertIconComponent,
    BtnGenericComponent,
    NgbTooltip,
  ],
  templateUrl: './organization-chart-basic-doc.component.html',
  styleUrls: ['./organization-chart-basic-doc.component.scss'],
})
export class OrganizationChartBasicDocComponent {
  @Input() node: any;

  @Output() reloadDataQ = new EventEmitter<void>();

  modalToRender: 'select_question' | 'edit_question' = 'select_question';
  header: string = '';
  modalRef: any;
  #modalServices = inject(NgbModal);

  selectedQuestionId: string = '';
  questionType: string = '';

  #QuestionnaireService = inject(ParametrageService);

  orderInFlow: number = 0;

  isUpdate = false;

  onReloadDataQFromChild() {
    this.reloadDataQ.emit();
  }

  addQuestionNode2() {
    this.modalToRender = 'select_question';
    this.header = "Ajout d'un questionnaire";
    console.log('CTA bouton cliqué');
    this.modalRef = this.#modalServices.open(FirstQuestionComponent, {
      size: 'lg',
      centered: true,
      keyboard: false,
      backdrop: 'static',
    });

    this.orderInFlow = 1;
    // this.selectedQuestionId = question.id;
    this.modalRef.componentInstance.orderInFlow = this.orderInFlow;
    // this.modalRef.componentInstance.selectedQuestionId =
    //   this.selectedQuestionId;

    this.modalRef.componentInstance.refreshData.subscribe(() => {
      // Ici je dois dire au parent "ParamétrageGlobal" de recharger
      this.reloadDataQ.emit(); // on propage plus haut
    });
  }

  addQuestionNode(question: any) {
    this.modalToRender = 'select_question';
    this.header = "Ajout d'un questionnaire";
    console.log('CTA bouton cliqué');
    this.modalRef = this.#modalServices.open(QuestionSelectComponent, {
      size: 'lg',
      centered: true,
      keyboard: false,
      backdrop: 'static',
    });

    this.orderInFlow = question.orderInFlow;
    this.selectedQuestionId = question.id;
    this.questionType = question.questionType;
    this.modalRef.componentInstance.orderInFlow = this.orderInFlow;
    this.modalRef.componentInstance.selectedQuestionId = this.selectedQuestionId;
    this.modalRef.componentInstance.questionType = this.questionType;

    this.modalRef.componentInstance.refreshData.subscribe(() => {
      // Ici je dois dire au parent "ParamétrageGlobal" de recharger
      this.reloadDataQ.emit(); // on propage plus haut
    });
  }

  editQuestionNode(question: any) {
    if (question && question.id !== undefined && question.id !== null) {
      this.selectedQuestionId = question.id;
      this.orderInFlow = question.orderInFlow;
      this.isUpdate = true;
      // console.log('position du card', this.orderInFlow);

      console.log('Id de la question selectionnée :', this.selectedQuestionId);
      this.modalToRender = 'edit_question';
      this.header = 'Modifier question';
      console.log('CTA bouton cliqué');
      this.modalRef = this.#modalServices.open(QuestionSelectComponent, {
        size: 'lg',
        centered: true,
        keyboard: false,
        backdrop: 'static',
      });
      this.modalRef.componentInstance.selectedQuestionId =
        this.selectedQuestionId;
      this.modalRef.componentInstance.orderInFlow = this.orderInFlow;
      this.modalRef.componentInstance.isUpdate = this.isUpdate;
      this.modalRef.componentInstance.refreshData.subscribe(() => {
        // Ici je dois dire au parent Questionnaire-overview de recharger
        this.reloadDataQ.emit(); // on propage plus haut
      });
    }
  }

  // editQuestionNode2( ){

  //     this.modalToRender = 'edit_question';
  //       this.header = "Modifier question"
  //       console.log('CTA bouton cliqué');
  //       this.modalRef = this.#modalServices.open(QuestionSelectComponent,
  //       {size: 'lg',centered: true, keyboard: false, backdrop: 'static'});
  //     this.modalRef.componentInstance.selectedQuestionId = 2;

  // }

  deleteQuestionNode(questionData: Question) {
    let recupId = {
      idQuestion: questionData.id,
    };
    Swal.fire({
      title: 'Supprimer le questionnaire',
      html: `Êtes-vous sûr de vouloir supprimer la question 
            "${this.node.questionText}" <br> <br> 
            <span style="color:red; display:flex; align-items:center; gap:8px; justify-content:center;"> 
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.0003 1.83398L0.916992 19.2507H21.0837M11.0003 5.50065L17.9028 17.4173H4.09783M10.0837 9.16732V12.834H11.917V9.16732M10.0837 14.6673V16.5007H11.917V14.6673" fill="#FF191D"/>
              </svg>
              <span>Cette question disparaîtra de la configuration</span>
            </span>`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#000000',
      confirmButtonColor: '#FF7900',

      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer definitivement',

      focusCancel: true,
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.#QuestionnaireService.DeleteQuestion(recupId).subscribe({
          next: () => {
            Swal.fire({
              toast: true,
              icon: 'success',
              title: 'Question supprimée avec succès.',
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });

            this.reloadDataQ.emit();
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    });
  }
}
