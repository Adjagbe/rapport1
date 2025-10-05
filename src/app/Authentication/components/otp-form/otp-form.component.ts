import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ListUser } from 'src/app/Models/user.model';
import { UsersService } from 'src/app/Core/Services/users.service';
import { ErrorMessageComponent } from "src/app/Shared/Components/error-message/error-message.component";

@Component({
  selector: 'otp-form',
  standalone: true,
  imports: [
    CommonModule,
    FormControlComponent,
    BtnGenericComponent,
    ReactiveFormsModule,
    ErrorMessageComponent
],
  templateUrl: './otp-form.component.html',
  styleUrls: ['./otp-form.component.scss']
})
export class OtpFormComponent {
    #router = inject(Router);
    #formBuilder = inject(FormBuilder);

  showErrorMessage = false;
  errorMessage: string = '';
      
    onResetPassword() {
      this.#router.navigateByUrl('/authentication/reset-password');
    }
  
    onForgotPassword() {
      this.#router.navigateByUrl('/authentication/forgot-password');
    }

    onPageConnexion(){
      this.#router.navigateByUrl('/authentication')
    }
  // AUTH_TEXT = AUTH_TEXT;

  // confirmOtpForm = this.#formBuilder.nonNullable.group({
  //   otp: ['', [Validators.required]],
  // });

  confirmOtpForm = this.#formBuilder.nonNullable.group({
  otp1: ['', [Validators.required]],
  otp2: ['', [Validators.required]],
  otp3: ['', [Validators.required]],
  otp4: ['', [Validators.required]]
});


  #userService = inject(UsersService);
  // #route = inject(ActivatedRoute);
  // #toastService = inject(ToastService);

  otpExpirationSeconds = 120; 
  displayTime = ''; // chaîne à afficher
  #intervalId: any;
  currentLogin = '';
  userNumber : any

  isSubmit = false;
  isResendOtp = false;

  @ViewChild('otp1Input') otp1Input!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    this.otp1Input.nativeElement.focus();
  }

  ngOnInit(): void {
    const savedLogin = localStorage.getItem('LOGIN_OTP');
    if (savedLogin) {
      this.currentLogin = savedLogin;
      console.log('Login récupéré depuis le localStorage :', this.currentLogin);
    }else {
      console.log('Aucun login trouvé dans le localStorage.');
    }
  
    this.userNumber = localStorage.getItem('OTP_MESSAGE');
    
    

      const expiration = localStorage.getItem('OTP_EXPIRATION');

      const now = Date.now();
    
      if (expiration && +expiration > now) {
        this.otpExpirationSeconds = Math.floor((+expiration - now) / 1000);
        this.startOtpCountdown();
      } else {
        this.otpExpirationSeconds = 0;
      }
    // this.getListUser()
  
    this.confirmOtpForm.valueChanges.subscribe(()=> {
      this.showErrorMessage = false
    })
  
  }
  
  cancel() {
    this.#router.navigate(['authentication']);
  }

  startOtpCountdown() {
    this.updateDisplayTime(); // initial
    this.#intervalId = setInterval(() => {
      if (this.otpExpirationSeconds > 0) {
        this.otpExpirationSeconds--;
        this.updateDisplayTime();
      } else {
        clearInterval(this.#intervalId);
        this.displayTime = 'Code expiré';
        // Optionnel : désactiver le bouton
        // this.confirmOtpForm.disable();
      }
    }, 1000);
  }
  
  updateDisplayTime() {
    const minutes = Math.floor(this.otpExpirationSeconds / 60);
    const seconds = this.otpExpirationSeconds % 60;
    this.displayTime = `${this.pad(minutes)}:${this.pad(seconds)}`;
  }
  
  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  // onResendOtp(){
  //   this.isResendOtp = true;
  //   this.#userService.forgetPassword({ login: this.currentLogin }).subscribe({
  //     next: () => {
  //       this.isResendOtp = false;
  //       const expirationTimestamp = Date.now() + 120 * 1000; // 2 minutes
  //       localStorage.setItem('OTP_EXPIRATION', expirationTimestamp.toString());
  //       this.otpExpirationSeconds = 120;
  //       this.confirmOtpForm.reset();
  //       this.confirmOtpForm.enable();

  //       clearInterval(this.#intervalId);
  //       this.startOtpCountdown();
  //     },
  //     error: (err) => {
  //       console.error('Erreur de renvoi de code :', err.message);
  //       this.isResendOtp = false;
  //     },
  //   });
  // }

    // listUser: ListUser | null = [];
    
    // getListUser(
    //   filter: { [column: string]: string | number[] | number } | null = null
    // ) {
    //   this.listUser = null;
    //   this.#userService.getListUtilisateur(
    //   { 
    //     size: '',
    //     index: '', 
    //     id: '', 
    //   }, 
    //     null, 
    //   { login: this.currentLogin },
    //   null
    //   )
    //     .subscribe({
    //       next: (listUserResponse) => {
    //         const { items, count } = listUserResponse;
    //         console.log('donnée recup du login',listUserResponse);
            
    //         this.listUser = items;
    //         this.userNumber = items[0].telephone
    //         console.log('numero',this.userNumber);
            
    //       },
    //       error: (error) => {
    //         this.listUser = null;
    //         console.error(error);
    //         // error?.status?.message &&
    //           // this.#toastService.mixin(error?.status?.message, 'info');
    //       },
    //     });
    // }


