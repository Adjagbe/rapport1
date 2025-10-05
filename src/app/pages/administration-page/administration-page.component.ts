import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from 'src/app/Core/layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-administration-page',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent],
  templateUrl: './administration-page.component.html',
  styleUrls: ['./administration-page.component.scss'],
})
export class AdministrationPageComponent {}
