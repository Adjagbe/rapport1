import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationLayout2Component } from 'src/app/Core/layouts/authentication-layout2/authentication-layout2.component';
import { OtpFormComponent } from '../../components/otp-form/otp-form.component';

@Component({
  selector: 'app-otp-page',
  standalone: true,
  imports: [CommonModule, AuthenticationLayout2Component, OtpFormComponent],
  templateUrl: './otp-page.component.html',
  styleUrls: ['./otp-page.component.scss']
})
export class OtpPageComponent {

}
