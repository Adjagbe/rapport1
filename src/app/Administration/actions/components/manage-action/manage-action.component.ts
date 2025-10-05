import { Component, EventEmitter, inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
// import { ALERT_MESSAGES_ACTION } from 'src/app/core/constants/alert-message.constant';
// import { ToastService } from 'src/app/core/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { ReloadIconComponent } from 'src/app/Core/icons/reload-icon.component';
import { CloseIconComponent } from 'src/app/Core/icons/close-icon.component';
import { ActionsService } from 'src/app/Core/Services/actions.service';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'manage-action',
  standalone: true,
  imports: [
    CommonModule,
    FormControlComponent,
    // CtaButtonComponent,
    NgSelectModule,
    ReactiveFormsModule,
    ReloadIconComponent,
    CloseIconComponent,
    BtnGenericComponent],
  templateUrl: './manage-action.component.html',
  styleUrls: ['./manage-action.component.scss']
})
export class ManageActionComponent implements OnInit {
  // #modalService = inject(ModalService);
  @ViewChild('formTemplate') formTemplate!: TemplateRef<any>;
  @Input() actionId: any;
  @Output() actionIdChange = new EventEmitter<any>();
  // @Output() refreshTable = new EventEmitter<any>();
  isModalVisible = false;
  modalTitle = '';
  modalMessage = '';
  // modalType: ModalType = ModalType.INFO;
  currentTemplate: TemplateRef<any> | null = null;
  btnSubmitText: 'Enregistrer' | 'Modifier' = 'Enregistrer';
  confirmLabel = 'Confirmer';
  cancelLabel = 'Annuler';
  modalSize: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  openSuccessModal(): void {
    this.modalTitle = 'Opération réussie';
    this.modalMessage = 'Les données ont été sauvegardées avec succès!';
    // this.modalType = ModalType.SUCCESS;
    this.currentTemplate = null;
    this.isModalVisible = true;
  }

  // ACTIONS_TEXTS = ACTION_TEXTS;
  // ALERT_MESSAGES_ACTION = ALERT_MESSAGES_ACTION;
  #actionsService = inject(ActionsService)
  #formBuilder = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #router = inject(Router)
  #modalActive = inject(NgbActiveModal)
  // toastr = inject(ToastService)

