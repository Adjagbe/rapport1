import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from "src/app/Core/layouts/main-layout/main-layout.component";
import { PlateformeOverviewComponent } from "../../components/plateforme-overview/plateforme-overview.component";

@Component({
  selector: 'app-plateforme-management',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, PlateformeOverviewComponent],
  templateUrl: './plateforme-management.component.html',
  styleUrls: ['./plateforme-management.component.scss']
})
export class PlateformeManagementComponent {

}
