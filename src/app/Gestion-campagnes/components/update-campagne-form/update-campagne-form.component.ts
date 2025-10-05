import { Component, inject, OnDestroy, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalLayoutComponent } from 'src/app/Core/layouts/modal-layout/modal-layout.component';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subscription } from 'rxjs';
import { SelectedAppCardComponent } from '../selected-app-card/selected-app-card.component';

import { DownloadIconComponent } from 'src/app/Core/icons/download-icon.component';
import { CloseIconBtnComponent } from 'src/app/Core/icons/close-btn-icon.component';
import { ValidIconComponent } from 'src/app/Core/icons/valid-icon.component';

import { SearchIconComponent } from 'src/app/Core/icons/search-icon.component';
import {
  ONLYEXCELFILE,
  EXPECTED_USER_COLUMNS,
  ERROR_MSG,
} from 'src/app/Core/Constants/gestion-campagnes.constant';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';
import { ApplicationService } from 'src/app/Core/Services/application.service';
import {
  CampagneModelForm,
  Campagnes,
} from 'src/app/Models/gestion-campagnes.model';
import { GestionCampagnesService } from 'src/app/Core/Services/gestion-campagnes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsUtils } from 'src/app/Core/Utility/forms.utils';
import Swal from 'sweetalert2';
import { startOfDay, parseISO } from 'date-fns';
import { FilePreviewModalComponent } from 'src/app/Shared/file-preview-modal/file-preview-modal.component';
import { PrefillFilePreviewComponent } from 'src/app/Shared/prefill-file-preview/prefill-file-preview.component';
import { CustomValidatorsUtils } from 'src/app/Core/Utility/custom-validators.utils';
import { ErrorMessageComponent } from 'src/app/Shared/Components/error-message/error-message.component';
import {
  ArrowUpIconComponent,
  PreviewIconComponent,
  ReloadIconComponent,
} from 'src/app/Core/icons';

@Component({
  selector: 'app-update-campagne-form',
  standalone: true,
  imports: [
    CommonModule,
    ModalLayoutComponent,
    FormControlComponent,
    BtnGenericComponent,
    ReactiveFormsModule,
    SelectedAppCardComponent,
    DownloadIconComponent,
    CloseIconBtnComponent,
    ValidIconComponent,
    SearchIconComponent,
    NgSelectModule,
    ErrorMessageComponent,
    ReloadIconComponent,
    PreviewIconComponent,
  ],
  templateUrl: './update-campagne-form.component.html',
  styleUrls: ['./update-campagne-form.component.scss'],
})
export class UpdateCampagneFormComponent implements OnDestroy, OnInit {
  #fb = inject(FormBuilder);
  #commonUtils = inject(CommonUtils);
  #applicationsService = inject(ApplicationService);
  #campagneService = inject(GestionCampagnesService);
  #ngModal = inject(NgbModal);
  FormsUtils = inject(FormsUtils);
  #validators = inject(CustomValidatorsUtils);

  @Input() campagneToUpdate: Partial<Campagnes> | null = null;

  ErrorMsg = ERROR_MSG;
  invalidFile = false;
  showErrorMsg = false;
  onlyExcelFile = ONLYEXCELFILE;
  appSugestionsList: { label: string; value: number }[] = [];
  appList: Array<{}> | null = null;
  selectedApps: number[] = [];
  // Date minimale autorisée pour les inputs de date (aujourd'hui)
  minCreatedAt: string = this.#commonUtils.formatDateForInput(new Date());

