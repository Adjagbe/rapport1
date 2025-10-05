import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { Router } from '@angular/router';
import { AUTH_TEXT } from 'src/app/Core/Constants/auth.constant';
import { UsersService } from 'src/app/Core/Services/users.service';
import { ErrorMessageComponent } from 'src/app/Shared/Components/error-message/error-message.component';
import { ShowIconComponent } from 'src/app/Core/icons/show-icon.component';
import { HiddeIconComponent } from 'src/app/Core/icons/hidde-icon.component';

@Component({
  selector: 'reset-password-form',
  standalone: true,
  imports: [
    CommonModule,
    FormControlComponent,
    BtnGenericComponent,
    ReactiveFormsModule,
    ErrorMessageComponent,
    ShowIconComponent,
    HiddeIconComponent
  ],
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent {
    #router = inject(Router);
    #formBuilder = inject(FormBuilder);
    #userService = inject(UsersService)

    resetForm = this.#formBuilder.nonNullable.group({
      passwordUpdate: ['',Validators.required, ],
      passwordUpdateConfirm: ['',Validators.required]
    });

    login: string = localStorage.getItem('LOGIN_OTP') || '';
    AUTH_TEXT = AUTH_TEXT;
    showPassword = false;
    showPasswordConfirm = false;
    showPasswordNew = false;
    isSubmit = false;
    userLogin: string = '';
    showErrorMessage = false;
    errorMessage!: string;
    viewMessage = true;

    onLogin() {
    this.#router.navigateByUrl('/authentication/login');
    }

    onOtp() {
    this.#router.navigateByUrl('/authentication/otp');
    }
    onPageConnexion(){
      this.#router.navigateByUrl('/authentication')
    }

  //   togglePassword(event: any, type: 'current' | 'new' | 'confirm') {
  //   if (type === 'current') {
  //     this.showPassword = !this.showPassword;
  //   } else if (type === 'new') {
  //     this.showPasswordNew = !this.showPasswordNew;
  //   } else if (type === 'confirm') {
  //     this.showPasswordConfirm = !this.showPasswordConfirm;
  //   }
  // }

  ngOnInit(){
    this.resetForm.valueChanges.subscribe(() => {
      this.showErrorMessage = false;
    });
  }



  togglePasswordNew(event: void) {
    this.showPasswordNew = !this.showPasswordNew;
  }

  togglePasswordConfirm(event: void) {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }
  submit() {
    this.isSubmit = true;
    const passwordControl = this.resetForm.get('passwordUpdate');
    const minLength = passwordControl?.errors?.['minLength'];
    const complexityErrors = passwordControl?.errors?.['complexity'];
    const passwordsDontMatch = this.resetForm.errors?.['passwordsDontMatch'];
    
    // MinLength error
    if (minLength) {
      // this.#toastService.mixin(
      //   'Utiliser une longueur minimale de 8 caractères',
      //   'error'
      // );
       this.errorMessage = 'Utiliser une longueur minimale de 8 caractères'
       this.showErrorMessage = true
      this.isSubmit = false;
      return;
    }
    // Complexity errors
    if (complexityErrors) {
      if (!complexityErrors.hasLowerCase) {
        // this.#toastService.mixin(
        //   'Le mot de passe doit contenir au moins une minuscule',
        //   'error'
        // );
        this.errorMessage = 'Le mot de passe doit contenir au moins une minuscule'
       this.showErrorMessage = true
        this.isSubmit = false;
        return;
      }

      if (!complexityErrors.hasUpperCase) {
        // this.#toastService.mixin(
        //   'Le mot de passe doit contenir au moins une majuscule',
        //   'error'
        // );
        this.errorMessage = 'Le mot de passe doit contenir au moins une majuscule'
       this.showErrorMessage = true
        this.isSubmit = false;
        return;
      }

      if (!complexityErrors.hasNumber) {
        // this.#toastService.mixin(
        //   'Le mot de passe doit contenir au moins un chiffre',
        //   'error'
        // );
        this.errorMessage = 'Le mot de passe doit contenir au moins un chiffre'
       this.showErrorMessage = true
        this.isSubmit = false;
        return;
      }

      if (!complexityErrors.hasSymbol) {
        // this.#toastService.mixin(
        //   'Le mot de passe doit contenir au moins un symbole',
        //   'error'
        // );
        this.errorMessage = 'Le mot de passe doit contenir au moins un symbole'
       this.showErrorMessage = true
        this.isSubmit = false;
        return;
      }
    }
    // Passwords match error (from FormGroup)
    if (passwordsDontMatch) {
      // this.#toastService.mixin(
      //   'Les mots de passe ne correspondent pas',
      //   'error'
      // );
      this.errorMessage = 'Les mots de passe ne correspondent pas'
       this.showErrorMessage = true
      this.isSubmit = false;
      return;
    }
  if (this.resetForm.valid) {
      const updatePasswordData = this.resetForm.value as {passwordUpdate : string, passwordUpdateConfirm : string};
      this.#userService.updatePassword({...updatePasswordData, login: this.login}).subscribe({
        next: (user) => {
          if (user.hasError) {
            this.errorMessage = user.status.message;
            this.showErrorMessage = true
            this.isSubmit = false;
            return;
          } else {
          localStorage.removeItem('LOGIN_OTP')
          this.#router.navigateByUrl('/authentication/login');
          this.isSubmit = false
          }
        },
        error: (err) => {
          console.error("Erreur de connexion :", err.message);
          this.isSubmit = false
        }
      });
  
    } else {
      this.resetForm.markAllAsTouched();
      // this.#toastService.mixin("veuillez remplir les deux champs", 'error')
      this.errorMessage = 'Veuillez remplir les deux champs'
      this.showErrorMessage = true
      console.error("Formulaire invalide !");
      this.isSubmit = false
    }
  }
}
