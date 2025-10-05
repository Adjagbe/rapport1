import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from 'src/app/Core/layouts/main-layout/main-layout.component';
import { GestionCampagneOverviewComponent } from 'src/app/Gestion-campagnes/components/gestion-campagne-overview/gestion-campagne-overview.component';

@Component({
  selector: 'app-gestion-campagne-page',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    GestionCampagneOverviewComponent,
  ],
  templateUrl: './gestion-campagne-page.component.html',
  styleUrls: ['./gestion-campagne-page.component.scss'],
})
export class GestionCampagnePageComponent {}
