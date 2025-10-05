import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from 'src/app/Core/layouts/main-layout/main-layout.component';
import { DetailsOverviewComponent } from '../../components/details-overview/details-overview.component';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, DetailsOverviewComponent],
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss'],
})
export class DetailsPageComponent {}
