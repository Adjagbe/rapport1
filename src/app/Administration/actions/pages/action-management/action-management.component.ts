import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ActionManagementOverviewComponent } from '../../components/action-management-overview/action-management-overview.component';
import { MainLayoutComponent } from 'src/app/Core/layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-action-management',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, ActionManagementOverviewComponent,RouterOutlet],
  templateUrl: './action-management.component.html',
  styleUrls: ['./action-management.component.scss']
})
export class ActionManagementComponent {

}
