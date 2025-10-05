import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from 'src/app/Core/layouts/main-layout/main-layout.component';
import { CertificationOverviewComponent } from 'src/app/Certification/components/certification-overview/certification-overview.component';

@Component({
  selector: 'app-certification-page',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, CertificationOverviewComponent],
  templateUrl: './certification-page.component.html',
  styleUrls: ['./certification-page.component.scss'],
})
export class CertificationPageComponent {}
