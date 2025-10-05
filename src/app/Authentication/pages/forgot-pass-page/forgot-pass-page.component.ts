import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationLayout2Component } from 'src/app/Core/layouts/authentication-layout2/authentication-layout2.component';
import { ForgotPassFormComponent } from '../../components/forgot-pass-form/forgot-pass-form.component';

@Component({
  selector: 'app-forgot-pass-page',
  standalone: true,
  imports: [CommonModule, AuthenticationLayout2Component, ForgotPassFormComponent],
  templateUrl: './forgot-pass-page.component.html',
  styleUrls: ['./forgot-pass-page.component.scss']
})
export class ForgotPassPageComponent {

}
