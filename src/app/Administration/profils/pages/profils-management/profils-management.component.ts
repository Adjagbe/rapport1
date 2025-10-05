import { Component, inject, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ProfilsManagementOverviewComponent } from '../../components/profils-management-overview/profils-management-overview.component';
import { MainLayoutComponent } from 'src/app/Core/layouts/main-layout/main-layout.component';

@Component({
  selector: 'profils-management-view',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, ProfilsManagementOverviewComponent,RouterOutlet],
  templateUrl: './profils-management.component.html',
  styleUrls: ['./profils-management.component.scss'],
})
export class ProfilsManagementComponent {
}
