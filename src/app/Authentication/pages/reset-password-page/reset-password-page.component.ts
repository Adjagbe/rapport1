import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordFormComponent } from '../../components/reset-password-form/reset-password-form.component';
import { AuthenticationLayout2Component } from 'src/app/Core/layouts/authentication-layout2/authentication-layout2.component';

@Component({
  selector: 'reset-password-page',
  standalone: true,
  imports: [CommonModule,  AuthenticationLayout2Component, ResetPasswordFormComponent],
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.scss'],
})
export class ResetPasswordPageComponent {}
