import {
  Component,
  ElementRef,
  inject,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnGenericComponent } from '../../../Shared/Components/btn-generic/btn-generic.component';
import { ProgressTrackerData } from 'src/app/Models/dashboard.model';
import { NavigationExtras, Router } from '@angular/router';
import { HasPermissionDirective } from "src/app/Core/hasPermission/has-permission.directive";
import { DashboardService } from 'src/app/Core/Services/dashboard.service';
import { NgbPanelTitle } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap/accordion/accordion';

@Component({
  selector: 'progress-tracker',
  standalone: true,
  imports: [CommonModule, BtnGenericComponent, NgbPanelTitle, HasPermissionDirective], 
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.scss'],
})
export class ProgressTrackerComponent {
  #router = inject(Router);
  #rendere2 = inject(Renderer2);
  #dashboardService = inject(DashboardService);

  @ViewChild('actions') actions!: ElementRef<HTMLDivElement>;
  @Input() data: ProgressTrackerData = {
    id: 1,
    status: 'active',
    title: 'Certification Q1 2025',
    dates: '01/01/2025 - 31/03/2025',
    progression: 76,
    certifiedUsers: 496,
    totalUsers: 650,
  };
  extractionInProcess = false;

  navigateToDetails() {
    const config: NavigationExtras = {
      queryParams: {
        id: this.data.id,
      },
    };
    this.#router.navigate(
      ['dashboard', 'details', this.data.title?.split(' ').join('-')],
      config
    );
  }

  toggleActions(e: MouseEvent) {
    e.stopPropagation();
    if (this.actions.nativeElement.classList.contains('show-actions')) {
      this.#rendere2.removeClass(this.actions.nativeElement, 'show-actions');
    } else {
      this.#rendere2.addClass(this.actions.nativeElement, 'show-actions');
    }
  }

  exportExcel(
    e: Event,
    campagne: { idCampaign: number; campaignName: string | null }
  ) {
    e.stopPropagation();
    this.extractionInProcess = true;
    this.#dashboardService.exportCampagneRaportAsCSV(campagne).subscribe({
      next: () => {
        this.extractionInProcess = false;
      },
      error: () => {
        this.extractionInProcess = false;
      },
    });
  }
  exportPdf(e: Event) {
    e.stopPropagation();
  }
}
