import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  ERROR_MSG,
  ONLYEXCELFILE,
  EXPECTED_USER_COLUMNS,
} from 'src/app/Core/Constants/gestion-campagnes.constant';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';
import { ApplicationService } from 'src/app/Core/Services/application.service';
import { CampagneModelForm } from 'src/app/Models/gestion-campagnes.model';
import { GestionCampagnesService } from 'src/app/Core/Services/gestion-campagnes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { startOfDay } from 'date-fns';
import { FormsUtils } from 'src/app/Core/Utility/forms.utils';
import { FilePreviewModalComponent } from 'src/app/Shared/file-preview-modal/file-preview-modal.component';
import { ReloadIconComponent } from 'src/app/Core/icons/reload-icon.component';
import {
  NgbDatepickerModule,
  NgbDateAdapter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateISOAdapter } from 'src/app/Core/Utility/ngb-date-iso-adapter';
import { CustomValidatorsUtils } from 'src/app/Core/Utility/custom-validators.utils';
import { ErrorMessageComponent } from 'src/app/Shared/Components/error-message/error-message.component';
import { ArrowUpIconComponent, PreviewIconComponent } from 'src/app/Core/icons';

@Component({
  selector: 'app-create-campagne-form',
  standalone: true,
  imports: [
    CommonModule,
    ModalLayoutComponent,
    FormControlComponent,
    BtnGenericComponent,
    ReactiveFormsModule,
    SelectedAppCardComponent,
    BtnGenericComponent,
    DownloadIconComponent,
    CloseIconBtnComponent,
    ValidIconComponent,
    SearchIconComponent,
    NgSelectModule,
    ReloadIconComponent,
    NgbDatepickerModule,
    ErrorMessageComponent,
    PreviewIconComponent,
  ],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateISOAdapter }],
  templateUrl: './create-campagne-form.component.html',
  styleUrls: ['./create-campagne-form.component.scss'],
})
export class CreateCampagneFormComponent implements OnInit, OnDestroy {
  #fb = inject(FormBuilder);
  #commonUtils = inject(CommonUtils);
  #applicationsService = inject(ApplicationService);
  #campagneService = inject(GestionCampagnesService);
  #ngModal = inject(NgbModal);
  FormsUtils = inject(FormsUtils);
  #validators = inject(CustomValidatorsUtils);

  @ViewChild('campagneName') campagneName!: ElementRef<HTMLInputElement>;

  ErrorMsg = ERROR_MSG;
  readonly onlyExcelFile = ONLYEXCELFILE;
  appSugestionsList: { label: string; value: number }[] = [];
  appList: Array<{}> | null = null;
  selectedApps: number[] = [];

  // Date minimale autorisée pour la date de début (aujourd'hui)
  minCreatedAt: string = this.#commonUtils.formatDateForInput(new Date());
  minDate: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  showErrorMsg = false;
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
  nameCtrl = this.campagneForm.get('name') as AbstractControl;
  createdAtCtrl = this.campagneForm.get('createdAt') as AbstractControl;
  endAtCtrl = this.campagneForm.get('endAt') as AbstractControl;
  applicationsArray = this.campagneForm.get('applications') as FormArray;

  ngOnInit() {
    this.#listenSelectedAppControl();
    this.#getApplication();
  }

  cancel(e: Event) {
    e.stopPropagation();
    this.#ngModal.dismissAll();
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

  #listenSelectedAppControl() {
    this.selectedAppsControl$ = this.selectedAppsControl.valueChanges.subscribe(
      (appIds) => {
        const formArray = this.applicationsArray;
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
              this.#fb.group({ id, name: app?.label ?? '', File: [null] })
            );
          }
        });
      }
    );
  }

  invalidFie = false;
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
        this.invalidFie = true;
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
        this.invalidFie = true;
        // reset input et form control
        input.value = '';
        ctrl.patchValue({ File: null });
        return;
      }

      // Fichier valide - masquer le message d'erreur
      this.invalidFie = false;

      ctrl.patchValue({ File: file });
    } catch (err) {
      this.ErrorMsg =
        'Lecture du fichier impossible. Veuillez vérifier le format du fichier (xls/xlsx/csv).';
      this.invalidFie = true;
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
    ctrl.patchValue({ File: null });
  }
  invalidDate = false;
  async onSub() {
    if (this.campagneForm.invalid) {
      this.campagneForm.markAllAsTouched();
      this.campagneForm.get('name')?.markAsDirty();
      this.showErrorMsg = true;
      this.ErrorMsg = ERROR_MSG;
      // Swal.fire({
      //   toast: true,
      //   icon: 'error',
      //   title: 'Veuillez corriger les erreurs du formulaire',
      //   position: 'top-end',
      //   showConfirmButton: false,
      //   timer: 3000,
      //   timerProgressBar: true,
      // });
      return;
    }
    const formValue = this.campagneForm.value;
    // Vérification de la date de début (doit être >= aujourd'hui)
    const today = startOfDay(new Date());
    const createdAt = startOfDay(new Date(formValue.createdAt ?? ''));
    const endAt = startOfDay(new Date(formValue.endAt ?? ''));
    // On refuse seulement si la date est STRICTEMENT avant aujourd'hui
    if (this.#commonUtils.estAvant(createdAt, today)) {
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

    console.log('[Before error]: ', formValue.applications);
    const hasmissedFile = (
      formValue.applications as { id: number; name: string; File: File }[]
    ).filter((app) => app.File === null);
    if (hasmissedFile.length) {
      const app = hasmissedFile.map((app) => app.name).join(', ');
      this.ErrorMsg = `Aucun fichier Excel n'a été chargé pour ${
        hasmissedFile.length > 1 ? 'les applications: ' : "l'application: "
      } ${app}. Pour continuer, vous devez sélectionner et charger un fichier contenant la liste des comptes`;
      this.invalidFie = true;
      return;
    }
    const apps =
      (formValue.applications as { id: number; name: string; File: File }[]) ??
      [];
    console.log('[Form]: ', formValue);
    const infos = await Promise.all(
      apps.map(async (app) => {
        const fileBaseIn64 = await this.#commonUtils.fileToBase64(app.File);
        return {
          idApplication: app.id,
          fileName: fileBaseIn64.name,
          content: fileBaseIn64.base64,
        };
      })
    );
    let createCampagneForm: CampagneModelForm = {
      data: {
        name: formValue?.name ?? '',
        startDate: formValue?.createdAt ?? '',
        estimatedEndDate: formValue?.endAt ?? '',
        infos,
      },
    };
    this.#campagneService.createCampagne(createCampagneForm).subscribe({
      next: (Response) => {
        Swal.fire({
          toast: true,
          icon: 'success',
          title: 'Campagne créée avec succès',
          position: 'top-end',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
        this.#campagneService.triggerRefreshCampagnes();
        this.#ngModal.dismissAll();
      },
      error: (error) => {
        Swal.fire({
          toast: true,
          icon: 'error',
          title: 'Échec de la création',
          text: 'Une erreur est survenue lors de la création de la campagne. Veuillez réessayer.',
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      },
    });
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
      size: 'xl', // au lieu de 'lg'
    });
    modalRef.componentInstance.columns = columns;
    modalRef.componentInstance.datas = datas;
  }

  ngOnDestroy(): void {
    this.selectedAppsControl$?.unsubscribe();
  }
}
