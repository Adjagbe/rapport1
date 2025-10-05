import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavAdministrationComponent } from "src/app/Core/components/nav-administration/nav-administration.component";
import { NavParametrageComponent } from "src/app/Core/components/nav-parametrage/nav-parametrage.component";
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { HelpIconComponent } from 'src/app/Core/icons/help-icon.component';
import { AwnserIconComponent } from 'src/app/Core/icons/awnser-icon.component';
import { ModalLayoutComponent } from 'src/app/Core/layouts/modal-layout/modal-layout.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuestionnaireManageComponent } from '../questionnaire-manage/questionnaire-manage.component';
import { OrganizationChartBasicDocComponent } from "../organization-chart-basic-doc/organization-chart-basic-doc.component";
import { QuestionnaireApiResponse } from 'src/app/Models/questionnaire.model';
import { ParametrageService } from 'src/app/Core/Services/Parametrage/parametrage.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'questionnaire-overview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavParametrageComponent, BtnGenericComponent, AwnserIconComponent, HelpIconComponent, OrganizationChartBasicDocComponent],
  templateUrl: './questionnaire-overview.component.html',
  styleUrls: ['./questionnaire-overview.component.scss']
})
export class QuestionnaireOverviewComponent {

  modalToRender: 'new_question' | 'new_reponse' = 'new_question';
  header: string = "";
  modalRef: any;

  #modalServices = inject(NgbModal);
  #QuestionnaireService = inject(ParametrageService);
  #router = inject(Router);

  listQuestionnaire: QuestionnaireApiResponse[] = [];

  // AddQuestion() {
  //   this.modalToRender = 'new_question';
  //   this.header = "Ajout d'un questionnaire"
  //   console.log('CTA bouton cliqué');
  //   this.modalRef = this.#modalServices.open(QuestionnaireManageComponent, 
  //   {size: 'lg',centered: true, keyboard: false, backdrop: 'static'});

  // }

  // AddReponse(){
  //   this.modalToRender = 'new_reponse';
  //   this.header = "Ajout d'une reponse"
  //   this.modalRef = this.#modalServices.open(QuestionnaireManageComponent, 
  //   {size: 'lg',centered: true, keyboard: false, backdrop: 'static'});

  //   const keyTitle = 'Response'
  //   this.modalRef.componentInstance.keyTitle = keyTitle;

  // }

  GestionQuestion(){
    this.#router.navigateByUrl('parametrage/questionnaires/gestion_des_questions');
  }

  GestionReponse(){
    this.#router.navigateByUrl('parametrage/questionnaires/gestion_des_reponses');
  }

  ngOnInit(){
    this.getListQuestionnaire()
  }

  getListQuestionnaire(){
    this.#QuestionnaireService.getListQuestionnaire()
    .subscribe({
      next:(response)=>{
      this.listQuestionnaire = response.item[0];
      console.log('listQuestionnaire', this.listQuestionnaire);
      },
      error:(error)=> {
        console.error(error)
      }
    })
  }

  onReloadDataQ(){
    this.getListQuestionnaire()
  }


  
}
