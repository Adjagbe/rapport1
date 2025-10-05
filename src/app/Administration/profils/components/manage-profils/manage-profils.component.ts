import { Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
// import { CtaButtonComponent } from 'src/app/shared/components/cta-button/cta-button.component';
// import { ToastService } from 'src/app/core/services/toast.service';
// import { ALERT_MESSAGES_ROLE } from 'src/app/core/constants/alert-message.constant';
// import { ModalService } from 'src/app/core/services/modal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfilsService } from 'src/app/Core/Services/profils.service';
import { CloseIconComponent } from 'src/app/Core/icons/close-icon.component';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { ActionsService } from 'src/app/Core/Services/actions.service';
import { ReloadIconComponent } from 'src/app/Core/icons/reload-icon.component';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'manage-profils',
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
  templateUrl: './manage-profils.component.html',
  styleUrls: ['./manage-profils.component.scss'],
})
export class ManageProfilsComponent implements OnInit, OnDestroy {
  // #modalService = inject(ModalService);
  @ViewChild('formTemplate') formTemplate!: TemplateRef<any>;
  @ViewChild('tree_js', { static: false }) treeContainer!: ElementRef;
  @Input() profilsId: any;
  // @Output() refreshTable = new EventEmitter<any>();
  isModalVisible = false;
  modalTitle = '';
  modalMessage = '';
  @Output() profilModifie = new EventEmitter<void>();

  // modalType: ModalType = ModalType.INFO;
  currentTemplate: TemplateRef<any> | null = null;
  btnSubmitText: 'Enregistrer' | 'Modifier' = 'Enregistrer';
  confirmLabel = 'Confirmer';
  cancelLabel = 'Annuler';
  modalSize: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  jsTreeElt: any;
  roleId: string = "";

  openSuccessModal(): void {
    this.modalTitle = 'Opération réussie';
    this.modalMessage = 'Les données ont été sauvegardées avec succès!';
    // this.modalType = ModalType.SUCCESS;
    this.currentTemplate = null;
    this.isModalVisible = true;
  }


