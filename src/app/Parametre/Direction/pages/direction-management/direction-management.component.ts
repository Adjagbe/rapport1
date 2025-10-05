import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from "src/app/Core/layouts/main-layout/main-layout.component";
import { DirectionOverviewComponent } from "../../components/direction-overview/direction-overview.component";

@Component({
  selector: 'app-direction-management',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, DirectionOverviewComponent],
  templateUrl: './direction-management.component.html',
  styleUrls: ['./direction-management.component.scss']
})
export class DirectionManagementComponent {

}
