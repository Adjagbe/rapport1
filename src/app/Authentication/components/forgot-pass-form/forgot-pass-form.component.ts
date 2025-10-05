import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/Core/Services/users.service';
import { ErrorMessageComponent } from 'src/app/Shared/Components/error-message/error-message.component';
import { NavigationRouteService } from 'src/app/Core/Services/navigation-route/navigation-route.service';

@Component({
  selector: 'forgot-pass-form',
  standalone: true,
  imports: [
    CommonModule,
    FormControlComponent,
    BtnGenericComponent,
    ReactiveFormsModule,
    ErrorMessageComponent,
  ],
  templateUrl: './forgot-pass-form.component.html',
  styleUrls: ['./forgot-pass-form.component.scss'],
})
export class ForgotPassFormComponent implements OnInit {
  #router = inject(Router);
  #formBuilder = inject(FormBuilder);
  #userService = inject(UsersService);
  login$ = this.#userService.login$;
  forgotForm = this.#formBuilder.nonNullable.group({
    login: ['', [Validators.required, this.noWhiteSpaceValidator]],
  });
  isSubmit: boolean = false;

  showErrorMessage = false;
  errorMessage: string = '';
  ngOnInit(): void {
    // this.login$.subscribe({
    //   next: (login) => {
    //     this.forgotForm.get('login')?.setValue(login);
    //   },
    // });
    // const previous = this.navigationService.lastRoute;
    // if (previous === '/authentication/otp') {
    //   // Injecter le login depuis localStorage
    //   const savedLogin = localStorage.getItem('LOGIN_OTP') || '';
    //   this.forgotForm.get('login')?.setValue(savedLogin);
    // } else {
    //   // Effacer le champ si on vient d'ailleurs
    //   this.forgotForm.reset();
    // }

    this.forgotForm.valueChanges.subscribe(() => {
      this.showErrorMessage = false;
    });
  }
  
  @ViewChild('loginInput') loginInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    this.loginInput.nativeElement.focus();
  }

  constructor(private navigationService: NavigationRouteService) {}

  //Pas d'espace vide dans le champ de saisie du login
  noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  // onSubmit() {

  //   // Nettoyage des espaces dans le champ de saisie du login
  //   const loginValue = (this.forgotForm.get('login')?.value || '').trim();
  //   this.forgotForm.get('login')?.setValue(loginValue);

  //   this.showErrorMessage = false;
  //   console.log(this.forgotForm.value);
  //   this.isSubmit = true;

  //   if (this.forgotForm.valid) {
  //     const loginData = this.forgotForm.value as { login: string };
  //     this.#userService.forgetPassword(loginData).subscribe({
  //       next: (response) => {
  //         // Stocker le login dans le localStorage
  //         if (!response.hasError) {
  //           localStorage.removeItem('LOGIN_OTP');
  //           localStorage.setItem('LOGIN_OTP', loginData.login);
  //           localStorage.removeItem('OTP_MESSAGE');
  //           localStorage.setItem('OTP_MESSAGE', response?.status.message);
  //           // this.#router.navigate(['authentification', 'confirm-otp']);
  //           this.#router.navigateByUrl('/authentication/otp');
  //           const expirationTimestamp = Date.now() + 120 * 1000; // 3 minutes
  //           localStorage.setItem(
  //             'OTP_EXPIRATION',
  //             expirationTimestamp.toString()
  //           );
  //           this.isSubmit = false;
  //         } else {
  //           this.errorMessage = response?.status?.message
  //             ? response?.status?.message
  //             : '';
  //           this.showErrorMessage = true;
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Erreur de verification du code otp :', err.message);
  //         this.isSubmit = false;
  //       },
  //     });
  //   } else {
  //     this.forgotForm.markAllAsTouched();
  //     // this.#toastService.mixin('formulaire invalid', 'error');
  //     console.error('Formulaire invalide !');
  //     this.isSubmit = false;
  //   }
  // }


onSubmit() {

  // Nettoyage des espaces dans le champ de saisie du login
  const loginValue = (this.forgotForm.get('login')?.value || '').trim();
  this.forgotForm.get('login')?.setValue(loginValue);

  this.showErrorMessage = false;
  this.isSubmit = true;

  if (this.forgotForm.valid) {
    const loginData = this.forgotForm.value as { login: string };

    //  on demande d'abord le temps OTP à l'API
    this.#userService.timeOtp().subscribe({
      next: (timeResponse) => {
        console.log("Réponse API timeOt:", timeResponse); // Debug
        if (!timeResponse.hasError && timeResponse.items.length > 0) {
          const otpDuration = Number(timeResponse.items[0].value); // en secondes

          // Ensuite on fait la demande de mot de passe oublié
          this.#userService.forgetPassword(loginData).subscribe({
            next: (response) => {
              if (!response.hasError) {
                // Sauvegarde login & message
                localStorage.setItem('LOGIN_OTP', loginData.login);
                localStorage.setItem('OTP_MESSAGE', response?.status.message);

                //  Calcul expiration dynamique
                const expirationTimestamp = Date.now() + otpDuration * 1000;
                localStorage.setItem(
                  'OTP_EXPIRATION',
                  expirationTimestamp.toString()
                );

                // Redirection vers page OTP
                this.#router.navigateByUrl('/authentication/otp');
                this.isSubmit = false;
              } else {
                this.errorMessage = response?.status?.message || '';
                this.showErrorMessage = true;
              }
            },
            error: (err) => {
              console.error('Erreur forgetPassword:', err.message);
              this.isSubmit = false;
            },
          });
        }
      },
      error: (err) => {
        console.error('Erreur récupération temps OTP:', err.message);
        this.isSubmit = false;
      },
    });
  } else {
    this.forgotForm.markAllAsTouched();
    console.error('Formulaire invalide !');
    this.isSubmit = false;
  }
}


  onLogin() {
    this.#router.navigateByUrl('/authentication/login');
  }

  // onOtp() {
  // this.#router.navigateByUrl('/authentication/otp');
  // }
}