  // PROFILS_TEXTS = PROFILS_TEXTS;
  // ALERT_MESSAGES_ROLE = ALERT_MESSAGES_ROLE;
  #rolesService = inject(ProfilsService)
  #actionsService = inject(ActionsService)
  #formBuilder = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #modalActive = inject(NgbActiveModal)
  #router = inject(Router)
  // toastr = inject(ToastService)
  newRoleFormulaire = this.#formBuilder.nonNullable.group({
    libelle: ['', Validators.required],
    code: ['', Validators.required],
    status: [true],
    fonctionnalites: ['', Validators.required],
    filterByDirection :[false],
  })
  // selectedCar!: number;
  constructor() {
    console.log(this.profilsId)
  }

  ngOnInit(): void {
    const currentRoleId = this.profilsId
    console.log(currentRoleId);

    if (currentRoleId) {
      this.newRoleFormulaire.controls['code'].disable();
      this.viewCodeRole = true
      this.getRoleById(currentRoleId);
      this.btnSubmitText = 'Modifier';
    } else {
      this.getListRoles()
      this.btnSubmitText = 'Enregistrer';
    }
    this.roleId = currentRoleId;
    this.getActionHierarchy()
  }

  ngAfterViewInit() {
    this.jsTreeElt = $(this.treeContainer.nativeElement)
    console.log('jstree 2', this.jsTreeElt);
  }

  isRoleGenerate: boolean = false;
  viewCodeRole: boolean = false;
  setCodeRole() {
    if (!this.isRoleGenerate && this.roleId == "") {
      this.viewCodeRole = true;
      this.newRoleFormulaire.patchValue({
        code: this.newRoleFormulaire.controls['libelle'].value.toUpperCase().replace(/\s+/g, "_")
      });
    }
  }

  public getRoleGenerate() {
    this.isRoleGenerate = true;
    let ActionBody: string = `${this.newRoleFormulaire.value.libelle ?? ''}`;
    this.#rolesService.generateCodeRole(ActionBody).subscribe(
      {
        next: (Actions: any) => {
          this.isRoleGenerate = false;
          if (Actions && !Actions.hasError) {
            this.newRoleFormulaire.patchValue({
              code: Actions.item ? Actions.item.code : ""
            });
            this.newRoleFormulaire.controls['code'].disable();
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

   listRoles: Array<{
    label: string;
    id: number;
  }> = [];

  getListRoles() {
    // this.isListRole = true;
    this.listRoles = [];
    this.#rolesService
      .getByCriteriaRole({
        size: '',
        index: '',
        ordre: 'ASC',
        champs: 'libelle',
        id: ''
      }, null)
      .subscribe({
        next: (listRoleResponse) => {
          const { items, count } = listRoleResponse;
          this.listRoles = items.map((value: any) => {
            return {
              id: value.id,
              label: value.libelle,
            }
          });;
          // this.isListAction = false;
          // this.count = count;

          console.log(
            'la liste des roles créées est : ',
            this.listRoles
          );
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getRoleById(id: string) {
    this.#rolesService
      .getByCriteriaRole({
        size: ``,
        index: ``,
        id: id
      })
      .subscribe({
        next: (listRoleResponse) => {
          const { items, count } = listRoleResponse
          this.newRoleFormulaire.patchValue({
            libelle: items[0].libelle,
            code: items[0].code,
            status: items[0].isLocked == true ? false : true,
            filterByDirection : items[0].filterByDirection ? items[0].filterByDirection : false
          })
          setTimeout(() => {
            // this.jsTreeElt.on('ready.jstree', () => {
            items[0].fonctionnalites?.map((elt: any) => {
              this.jsTreeElt.jstree(true).select_node(elt.id);
            });
            // });
          }, 1000);
        }
      })
  }

  exempledeTableau(table: any) {
    let keyIndex = 0; // Index de la clé globale pour le premier niveau
    this.multipleSelectedAction = table.map((item: any) => {
      const currentKey = `${keyIndex}`; // Générer la clé principale
      keyIndex++; // Incrémenter pour l'élément suivant du premier niveau
      const parentId = item.id;
      return {
        key: currentKey,
        id: item.id ? item.id : '',
        text: item.libelle ? item.libelle : '',
        data: '', // Valeur par défaut
        icon: 'pi pi-fw pi-inbox',
        children: item.fonctionnalitesEnfant ? this.retouneChild(item.fonctionnalitesEnfant, currentKey, parentId) : [],
      };
    });

    console.log("TABLEAU HIERARCHIQUE :", this.multipleSelectedAction);
    this.jsTreeElt.jstree({
      core: {
        data: this.multipleSelectedAction,
        themes: {
          name: 'proton',
          responsive: true
        }
      },
      checkbox: {
        three_state: true,
        cascade: 'up'
      },
      plugins: ['checkbox']
    });
    setTimeout(() => {
      // this.jsTreeElt.on('ready.jstree', () => {
      this.jsTreeElt.jstree("open_all")
      // });
    }, 1000);
    this.jsTreeElt.on('changed.jstree', (val: any, valObject: any) => {
      console.log('val', val);
      // console.log('valObject', valObject);
      let action = valObject.selected.map((elt: any) => {
        return { id: elt };
      })
      this.newRoleFormulaire.patchValue({
        fonctionnalites: action,
      });
    });

    // console.log("jstree 3",this.jsTreeElt)
  }

  retouneChild(child: Array<any>, parentKey: string, parentId: number): any[] {
    let childKey = 0; // Initialiser une clé locale pour chaque niveau
    return child.map((item) => {
      const currentKey = `${parentKey}-${childKey}`; // Construire la clé dynamique
      childKey++; // Incrémenter la clé pour chaque enfant
      const parentId = item.id;
      return {
        key: currentKey,
        id: item.id,
        text: item.libelle,
        parentId: parentId,
        data: item.fonctionnalitesEnfant ? -1 : '', // Définir `data` pour les enfants existants
        cle: '', // S'il y a un besoin spécial pour `cle`, sinon mettre une chaîne vide
        icon: 'pi pi-fw pi-inbox',
        children: item.fonctionnalitesEnfant ? this.retouneChild(item.fonctionnalitesEnfant, currentKey, parentId) : [], // Appel récursif
      };
    });
  }

  multipleSelectedAction: any[] = [];
  getActionHierarchy() {
    // this.isListRole = true;
    this.#actionsService
      .getByCriteriaActionHierarchy()
      .subscribe({
        next: (listRoleResponse) => {
          // const { items, count } = listRoleResponse;
          this.multipleSelectedAction = listRoleResponse;
          // this.isListRole = false;
          // this.count = listRoleResponse.length;
          this.exempledeTableau(this.multipleSelectedAction)
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  isSubmit: boolean = false;

  CreateOrUpdateRole() {
    this.roleId == "" ? this.createRole() : this.updateRole();
  }

  updateRole() {
    let role = {
      id: this.roleId,
      libelle: this.newRoleFormulaire.get('libelle')!.value,
      code: this.newRoleFormulaire.get('code')!.value,
      isLocked: this.newRoleFormulaire.get('status')!.value == true ? false : true,
      fonctionnalites: this.newRoleFormulaire.get('fonctionnalites')!.value,
      filterByDirection : this.newRoleFormulaire.get('filterByDirection')!.value 
    }
    this.isSubmit = true;
    this.#rolesService.updateRole(role).subscribe({
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
          // this.toastr.mixin(ALERT_MESSAGES_ROLE.SUCCESS_CHANGES.text, ALERT_MESSAGES_ROLE.SUCCESS_CHANGES.icon)
          this.close();
        }
        else {
          Swal.fire({
            toast: true,
            icon: 'error',
            title: reqResponse.status.message,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        };
      },
      error: (error) => {
        this.isSubmit = false;
        console.error(error)
      }
    })
  }

  viewBtnRefreshCode: boolean = false;
  createRole() {
    // console.log('form before send: ', this.newOfferFormulaire.value)
    let role = {
      libelle: this.newRoleFormulaire.get('libelle')!.value,
      code: this.newRoleFormulaire.get('code')!.value,
      isLocked: this.newRoleFormulaire.get('status')!.value == true ? false : true,
      fonctionnalites: this.newRoleFormulaire.get('fonctionnalites')!.value,
      filterByDirection : this.newRoleFormulaire.get('filterByDirection')!.value 
    }
    this.isSubmit = true;
    this.#rolesService.createRole(role).subscribe({
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
          // this.toastr.mixin(reqResponse.status.message, ALERT_MESSAGES_ROLE.ERROR_ROLE_CREATION.icon)
        } else if (!reqResponse.hasError) {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: 'Le profil a été créé avec succès.',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          // this.toastr.mixin(ALERT_MESSAGES_ROLE.SUCCESS_ROLE_CREATION.text, ALERT_MESSAGES_ROLE.SUCCESS_ROLE_CREATION.icon)
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

  onSubmit() {

  }

  close() {
    console.log("Fin")
    this.#modalActive.close();
    this.newRoleFormulaire.reset();
    this.newRoleFormulaire.get("status")?.setValue(true)
    this.newRoleFormulaire.get("fonctionnalites")?.setValue('')
    this.newRoleFormulaire.get('code')?.enable();
    this.jsTreeElt?.jstree('deselect_all')
    this.viewCodeRole = false;
    this.isRoleGenerate = false;
    this.getListRoles();
    this.roleId = "";
    
    
    
    // this.refreshTable.emit()
    this.#router.navigate(['/administration/profils']);
    // this.#modalService.off();
  }

  changeStatusAction(items: string) {
    if (items == 'true') {
      this.newRoleFormulaire.patchValue({
        status: true,
      });
    } else {
      this.newRoleFormulaire.patchValue({
        status: false,
      });
    }
  }

  ngOnDestroy(): void {
    this.close()
  }
}
