import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalLayoutComponent } from 'src/app/Core/layouts/modal-layout/modal-layout.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { TextareaControlComponent } from 'src/app/Shared/Components/textarea-control/textarea-control.component';
import { CloseIconComponent } from 'src/app/Core/icons';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ParametrageService } from 'src/app/Core/Services/Parametrage/parametrage.service';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/Core/Services/loader.service';

@Component({
  selector: 'plateforme-manage',
  standalone: true,
  imports: [
    CommonModule,
    CloseIconComponent,
    ReactiveFormsModule,
    BtnGenericComponent,
    FormControlComponent,
    TextareaControlComponent,
  ],
  templateUrl: './plateforme-manage.component.html',
  styleUrls: ['./plateforme-manage.component.scss'],
})
export class PlateformeManageComponent {
  @Input() plateformeId: any;

  #modalActive = inject(NgbActiveModal);
  #router = inject(Router);
  #formBuilder = inject(FormBuilder);
  btnSubmitText: 'Ajouter une plateforme' | 'Modification de la plateforme' =
    'Ajouter une plateforme';
  #ApplicationService = inject(ParametrageService);
  isSubmit = false;
  #loaderService = inject(LoaderService);

  newApplicationFormulaire = this.#formBuilder.nonNullable.group({
    name: ['', Validators.required, this.noWhiteSpaceValidator],
    description: ['', Validators.required, this.noWhiteSpaceValidator],
    isActive: [true],
  });

  ngOnInit() {
    const currentPlateformeId = this.plateformeId;
    if (currentPlateformeId) {
      this.getPlateformeById(currentPlateformeId);
      this.btnSubmitText = 'Modification de la plateforme';
    } else {
      this.btnSubmitText = 'Ajouter une plateforme';
    }
  }

  changeStatusAction(items: string) {
    if (items == 'true') {
      this.newApplicationFormulaire.patchValue({
        isActive: true,
      });
    } else {
      this.newApplicationFormulaire.patchValue({
        isActive: false,
      });
    }
  }

  CreateOrUpdateApplication() {
    this.#loaderService.show();
    this.plateformeId == null
      ? this.CreateApplication()
      : this.UpdateApplication();
  }

  viewBtnRefreshCode: boolean = false;

  CreateApplication() {
    let ApplicationData = {
      name: this.newApplicationFormulaire.value.name?.trim(),
      description: this.newApplicationFormulaire.value.description?.trim(),
      isActive: this.newApplicationFormulaire.value.isActive,
    };

    this.isSubmit = true;

    if (this.newApplicationFormulaire.valid) {
      this.#ApplicationService.createPlateforme(ApplicationData).subscribe({
        next: (reqResponse) => {
          this.isSubmit = false;
          if (reqResponse && reqResponse.status.code == '904') {
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
            this.#loaderService.hide();
            this.close();
          } else if (!reqResponse.hasError) {
            Swal.fire({
              toast: true,
              icon: 'success',
              title: 'La plateforme a été créée avec succès.',
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.#loaderService.hide();
            this.close();
          } else return;
        },
        error: (error) => {
          this.isSubmit = false;
          console.error(error);
        },
      });
    } else {
      Swal.fire({
        toast: true,
        icon: 'error',
        title:
          'Les champs sont invalides ou vide, veuillez les remplir correctement.',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      this.#loaderService.hide();
    }
  }

  getPlateformeById(id: string) {
    this.#ApplicationService
      .getListPlateforme(
        {
          size: ``,
          index: ``,
          id: id,
        },
        false
      )
      .subscribe({
        next: (listPlateformeResponse) => {
          const { items, count } = listPlateformeResponse;
          this.newApplicationFormulaire.patchValue({
            name: items[0].name,
            description: items[0].description,
            isActive: items[0].isActive,
          });
        },
      });
  }

  UpdateApplication() {
    let ApplicationData = {
      idApplication: this.plateformeId,
      name: this.newApplicationFormulaire.value.name,
      description: this.newApplicationFormulaire.value.description,
      isActive: this.newApplicationFormulaire.value.isActive,
    };
    this.isSubmit = true;

    if (this.newApplicationFormulaire.valid) {
      this.#ApplicationService.updatePlateforme(ApplicationData).subscribe({
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
            this.close();
            this.#loaderService.hide();
          } else return;
        },
        error: (error) => {
          this.isSubmit = false;
          console.error(error);
          this.#loaderService.hide();
        },
      });
    } else {
      Swal.fire({
        toast: true,
        icon: 'error',
        title:
          'Les champs sont invalides ou vide, veuillez les remplir correctement.',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      this.#loaderService.hide();
    }
  }

  //Pas d'espace vide dans le champ de saisie
  noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  close() {
    console.log('Fin');
    this.#modalActive.close();
    this.newApplicationFormulaire.reset();
    this.#router.navigate(['/parametrage/plateformes']);
  }
}
