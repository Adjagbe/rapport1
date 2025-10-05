import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextareaControlComponent } from 'src/app/Shared/Components/textarea-control/textarea-control.component';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParametrageService } from 'src/app/Core/Services/Parametrage/parametrage.service';
import Swal from 'sweetalert2';
import { CloseIconComponent } from 'src/app/Core/icons';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { LoaderService } from 'src/app/Core/Services/loader.service';

@Component({
  selector: 'direction-manage',
  standalone: true,
  imports: [
    CommonModule,
    TextareaControlComponent,
    ReactiveFormsModule,
    FormControlComponent,
    CloseIconComponent,
    BtnGenericComponent,
  ],
  templateUrl: './direction-manage.component.html',
  styleUrls: ['./direction-manage.component.scss'],
})
export class DirectionManageComponent {
  @Input() directionId: any;
  #modalActive = inject(NgbActiveModal);
  #router = inject(Router);
  #formBuilder = inject(FormBuilder);
  btnSubmitText: 'Ajouter une direction' | 'Modification de la direction' =
    'Ajouter une direction';
  #DirectionService = inject(ParametrageService);
  isSubmit = false;
  #loaderService = inject(LoaderService);

  newDirectionFormulaire = this.#formBuilder.nonNullable.group({
    name: ['', Validators.required, this.noWhiteSpaceValidator],
    description: ['', Validators.required, this.noWhiteSpaceValidator],
    isActive: [true],
  });

  ngOnInit() {
    const currentDirectionId = this.directionId;
    if (currentDirectionId) {
      this.getDirectionById(currentDirectionId);
      this.btnSubmitText = 'Modification de la direction';
    } else {
      this.btnSubmitText = 'Ajouter une direction';
    }
  }

  changeStatusAction(items: string) {
    if (items == 'true') {
      this.newDirectionFormulaire.patchValue({
        isActive: true,
      });
    } else {
      this.newDirectionFormulaire.patchValue({
        isActive: false,
      });
    }
  }

  CreateOrUpdateDirection() {
    this.#loaderService.show();
    this.directionId == null ? this.CreateDirection() : this.UpdateDirection();
  }

  viewBtnRefreshCode: boolean = false;

  CreateDirection() {
    let DirectionData = {
      name: this.newDirectionFormulaire.value.name?.trim(),
      description: this.newDirectionFormulaire.value.description?.trim(),
      isActive: this.newDirectionFormulaire.value.isActive,
    };

    this.isSubmit = true;

    if (this.newDirectionFormulaire.valid) {
      this.#DirectionService.createDirection(DirectionData).subscribe({
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
          } else if (!reqResponse.hasError) {
            Swal.fire({
              toast: true,
              icon: 'success',
              title: 'La direction a été créée avec succès.',
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
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

  getDirectionById(id: string) {
    this.#DirectionService
      .getListDirection(
        {
          size: ``,
          index: ``,
          id: id,
        },
        false
      )
      .subscribe({
        next: (listDirectionResponse) => {
          const { items, count } = listDirectionResponse;
          this.newDirectionFormulaire.patchValue({
            name: items[0].name,
            description: items[0].description,
            isActive: items[0].isActive,
          });
        },
      });
  }

  UpdateDirection() {
    let DirectionData = {
      idDepartment: this.directionId,
      name: this.newDirectionFormulaire.value.name,
      description: this.newDirectionFormulaire.value.description,
      isActive: this.newDirectionFormulaire.value.isActive,
    };
    this.isSubmit = true;
    if (this.newDirectionFormulaire.valid) {
      this.#DirectionService.updateDirection(DirectionData).subscribe({
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

  //Pas d'espace vide dans le champ de saisie
  noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  close() {
    console.log('Fin');
    this.#modalActive.close();
    this.newDirectionFormulaire.reset();
    this.#router.navigate(['/parametrage/directions']);
  }
}
