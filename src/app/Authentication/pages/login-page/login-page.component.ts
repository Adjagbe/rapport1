import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationLayoutComponent } from 'src/app/Core/layouts/authentication-layout/authentication-layout.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [CommonModule, AuthenticationLayoutComponent, LoginFormComponent],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {}
