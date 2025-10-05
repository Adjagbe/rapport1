import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandComponent } from 'src/app/Shared/Components/brand/brand.component';

@Component({
  selector: 'authentication-layout',
  standalone: true,
  imports: [CommonModule, BrandComponent],
  templateUrl: './authentication-layout.component.html',
  styleUrls: ['./authentication-layout.component.scss'],
})
export class AuthenticationLayoutComponent {}