  newActionFormulaire = this.#formBuilder.nonNullable.group({
    libelle: ['', Validators.required],
    code: ['', Validators.required],
    status: [true],
    parentId: [null],
  })

  ngOnInit(): void {
    // const currentactionId = this.#route.snapshot.queryParamMap.get('edit')
    const currentactionId = this.actionId;
    console.log(currentactionId);
    this.actionId = `${currentactionId ?? ''}`;
    if (this.actionId) {
      this.getactionId(this.actionId);
      this.btnSubmitText = 'Modifier';
    } else {
      this.getByCriteriaAction();
      this.btnSubmitText = 'Enregistrer';
    }
  }

  isActionGenerate: boolean = false;
  viewCodeAction: boolean = false;
  setCodeAction() {
    if (!this.isActionGenerate && this.actionId == '') {
      this.viewCodeAction = true;
      this.newActionFormulaire.patchValue({
        code: this.newActionFormulaire.controls['libelle'].value.toUpperCase().replace(/\s+/g, "_")
      });
    }
  }

  public getActionGenerate() {
    this.isActionGenerate = false;
    let ActionBody: string = `${this.newActionFormulaire.value.libelle ?? ''}`;
    this.#actionsService.generateCodeAction(ActionBody).subscribe(
      {
        next: (Actions: any) => {
          this.isActionGenerate = true;
          if (Actions && !Actions.hasError) {
            this.newActionFormulaire.patchValue({
              code: Actions.item ? Actions.item.code : ""
            });
            this.newActionFormulaire.controls['code'].disable();
            this.viewBtnRefreshCode = false
          } else {

          }
        },
        error: (error) => {
          // this.isFiltering = false;
        }
      }
    )
  }

  ActionParentId!: any;
  getactionId(id: string) {
    this.#actionsService
      .getByCriteriaAction({
        size: ``,
        index: ``,
        id: id
      }, false)
      .subscribe({
        next: (listRoleResponse) => {
          const { items, count } = listRoleResponse
          this.ActionParentId = items[0].parentId
          this.viewCodeAction = true;
          this.newActionFormulaire.patchValue({
            libelle: items[0].libelle,
            code: items[0].code,
            status: items[0].isLocked == true ? false : true,
            // parentId: listRoleResponse[0].parentId,
          })
          this.newActionFormulaire.controls['code'].disable();
          this.getActionHierarchy();
        }
      })
  }

  listFonctionnalites: any[] = [];
  getActionHierarchy() {
    // this.isListRole = true;
    this.#actionsService
      .getByCriteriaActionNoHierarchy(`${this.actionId}`)
      .subscribe({
        next: (listRoleResponse) => {
          this.listFonctionnalites = listRoleResponse;
          this.newActionFormulaire.patchValue({
            parentId: this.ActionParentId
          })
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getByCriteriaAction() {
    // this.isListRole = true;
    this.#actionsService
      .getByCriteriaAction({
        size: ``,
        ordre: 'ASC',
        champs: 'libelle',
        index: ``,
      }, false)
      .subscribe({
        next: (listRoleResponse) => {
          const { items, count } = listRoleResponse
          this.listFonctionnalites = items;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  isSubmit = false;
  
  CreateOrUpdateAction() {
    this.actionId == "" ? this.createAction() : this.updateAction();
  }

  updateAction() {
    let role = {
      id: this.actionId,
      libelle: this.newActionFormulaire.get('libelle')!.value,
      code: this.newActionFormulaire.get('code')!.value,
      isLocked: this.newActionFormulaire.get('status')!.value == true ? false : true,
      parentId: this.newActionFormulaire.get('parentId')!.value,
      description: "test"
    }
    this.isSubmit = true;
    this.#actionsService.updateAction(role).subscribe({
      next: (reqResponse: any) => {
        this.isSubmit = false;
        if (!reqResponse.hasError) {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: 'Les modifications ont été enregistrées avec succès.',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          // this.toastr.mixin(ALERT_MESSAGES_ACTION.SUCCESS_CHANGES.text,ALERT_MESSAGES_ACTION.SUCCESS_CHANGES.icon)
          this.close();
        }
        else return;
      },
      error: (error) => {
        this.isSubmit = false;
        console.error(error)
      }
    })
  }

  viewBtnRefreshCode: boolean = false;
  createAction() {
    // console.log('form before send: ', this.newOfferFormulaire.value)
    let role = {
      libelle: this.newActionFormulaire.get('libelle')!.value,
      code: this.newActionFormulaire.get('code')!.value,
      isLocked: this.newActionFormulaire.get('status')!.value == true ? false : true,
      parentId: this.newActionFormulaire.get('parentId')!.value,
      description: "test"
    }
    this.isSubmit = true;
    this.#actionsService.createAction(role).subscribe({
      next: (reqResponse) => {
        this.isSubmit = false;
        if (reqResponse && reqResponse.status.code == "904") {
          this.viewBtnRefreshCode = true;
          Swal.fire({
            toast: true,
            icon: 'error',
            title: reqResponse.status.message,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          // this.toastr.mixin(reqResponse.status.message,ALERT_MESSAGES_ACTION.ERROR_ACTION_CREATION.icon)
          // this.toastr.error(reqResponse.status.message)
        } else if (!reqResponse.hasError) {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: "L'action a été créée avec succès.",
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          // this.toastr.mixin(ALERT_MESSAGES_ACTION.SUCCESS_ACTION_CREATION.text,ALERT_MESSAGES_ACTION.SUCCESS_ACTION_CREATION.icon)
          this.close()
        }
        else return;
        // if (!reqResponse.hasError){
        //   this.newActionFormulaire.reset();
        //   this.#router.navigate(['/parametres/actions']);
        // } else if (reqResponse && reqResponse.hasError && reqResponse.status.code == "904") {
        //   this.viewBtnRefreshCode = true;
        //   // this.toastr.error(reqResponse.status.message)
        // }
        // else return;
      },
      error: (error) => {
        this.isSubmit = false;
        console.error(error)
      }
    })
  }

  close() {
    this.isActionGenerate = false;
    this.viewCodeAction = false;
    this.newActionFormulaire.reset();
    this.newActionFormulaire.get("status")?.setValue(true)
    this.newActionFormulaire.get('code')?.enable();
    this.actionIdChange.emit(null);
    this.#modalActive.close();
    this.getByCriteriaAction()
    // this.refreshTable.emit()
    this.#router.navigate(['/administration/actions']);
    // this.#modalService.off();

  }

  changeStatusAction(items: string) {
    if (items == 'true') {
      this.newActionFormulaire.patchValue({
        status: true,
      });
    } else {
      this.newActionFormulaire.patchValue({
        status: false,
      });
    }
  }

}
