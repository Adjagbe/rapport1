import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from 'src/app/Core/layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-parametrage-page',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent],
  templateUrl: './parametrage-page.component.html',
  styleUrls: ['./parametrage-page.component.scss'],
})
export class ParametragePageComponent {}
