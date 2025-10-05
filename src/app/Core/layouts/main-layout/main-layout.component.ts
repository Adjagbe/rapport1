import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNavComponent } from '../../components/main-nav/main-nav.component';

@Component({
  selector: 'main-layout',
  standalone: true,
  imports: [CommonModule, MainNavComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {}
