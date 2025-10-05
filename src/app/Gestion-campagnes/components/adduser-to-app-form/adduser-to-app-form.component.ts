import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  Input,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { map } from 'rxjs';

import { CloudIconComponent } from 'src/app/Core/icons/cloud-icon.component';
import { ModalLayoutComponent } from 'src/app/Core/layouts/modal-layout/modal-layout.component';
import { GestionCampagnesService } from 'src/app/Core/Services/gestion-campagnes.service';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';
import {
  ERROR_MSG,
  EXPECTED_USER_COLUMNS,
} from 'src/app/Core/Constants/gestion-campagnes.constant';

import { CampagneDetails } from 'src/app/Models/gestion-campagnes.model';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { UploadPreviewCardComponent } from 'src/app/Shared/Components/upload-preview-card/upload-preview-card.component';
import Swal from 'sweetalert2';
import { ErrorMessageComponent } from 'src/app/Shared/Components/error-message/error-message.component';

@Component({
  selector: 'app-adduser-to-app-form',
  templateUrl: './adduser-to-app-form.component.html',
  styleUrls: ['./adduser-to-app-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    FormControlComponent,
    ModalLayoutComponent,
    ReactiveFormsModule,
    BtnGenericComponent,
    CloudIconComponent,
    UploadPreviewCardComponent,
    ErrorMessageComponent,
  ],
})
export class AdduserToAppFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() selectedAppId?: number;
  @Input() campagneId?: number;
  @Input() mode: 'ADD' | 'REPLACE' = 'ADD';
  #route = inject(ActivatedRoute);
  #campagneService = inject(GestionCampagnesService);
  #commonUtils = inject(CommonUtils);
  #fb = inject(FormBuilder);
  #ngModal = inject(NgbModal);

  applications: Array<{ label: string; value: number }> | null = null;
  campagne: CampagneDetails | null = null;
  isDragOver = false;
  selectedFile: File | null = null;

  ErrorMsg = ERROR_MSG;
  showErrorMsg = false;

  form!: FormGroup<{
    application: FormControl<number | null>;
    file: FormControl<File | null>;
  }>;

  constructor() {}

  ngOnInit(): void {
    this.form = this.#fb.group({
      application: this.#fb.control<number | null>(null, Validators.required),
      file: this.#fb.control<File | null>(null, Validators.required),
    });

    // Écouter les changements du formulaire pour masquer automatiquement les erreurs
    this.form.statusChanges.subscribe(() => {
      if (this.form.valid) {
        this.showErrorMsg = false;
      }
    });

    const campagneId =
      this.campagneId ?? this.#route.snapshot.queryParamMap.get('campagne');
    if (campagneId) {
      this.#campagneService
        .getCampagneDetails(+campagneId)
        .pipe(map((campagneDetails) => campagneDetails))
        .subscribe({
          next: (campagne) => {
            this.campagne = campagne;
            const apps = campagne.applicationDetails;
            this.applications = apps.map((app) => ({
              label: app.applicationName,
              value: app.applicationId,
            }));
            if (this.selectedAppId) {
              this.form.get('application')?.setValue(this.selectedAppId);
              this.form.get('application')?.disable();
            }
          },
          error: (error) => {},
        });
    }
  }

  onFileUpload() {
    this.fileInput.nativeElement.click();
  }

  async onFileChanged() {
    const file = this.fileInput?.nativeElement.files?.[0] ?? null;
    if (!file) return;

    try {
      const headers = await this.#commonUtils.readExcelHeaders(file);
      const result = this.#commonUtils.compareColumns(
        EXPECTED_USER_COLUMNS,
        headers
      );

      if (!result.valid) {
        this.ErrorMsg = `Les colonnes attendues ne sont pas respectées. Colonnes manquantes : ${
          result.missing.join(', ') || 'Aucune'
        }`;
        this.showErrorMsg = true;
        // reset input et form control
        this.fileInput.nativeElement.value = '';
        this.selectedFile = null;
        this.form.get('file')?.setValue(null);
        return;
      }

      // Fichier valide - masquer le message d'erreur
      this.showErrorMsg = false;
      this.selectedFile = file;
      this.form.get('file')?.setValue(file);
      this.form.get('file')?.markAsDirty();
      this.form.get('file')?.updateValueAndValidity();
    } catch (err) {
      this.ErrorMsg =
        'Lecture du fichier impossible. Veuillez vérifier le format du fichier (xls/xlsx/csv).';
      this.showErrorMsg = true;
      this.fileInput.nativeElement.value = '';
      this.selectedFile = null;
      this.form.get('file')?.setValue(null);
    }
  }

  heandleRemove() {
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
    this.form.get('file')?.setValue(null);
    this.form.get('file')?.markAsDirty();
    this.form.get('file')?.updateValueAndValidity();

    // Masquer le message d'erreur si le formulaire devient valide
    if (this.form.valid) {
      this.showErrorMsg = false;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];

      try {
        const headers = await this.#commonUtils.readExcelHeaders(file);
        const result = this.#commonUtils.compareColumns(
          EXPECTED_USER_COLUMNS,
          headers
        );

        if (!result.valid) {
          this.ErrorMsg = `Les colonnes attendues ne sont pas respectées. Colonnes manquantes : ${
            result.missing.join(', ') || 'Aucune'
          }`;
          this.showErrorMsg = true;
          return;
        }

        // Fichier valide - masquer le message d'erreur
        this.showErrorMsg = false;
        this.fileInput.nativeElement.files = event.dataTransfer.files;
        this.selectedFile = file;
        this.form.get('file')?.setValue(file);
        this.form.get('file')?.markAsDirty();
        this.form.get('file')?.updateValueAndValidity();
      } catch (err) {
        this.ErrorMsg =
          'Lecture du fichier impossible. Veuillez vérifier le format du fichier (xls/xlsx/csv).';
        this.showErrorMsg = true;
      }
    }
  }

  buildPayload(
    fileBase64: { name: string; base64: string; type: string },
    idApplication: number
  ) {
    return {
      data: {
        action: this.mode,
        idApplication: idApplication,
        idCampaign: this.campagne!.campaignId,
        fileName: fileBase64.name,
        content: fileBase64.base64,
      },
    };
  }

  doRequest(payload: any) {
    const request$ =
      this.mode === 'REPLACE'
        ? this.#campagneService.replaceUsersToCampaignApplication(payload)
        : this.#campagneService.addUsersToCampaignApplication(payload);
    request$.subscribe({
      next: (res) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          icon: 'success',
          title: 'Succès',
          text: 'Utilisateurs importés avec succès',
        });
        this.form.reset();
        this.#ngModal.dismissAll();
        this.#campagneService.triggerRefreshCampagneDetails();
      },
      error: (error) => {
        this.ErrorMsg = "Erreur lors de l'importation des utilisateurs";
        this.showErrorMsg = true;
      },
    });
  }

  async onSubmit() {
    if (this.form.valid && this.campagne) {
      const file = this.form.value.file;
      let fileBase64: { name: string; base64: string; type: string } | null =
        null;
      if (file) {
        fileBase64 = await this.#commonUtils.fileToBase64(file);
      }
      const idApplication = this.selectedAppId as number;
      const payload = this.buildPayload(fileBase64!, idApplication);
      this.doRequest(payload);
    } else {
      this.form.markAllAsTouched();
      this.showErrorMsg = true;
      this.ErrorMsg = ERROR_MSG;
    }
  }

  cancel() {
    this.#ngModal.dismissAll();
  }

  get selectedAppLabel(): string {
    if (!this.selectedAppId || !this.applications) return '';
    const found = this.applications.find(
      (app) => app.value === this.selectedAppId
    );
    return found ? found.label : '';
  }
}
