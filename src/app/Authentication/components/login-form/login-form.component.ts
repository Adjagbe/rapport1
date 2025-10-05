import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { SwitchControlComponent } from 'src/app/Shared/Components/switch-control/switch-control.component';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UsersService } from 'src/app/Core/Services/users.service';
import { ErrorMessageComponent } from 'src/app/Shared/Components/error-message/error-message.component';
import { Subscription } from 'rxjs';
import { ShowIconComponent } from 'src/app/Core/icons/show-icon.component';
import { HiddeIconComponent } from 'src/app/Core/icons/hidde-icon.component';

@Component({
  selector: 'login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormControlComponent,
    SwitchControlComponent,
    BtnGenericComponent,
    ReactiveFormsModule,
    RouterLink,
    ErrorMessageComponent,
    ShowIconComponent,
    HiddeIconComponent,
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  #router = inject(Router);
  #formBuilder = inject(FormBuilder);
  #connexionService = inject(UsersService);
  loginForm = this.#formBuilder.nonNullable.group({
    login: ['', [Validators.required, this.noWhiteSpaceValidator]],
    password: ['', Validators.required],
  });

  isLdap = true;
  isSubmit = false;
  showErrorMessage = false;
  errorMessage!: string;
  showPassword = false;

  loginForm$!: Subscription;
  // onLogin() {
  //   this.#router.navigateByUrl('dashboard');
  // }

  // ngOnDestroy(): void {
  //   this.loginForm$.unsubscribe();
  // }

  ngOnInit(): void {
    // Dès que login ou password change, on masque le message d'erreur
    this.loginForm.valueChanges.subscribe(() => {
      this.showErrorMessage = false;
    });

    this.Exixtevalue();
  }

  @ViewChild('loginInput') loginInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    this.loginInput.nativeElement.focus();
  }

  Exixtevalue() {
    if (this.loginForm) {
      this.isSubmit = false;
    }
  }

  togglePassword(event: void) {
    this.showPassword = !this.showPassword;
  }

  //Pas d'espace vide dans le champ de saisie du login
  noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  onLogin() {
    // Nettoyage des espaces dans le champ de saisie du login
    const loginValue = (this.loginForm.get('login')?.value || '').trim();
    this.loginForm.get('login')?.setValue(loginValue);

    this.showErrorMessage = false;
    this.isSubmit = true;

    if (this.loginForm.valid) {
      // this.#router.navigateByUrl('dashboard');
      const loginData: any = {... this.loginForm.value, isLdap : this.isLdap }
      // const isLdap = this.loginForm.get('Ldap')?.value || false; // Récupération de la valeur de isLdap
      // Appel du service d'authentification
      this.#connexionService.connexion(loginData).subscribe({
        next: (user: any) => {
          if (user == true) {
            // this.#connexionService.login.next(user.login);        // met à jour le BehaviorSubject
            this.#router.navigate(['/authentication', 'reset-password']);
            this.isSubmit = false;
            // console.log("voilà le login du nouvel user qui veut se connecter : ", user.login);
          } else if (user == '936') {
            this.#router.navigate(['/authentication', 'reset-password']);
            this.isSubmit = false;
          } else if (user.status ? user.status?.code !== '800' : false) {
            this.errorMessage = user?.status.message;
            this.showErrorMessage = true;
            this.isSubmit = false;
          } else {
            // const test = this.#connexionService.getMenusActionsUser()
            // this.viewListeActions =  (val: any) => test?.findIndex((elt: { code: any; }) => elt.code === val) > -1;

            // if(this.viewListeActions('DASHBOARD')){
            //   this.#router.navigate(["/dashboard"]);
            // } else if(this.viewListeActions('SINISTRE')){
            //   this.#router.navigate(["/sinistre"]);
            // } else if(this.viewListeActions('AVP')){
            //   this.#router.navigate(["/avp"]);
            // } else if(this.viewListeActions('OPEX')){
            //   this.#router.navigate(["/opex"]);
            // } else if(this.viewListeActions('ADMINISTRATION')){
            //   this.#router.navigate(["/administration"]);
            // }
            this.#router.navigateByUrl('dashboard');
            this.isSubmit = false;
          }
        },
        error: (err) => {
          console.error('Erreur de connexion :', err.message);
          this.isSubmit = false;
        },
      });
    } else {
      this.errorMessage = 'Veuillez remplir les champs correctement!'
      this.showErrorMessage = true;
      this.isSubmit = false;
      console.error('Formulaire invalide !');
    }
  }
}
