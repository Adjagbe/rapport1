import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';
import { ForgotPassPageComponent } from './pages/forgot-pass-page/forgot-pass-page.component';
import { OtpPageComponent } from './pages/otp-page/otp-page.component';

export const AUTHROUTES: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot-password', component: ForgotPassPageComponent },
  { path: 'otp', component: OtpPageComponent },
  { path: 'reset-password', component: ResetPasswordPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