onResendOtp() {

  this.isResendOtp = true;

  //  Récupérer le temps OTP avant de relancer
  this.#userService.timeOtp().subscribe({
    next: (timeResponse) => {
      if (!timeResponse.hasError && timeResponse.items.length > 0) {
        const otpDuration = Number(timeResponse.items[0].value);

        this.#userService.forgetPassword({ login: this.currentLogin }).subscribe({
          next: () => {
            this.isResendOtp = false;

            //  Expiration dynamique
            const expirationTimestamp = Date.now() + otpDuration * 1000;
            localStorage.setItem('OTP_EXPIRATION', expirationTimestamp.toString());
            this.otpExpirationSeconds = otpDuration;

            this.confirmOtpForm.reset();
            this.confirmOtpForm.enable();

            clearInterval(this.#intervalId);
            this.startOtpCountdown();
          },
          error: (err) => {
            console.error('Erreur de renvoi de code :', err.message);
            this.isResendOtp = false;
          },
        });
      }
    },
    error: (err) => {
      console.error('Erreur récupération temps OTP:', err.message);
      this.isResendOtp = false;
    },
  });
}


  submitAuto(){
    const otpCode =
      (this.confirmOtpForm.get('otp1')?.value ?? '') +
      (this.confirmOtpForm.get('otp2')?.value ?? '') +
      (this.confirmOtpForm.get('otp3')?.value ?? '') +
      (this.confirmOtpForm.get('otp4')?.value ?? '');

    if (otpCode.length === 4) {
      this.onSubmit();
    }
  }

  onSubmit() {
   const otpCode =
    (this.confirmOtpForm.get('otp1')?.value ?? '') +
    (this.confirmOtpForm.get('otp2')?.value ?? '') +
    (this.confirmOtpForm.get('otp3')?.value ?? '') +
    (this.confirmOtpForm.get('otp4')?.value ?? '');


    console.log('Code OTP saisi :', otpCode);
    // console.log('code otp',this.confirmOtpForm.value);
    this.showErrorMessage = false;
    this.isSubmit = true;
    if (otpCode) {
      const loginData =  { otp: otpCode, login: this.currentLogin };
      this.#userService.verifyOtp({ ...loginData }).subscribe({
        next: (response) => {
          if(!response.hasError){
            // this.#router.navigate(['authentification', 'reset-password']);
            this.#router.navigateByUrl('/authentication/reset-password');
            this.isSubmit = false;
            localStorage.removeItem('OTP_EXPIRATION'); //evaluer le hasError
          }else{
            this.errorMessage = response?.status?.message
              ? response?.status?.message
              : '';
            this.showErrorMessage = true;
          }
          
        },
        error: (err) => {
          console.error('Erreur de connexion :', err.message);
          this.isSubmit = false;
        },
      });
    } else {
      this.confirmOtpForm.markAllAsTouched();
      // this.#toastService.mixin('formulaire invalid', 'error');
      console.error('Formulaire invalide !');
      this.isSubmit = false;
    }
  }
  ngOnDestroy() {
    if (this.#intervalId) clearInterval(this.#intervalId);
  }

  moveToNext(event: any, nextField: string | null) {
    const input = event.target;
    if (input.value.length === 1 && nextField) {
      const next = document.querySelector<HTMLInputElement>(`[formControlName="${nextField}"]`);
      next?.focus();
    }
  }

  moveToPrev(event: any, prevField: string | null) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && input.value === '' && prevField) {
      const prev = document.querySelector<HTMLInputElement>(`[formControlName="${prevField}"]`);
      prev?.focus();
    }
  }

}
