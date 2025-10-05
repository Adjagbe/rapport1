import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ParametrageService } from 'src/app/Core/Services/Parametrage/parametrage.service';
import Swal from 'sweetalert2';
import { CloseIconComponent } from 'src/app/Core/icons';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { LoaderService } from 'src/app/Core/Services/loader.service';

@Component({
  selector: 'app-gestion-reponse-manage',
  standalone: true,
  imports: [
    CommonModule,
    FormControlComponent,
    ReactiveFormsModule,
    CloseIconComponent,
    BtnGenericComponent,
    FormControlComponent,
  ],
  templateUrl: './gestion-reponse-manage.component.html',
  styleUrls: ['./gestion-reponse-manage.component.scss'],
})
export class GestionReponseManageComponent {
  #modalActive = inject(NgbActiveModal);
  #router = inject(Router);
  #formBuilder = inject(FormBuilder);
  #QuestionService = inject(ParametrageService);
  isSubmit = false;
  #loaderService = inject(LoaderService);

  @Input() reponseId: any;
  @Output() refreshTable = new EventEmitter<void>();

  btnSubmitText: 'Ajouter une reponse' | 'Modification de la reponse' =
    'Ajouter une reponse';

  newOptionReponseFormulaire = this.#formBuilder.nonNullable.group({
    optionText: ['', Validators.required ],
    optionValue: ['', Validators.required],
  });

  ngOnInit() {
    const currentReponseId = this.reponseId;
    if (currentReponseId) {
      this.getReponseById(currentReponseId);
      this.btnSubmitText = 'Modification de la reponse';
    } else {
      this.btnSubmitText = 'Ajouter une reponse';
    }
  }

  getReponseById(id: string) {
    this.#QuestionService
      .getListR(
        {
          size: ``,
          index: ``,
          id: id,
        },
        false
      )
      .subscribe({
        next: (listResponse) => {
          const { items, count } = listResponse;
          this.newOptionReponseFormulaire.patchValue({
            optionText: items[0].optionText,
            optionValue: items[0].optionValue,
          });
        },
      });
  }

  CreateOrUpdateReponse() {
    this.#loaderService.show();
    this.reponseId == null ? this.createNewReponse() : this.updateNewReponse();
  }

  createNewReponse() {
    let ReponseText = {
      optionText: this.newOptionReponseFormulaire.value.optionText?.trim(),
      optionValue: this.newOptionReponseFormulaire.value.optionText?.trim(),
    };

    this.isSubmit = true;

    if (this.newOptionReponseFormulaire.value.optionText?.trim() !== '' && this.newOptionReponseFormulaire.get('optionText')?.valid) {
      this.#QuestionService.createResponse(ReponseText).subscribe({
        next: (reqResponse) => {
          this.isSubmit = false;
          if (reqResponse && reqResponse.status.code == '904') {
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
              title: 'La reponse a été créée avec succès.',
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.refreshTable.emit();
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

  //Pas d'espace vide dans le champ de saisie
  noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  updateNewReponse() {
    let ReponseText = {
      idOptionTemplate: this.reponseId,
      optionText: this.newOptionReponseFormulaire.value.optionText,
      optionValue: this.newOptionReponseFormulaire.value.optionText,
    };
    if (this.newOptionReponseFormulaire.get('optionText')?.valid) {
      this.#QuestionService.updateReponseG(ReponseText).subscribe({
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
            this.refreshTable.emit();
            this.#loaderService.hide();
            this.close();
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

  close() {
    this.#modalActive.dismiss();
    this.newOptionReponseFormulaire.reset();
    // this.refreshTable.emit()
    this.#router.navigate(['/parametrage/questionnaires/gestion_des_reponses']);
    // this.#modalService.off();
  }
}
