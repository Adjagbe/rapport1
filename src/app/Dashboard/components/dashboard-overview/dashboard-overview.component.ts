import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampagneFilterBarComponent } from '../campagne-filter-bar/campagne-filter-bar.component';
import { CampagneInfoCardComponent } from '../campagne-info-cards/campagne-info-cards.component';
import { GroupedCampagneComponent } from '../grouped-campagne/grouped-campagne.component';
import { SpeakerV2IconComponent } from 'src/app/Core/icons/speaker-v2-icon.compoenet';
import { TopArrowIconComponent } from 'src/app/Core/icons/top-arrow.icon.component';
import { FolderIconComponent } from 'src/app/Core/icons/folder-icon.component';
import { DashboardService } from 'src/app/Core/Services/dashboard.service';
import { HasPermissionDirective } from 'src/app/Core/hasPermission/has-permission.directive';
import { NgbPanelTitle } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap/accordion/accordion';

@Component({
  selector: 'dashboard-overview',
  standalone: true,
  imports: [
    CommonModule,
    CampagneFilterBarComponent,
    CampagneInfoCardComponent,
    GroupedCampagneComponent,
    SpeakerV2IconComponent,
    TopArrowIconComponent,
    FolderIconComponent,
    HasPermissionDirective,
    NgbPanelTitle,
  ],
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss'],
})
export class DashboardOverviewComponent implements OnInit, AfterViewInit {
  #dashboardService = inject(DashboardService);

  @ViewChild('cardsContainer', { static: false }) cardsContainer!: ElementRef;

  campagneInfoCards:
    | {
        label: string;
        value: number;
        type: 'blue' | 'purple' | 'green' | 'grey' | 'red' | 'orange';
      }[]
    | null = null;

  canScrollLeft: boolean = false;
  canScrollRight: boolean = false;

  ngOnInit() {
    this.getCampagnesGlobalStats();
  }

  ngAfterViewInit() {
    this.updateScrollButtons();

    // Écouter les changements de taille de fenêtre
    window.addEventListener('resize', () => {
      this.updateScrollButtons();
    });

    // Écouter le scroll manuel
    if (this.cardsContainer) {
      this.cardsContainer.nativeElement.addEventListener('scroll', () => {
        this.updateScrollButtons();
      });
    }
  }

  updateScrollButtons() {
    if (this.cardsContainer) {
      const element = this.cardsContainer.nativeElement;
      this.canScrollLeft = element.scrollLeft > 0;
      this.canScrollRight =
        element.scrollLeft < element.scrollWidth - element.clientWidth;
    }
  }

  scrollLeft() {
    if (this.cardsContainer) {
      const element = this.cardsContainer.nativeElement;
      element.scrollBy({ left: -300, behavior: 'smooth' });
      setTimeout(() => this.updateScrollButtons(), 300);
    }
  }

  scrollRight() {
    if (this.cardsContainer) {
      const element = this.cardsContainer.nativeElement;
      element.scrollBy({ left: 300, behavior: 'smooth' });
      setTimeout(() => this.updateScrollButtons(), 300);
    }
  }

  getCampagnesGlobalStats() {
    this.#dashboardService.getCampagnesGlobalStats().subscribe({
      next: (response) => {
        console.log('[dashboard-overview] response: ', response);
        this.campagneInfoCards = [
          {
            label: 'Total des campagnes',
            value: response?.total_campagnes ?? 0,
            type: 'grey',
          },
          {
            label: 'Campagnes actives',
            value: response?.campagnes_actives ?? 0,
            type: 'green',
          },
          {
            label: 'Campagnes planifiées',
            value: response?.campagnes_plainifier ?? 0,
            type: 'purple',
          },
          {
            label: 'Campagnes désactivées',
            value: response?.campagnes_desactive ?? 0,
            type: 'red',
          },
          {
            label: 'Campagnes terminées',
            value: response?.campagnes_terminees ?? 0,
            type: 'orange',
          },
          {
            label: 'Campagnes clôturées',
            value: response?.campagnes_cloturer ?? 0,
            type: 'blue',
          },
        ];

        // Mettre à jour l'état des boutons après le chargement des données
        setTimeout(() => {
          this.updateScrollButtons();
        }, 100);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