  campagneForm = this.#fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        this.#validators.noLeadingSpace(),
        this.#validators.minLengthStrict(3),
      ],
    ],
    applications: this.#fb.nonNullable.array([], [Validators.required]),
    createdAt: [
      this.#commonUtils.getDefaultCampagneDates().start,
      [Validators.required],
    ],
    endAt: [
      this.#commonUtils.getDefaultCampagneDates().end,
      [Validators.required],
    ],
  });

  selectedAppsControl$!: Subscription;
  selectedAppsControl = this.#fb.control<number[]>([]);
  selectedSuggestion: { label: string; value: number } = {
    label: '',
    value: 0,
  };

  campagneFormControler = this.FormsUtils.getControl(this.campagneForm);
  readonlyFieldsActive = false;
  readonlyNameAndStart = false;
  readonlyApplications = false;

  // Getters d'affichage des erreurs (alignés sur le formulaire de création)
  get nameError(): string {
    return this.#errorMessage(
      this.campagneForm.get('name'),
      'Nom de la campagne'
    );
  }

  get applicationsError(): string {
    return this.#errorMessage(this.Applications, 'Applications à certifier');
  }

  get createdAtError(): string {
    return this.#errorMessage(
      this.campagneForm.get('createdAt'),
      'Date de début'
    );
  }

  get endAtError(): string {
    return this.#errorMessage(
      this.campagneForm.get('endAt'),
      'Date de fin (prévisionnelle)'
    );
  }

  #errorMessage(ctrl: AbstractControl | null, label: string): string {
    if (!ctrl) return '';
    if (!(ctrl.touched || ctrl.dirty)) return '';
    const errors = ctrl.errors;
    if (!errors) return '';
    if (errors['required']) return `${label} est obligatoire`;
    if (errors['leadingSpace'])
      return `${label} ne doit pas commencer par un espace`;
    if (errors['minLengthStrict'])
      return `${label} doit contenir au moins ${errors['minLengthStrict'].requiredLength} caractères`;
    return 'Champ invalide';
  }

  ngOnInit() {
    if (this.campagneToUpdate) {
      if (this.campagneToUpdate.status === 'ACTIVE') {
        // Si ACTIVE, seul endAt est éditable
        this.readonlyNameAndStart = true;
        this.readonlyApplications = true;
        this.campagneForm.get('name')?.disable();
        this.campagneForm.get('applications')?.disable();
        this.campagneForm.get('createdAt')?.disable();
        this.selectedAppsControl.disable();
        // endAt reste activé
      } else if (this.campagneToUpdate.status === 'TERMINATE') {
        // Si TERMINATE, seuls name et createdAt sont désactivés
        this.readonlyNameAndStart = true;
        this.readonlyApplications = true;
        this.campagneForm.get('name')?.disable();
        this.campagneForm.get('applications')?.disable();
        this.campagneForm.get('createdAt')?.disable();
        this.selectedAppsControl.disable();
        // endAt reste activé
      } else if (this.campagneToUpdate.status === 'DESACTIVE') {
        // Si DESACTIVE, seuls name et createdAt sont désactivés, mais les applications restent modifiables
        this.readonlyNameAndStart = true;
        this.readonlyApplications = false; // Permettre la modification des applications
        this.campagneForm.get('name')?.disable();
        this.campagneForm.get('applications')?.enable(); // Réactiver le champ applications
        this.campagneForm.get('createdAt')?.disable();
        this.selectedAppsControl.enable(); // Réactiver le contrôle des applications sélectionnées
        // endAt reste activé
      } else {
        // Par défaut tout est éditable
        this.readonlyNameAndStart = false;
        this.readonlyApplications = false;
      }
    }
    this.#listenSelectedAppControl();
    this.#getApplication();
    this.#prefillForm();
  }

  cancel() {
    this.#ngModal.dismissAll();
  }

  #prefillForm() {
    if (this.campagneToUpdate) {
      // Pré-remplir les champs de base
      this.campagneForm.patchValue({
        name: this.campagneToUpdate.name || '',
        createdAt: this.campagneToUpdate.startDate || '',
        endAt: this.campagneToUpdate.estimatedEndDate || '',
      });

      // Pré-remplir les applications si disponibles
      // Note: Il faudra récupérer les détails de la campagne pour avoir les applications
      this.#loadCampagneDetails();
    }
  }

  #loadCampagneDetails() {
    if (this.campagneToUpdate?.idCampaign) {
      this.#campagneService
        .getCampagneDetails(this.campagneToUpdate.idCampaign)
        .subscribe({
          next: (details) => {
            // Pré-remplir les applications sélectionnées avec leurs fichiers
            const appIds =
              details.applicationDetails?.map((app) => app.applicationId) || [];
            this.selectedAppsControl.setValue(appIds);

            // Pré-remplir les fichiers existants dans le FormArray
            const formArray = this.Applications;

            // Vider le FormArray d'abord
            while (formArray.length) {
              formArray.removeAt(0);
            }

            // Ajouter chaque application avec ses fichiers
            details.applicationDetails?.forEach((appDetail) => {
              const app = this.appSugestionsList.find(
                (a) => a.value === appDetail.applicationId
              );

              // Créer un objet File simulé pour chaque fichier existant
              const existingFiles =
                appDetail.files?.map((file) => ({
                  id: file.id,
                  name: file.fileName,
                  url: file.fileUrl,
                  importDate: file.importDate,
                })) || [];

              formArray.push(
                this.#fb.group({
                  id: appDetail.applicationId,
                  name: app?.label ?? appDetail.applicationName,
                  File: [null],
                  existingFiles: [existingFiles],
                  isPreFilled: [true],
                })
              );
            });
          },
          error: (error) => {
            console.error(
              'Erreur lors du chargement des détails de la campagne:',
              error
            );
          },
        });
    }
  }

  #getApplication() {
    this.#applicationsService.getApplications().subscribe({
      next: (applications) => {
        this.appSugestionsList = applications.map((app) => ({
          label: app.name,
          value: app.idApplication,
        }));
      },
    });
  }

  setSelectedSuggestion(suggestion: { label: string; value: number }) {
    const currentValue = (this.selectedAppsControl.value as number[]) || [];
    if (currentValue.includes(suggestion.value)) {
      // Si déjà sélectionné, on retire
      this.selectedAppsControl.setValue(
        currentValue.filter((v) => v !== suggestion.value)
      );
      // Optionnel : désactive le badge actif si tu veux
      if (this.selectedSuggestion.value === suggestion.value) {
        this.selectedSuggestion = { label: '', value: 0 };
      }
    } else {
      // Sinon, on ajoute
      this.selectedAppsControl.setValue([...currentValue, suggestion.value]);
      this.selectedSuggestion = suggestion;
    }
    console.log('[SUggestion object]:', this.selectedSuggestion);
  }

  get Applications() {
    return this.campagneForm.get('applications') as FormArray;
  }

  getMostRecentFileName(existingFiles: any[]): string {
    if (!existingFiles || existingFiles.length === 0) return '';

    // Trouver le fichier avec la date d'import la plus récente
    const mostRecentFile = existingFiles.reduce((latest, current) => {
      const latestDate = parseISO(latest.importDate);
      const currentDate = parseISO(current.importDate);
      return currentDate > latestDate ? current : latest;
    });

    return mostRecentFile.name;
  }

  /**
   * Retourne le nom du fichier à afficher selon le type de fichier
   * @param ctrl - Le contrôle du formulaire
   * @returns Le nom du fichier ou une chaîne vide
   */
  getDisplayFileName(ctrl: AbstractControl): string {
    const hasNewFile = ctrl.value?.File;
    const hasExistingFiles =
      ctrl.value?.existingFiles && ctrl.value?.existingFiles.length > 0;

    if (hasNewFile) {
      // Nouveau fichier uploadé - afficher le nom
      return ctrl.value.File.name;
    } else if (hasExistingFiles) {
      // Fichier existant - ne pas afficher le nom (chaîne vide)
      return '';
    }

    return '';
  }

  /**
   * Détermine si c'est un nouveau fichier uploadé
   * @param ctrl - Le contrôle du formulaire
   * @returns true si c'est un nouveau fichier
   */
  isNewFile(ctrl: AbstractControl): boolean {
    return !!ctrl.value?.File;
  }

  /**
   * Détermine si c'est un fichier existant (récupéré du backend)
   * @param ctrl - Le contrôle du formulaire
   * @returns true si c'est un fichier existant
   */
  isExistingFile(ctrl: AbstractControl): boolean {
    return (
      !ctrl.value?.File &&
      ctrl.value?.existingFiles &&
      ctrl.value?.existingFiles.length > 0
    );
  }

  #listenSelectedAppControl() {
    this.selectedAppsControl$ = this.selectedAppsControl.valueChanges.subscribe(
      (appIds) => {
        const formArray = this.Applications;
        console.log('Tab de controleur: ', formArray);
        // On sauvegarde les anciens groupes par id
        const oldGroups: { [id: number]: AbstractControl } = {};
        formArray.controls.forEach((ctrl) => {
          const id = ctrl.value?.id;
          if (id !== undefined && id !== null) oldGroups[id] = ctrl;
        });

        console.log('old grps: ', oldGroups);

        // On vide le FormArray
        while (formArray.length) {
          formArray.removeAt(0);
        }

        // On ajoute chaque app sélectionnée, en conservant le File si déjà présent
        (appIds ?? []).forEach((id) => {
          if (oldGroups[id]) {
            formArray.push(oldGroups[id]);
          } else {
            // On retrouve le nom à partir de l'id
            const app = this.appSugestionsList.find((a) => a.value === id);
            formArray.push(
              this.#fb.group({
                id,
                name: app?.label ?? '',
                File: [null],
                existingFiles: [[]],
                isPreFilled: [false],
              })
            );
          }
        });
      }
    );
  }

  async onFileChange(e: Event, ctrl: AbstractControl) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) return;

    try {
      // 1) Vérifier que le fichier n'est pas vide
      const isEmpty = await this.#commonUtils.isExcelFileEmpty(file);
      if (isEmpty) {
        this.ErrorMsg =
          'Le fichier sélectionné est vide. Veuillez fournir un fichier contenant au moins une ligne de données.';
        this.invalidFile = true;
        input.value = '';
        ctrl.patchValue({ File: null });
        return;
      }

      // 2) Vérifier que les colonnes sont correctes
      const headers = await this.#commonUtils.readExcelHeaders(file);
      const result = this.#commonUtils.compareColumns(
        EXPECTED_USER_COLUMNS,
        headers
      );

      if (!result.valid) {
        this.ErrorMsg = `Les colonnes attendues ne sont pas respectées. Colonnes manquantes : ${
          result.missing.join(', ') || 'Aucune'
        }`;
        this.invalidFile = true;
        input.value = '';
        ctrl.patchValue({ File: null });
        return;
      }

      // Fichier valide - masquer le message d'erreur
      this.invalidFile = false;
      ctrl.patchValue({ File: file });
    } catch (err) {
      this.ErrorMsg =
        'Lecture du fichier impossible. Veuillez vérifier le format du fichier (xls/xlsx/csv).';
      this.invalidFile = true;
      input.value = '';
      ctrl.patchValue({ File: null });
    }
  }

  onRemove(ctrl: AbstractControl) {
    console.log('controleur to remove: ', ctrl.value);
    const updateSelectValue = (
      this.selectedAppsControl.value as number[]
    ).filter((v) => v !== ctrl.value.id);
    this.selectedAppsControl.setValue(updateSelectValue);
    ctrl.patchValue({ File: null, isPreFilled: false });
  }

  async onPreviewFile(ctrl: AbstractControl) {
    const file = ctrl.value.File;
    if (!file) return;
    const parsed = await this.#commonUtils.parseExcelFile(file);
    const datas = parsed.data;
    const columns = datas.length
      ? Object.keys(datas[0]).map((key) => ({ label: key, key }))
      : [];
    const modalRef = this.#ngModal.open(FilePreviewModalComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.columns = columns;
    modalRef.componentInstance.datas = datas;
  }

  onPreviewPreFillFile(ctrl: AbstractControl) {
    const config = {
      idCampagne: this.campagneToUpdate?.idCampaign ?? 0,
      idApplication: ctrl.get('id')?.value ?? 0,
    };
    const modalRef = this.#ngModal.open(PrefillFilePreviewComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.config = config;
  }

  invalidDate = false;
  async onSub() {
    if (this.campagneForm.invalid) {
      console.log('ERROR: ', this.campagneForm.get('name')?.errors);
      this.campagneForm.markAllAsTouched();
      this.showErrorMsg = true;
      this.ErrorMsg = ERROR_MSG;
      return;
    }
    // Remplacer par getRawValue pour inclure les champs désactivés
    const formValue = this.campagneForm.getRawValue();
    // Vérification de la date de début (doit être >= aujourd'hui)
    const today = startOfDay(new Date());
    const createdAt = startOfDay(new Date(formValue.createdAt ?? ''));
    const endAt = startOfDay(new Date(formValue.endAt ?? ''));
    // Si ce n'est PAS ARCHIVE et PAS ACTIVE, on bloque si la date de début est avant aujourd'hui
    if (
      this.campagneToUpdate?.status !== 'DESACTIVE' &&
      this.campagneToUpdate?.status !== 'TERMINATE' &&
      this.campagneToUpdate?.status !== 'ACTIVE' &&
      this.#commonUtils.estAvant(createdAt, today)
    ) {
      // Swal.fire({
      //   toast: true,
      //   icon: 'error',
      //   title: "La date de début ne peut pas être antérieure à aujourd'hui",
      //   position: 'top-end',
      //   showConfirmButton: false,
      //   timer: 3500,
      //   timerProgressBar: true,
      // });
      this.ErrorMsg =
        "La date de début ne peut pas être antérieure à aujourd'hui";
      this.invalidDate = true;
      return;
    }
    // Vérification que la date de début n'est pas après la date de fin
    if (this.#commonUtils.estApres(createdAt, endAt)) {
      // Swal.fire({
      //   toast: true,
      //   icon: 'error',
      //   title: 'La date de début ne peut pas être postérieure à la date de fin',
      //   position: 'top-end',
      //   showConfirmButton: false,
      //   timer: 3500,
      //   timerProgressBar: true,
      // });
      this.ErrorMsg =
        'La date de début ne peut pas être postérieure à la date de fin';
      this.invalidDate = true;
      return;
    }

    const hasmissedFile = (
      formValue.applications as {
        id: number;
        name: string;
        File: File | null;
        existingFiles?: any[];
        isPreFilled?: boolean;
      }[]
    ).filter((app) => {
      // Une app doit avoir un fichier SI :
      // - Elle n'est PAS pré-remplie OU
      // - Elle est pré-remplie MAIS n'a pas de fichiers existants
      const hasNoFile = app.File === null;
      const hasNoExistingFiles =
        !app.existingFiles || app.existingFiles.length === 0;
      const isNotPreFilled = !app.isPreFilled;

      return hasNoFile && (isNotPreFilled || hasNoExistingFiles);
    });

    if (hasmissedFile.length) {
      const app = hasmissedFile.map((app) => app.name).join(', ');
      this.ErrorMsg = `Aucun fichier Excel n'a été chargé pour ${
        hasmissedFile.length > 1 ? 'les applications: ' : "l'application: "
      } ${app}. Pour continuer, vous devez sélectionner et charger un fichier contenant la liste des comptes`;
      this.invalidFile = true;
      return;
    }

    console.log('[Form]: ', formValue);
    const apps =
      (formValue.applications as {
        id: number;
        name: string;
        File: File;
        existingFiles?: any[];
      }[]) ?? [];

    // const infos = await Promise.all(
    //   apps.map(async (app) => {
    //     if (app.File) {
    //       // Nouveau fichier uploadé
    //       const fileBaseIn64 = await this.#commonUtils.fileToBase64(app.File);
    //       return {
    //         isNew: true,
    //         idApplication: app.id,
    //         fileName: fileBaseIn64.name,
    //         content: fileBaseIn64.base64,
    //       };
    //     } else if (app.existingFiles && app.existingFiles.length > 0) {
    //       // Utiliser les fichiers existants (pas de nouveau fichier uploadé)
    //       const mostRecentFileName = this.getMostRecentFileName(
    //         app.existingFiles
    //       );
    //       return {
    //         idApplication: app.id,
    //         fileName: mostRecentFileName, // Utiliser le nom du fichier le plus récent
    //         content: '', // Pas de nouveau contenu
    //         isNew: false,
    //         // Les fichiers existants restent en place côté backend
    //       };
    //     } else {
    //       // Aucun fichier
    //       return {
    //         idApplication: app.id,
    //         fileName: '',
    //         content: '',
    //       };
    //     }
    //   })
    // );
    const infos = await Promise.all(
      apps.map(
        async (app: {
          id: number;
          name: string;
          File: File | null;
          existingFiles?: any[];
          isPreFilled?: boolean;
        }) => {
          if (app.File) {
            // Nouveau fichier uploadé
            const fileBaseIn64 = await this.#commonUtils.fileToBase64(app.File);
            return {
              isNew: true,
              idApplication: app.id,
              fileName: fileBaseIn64.name,
              content: fileBaseIn64.base64,
            };
          } else if (app.existingFiles && app.existingFiles.length > 0) {
            // Utiliser les fichiers existants (cas pré-rempli)
            const mostRecentFileName = this.getMostRecentFileName(
              app.existingFiles
            );
            return {
              idApplication: app.id,
              fileName: mostRecentFileName,
              content: '',
              isNew: false,
            };
          } else {
            // Aucun fichier (ne devrait pas arriver après validation)
            return {
              idApplication: app.id,
              fileName: '',
              content: '',
              isNew: false,
            };
          }
        }
      )
    );

    let updateCampagneForm: CampagneModelForm = {
      data: {
        name: formValue?.name ?? '',
        startDate: formValue?.createdAt ?? '',
        estimatedEndDate: formValue?.endAt ?? '',
        infos,
      },
    };

    if (this.campagneToUpdate?.idCampaign) {
      this.#campagneService
        .updateCampagne(this.campagneToUpdate.idCampaign, updateCampagneForm)
        .subscribe({
          next: (Response) => {
            Swal.fire({
              toast: true,
              icon: 'success',
              title: 'Campagne mise à jour avec succès',
              position: 'top-end',
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true,
            });
            this.#campagneService.triggerRefreshCampagnes();
            this.#ngModal.dismissAll();
          },
          error: (error) => {
            console.error(
              'Erreur lors de la mise à jour de la campagne:',
              error
            );
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.selectedAppsControl$?.unsubscribe();
  }
}
