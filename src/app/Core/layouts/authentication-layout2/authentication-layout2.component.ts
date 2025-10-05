import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandComponent } from 'src/app/Shared/Components/brand/brand.component';

@Component({
  selector: 'authentication-layout2',
  standalone: true,
  imports: [CommonModule, BrandComponent],
  templateUrl: './authentication-layout2.component.html',
  styleUrls: ['./authentication-layout2.component.scss'],
})
export class AuthenticationLayout2Component {}
