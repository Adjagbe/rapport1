import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from 'src/app/Core/layouts/main-layout/main-layout.component';
import { DashboardOverviewComponent } from 'src/app/Dashboard/components/dashboard-overview/dashboard-overview.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, DashboardOverviewComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent {}
