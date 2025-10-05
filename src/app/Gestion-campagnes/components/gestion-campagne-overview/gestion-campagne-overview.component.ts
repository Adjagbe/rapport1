import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampagneListComponent } from '../campagne-list/campagne-list.component';
import { CampagneDetailsComponent } from '../campagne-details/campagne-details.component';

import { CAMPAGNES } from 'src/app/Core/Constants/common.constant';
import {
  Application,
  Campagne,
  CampagneList,
} from 'src/app/Models/common.model';
import { AppListComponent } from '../app-list/app-list.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';
import {
  ApplicationDetail,
  Campagnes,
} from 'src/app/Models/gestion-campagnes.model';

@Component({
  selector: 'gestion-campagne-overview',
  standalone: true,
  imports: [
    CommonModule,
    CampagneListComponent,
    CampagneDetailsComponent,
    AppListComponent,
  ],
  templateUrl: './gestion-campagne-overview.component.html',
  styleUrls: ['./gestion-campagne-overview.component.scss'],
})
export class GestionCampagneOverviewComponent {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #commonUtils = inject(CommonUtils);

  campagneList: CampagneList | null = CAMPAGNES;
  selectedCampagne: Partial<Campagnes> | null = null;
  selectedApp: ApplicationDetail | null = null;

  handleSelectedCampagne(campagne: Partial<Campagnes>) {
    this.#commonUtils.setToggleNavBar(true);
    this.selectedCampagne = campagne;
    const config: NavigationExtras = {
      relativeTo: this.#route,
      queryParams: {
        campagne: campagne.idCampaign,
      },
      queryParamsHandling: 'merge',
    };
    this.#router.navigate([], config);
  }

  handleSelectedApp(app: ApplicationDetail) {
    console.log('[selected app]: ', app);
    this.selectedApp = app;
    const config: NavigationExtras = {
      relativeTo: this.#route,
      queryParams: {
        application: app.applicationId,
      },
      queryParamsHandling: 'merge',
    };
    this.#router.navigate([], config);
  }

  handleBackToList() {
    this.selectedCampagne = null;
    this.selectedCampagne = null;
    this.selectedApp = null;

    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: { application: null, campagne: null },
      queryParamsHandling: 'merge',
    });
  }

  handleBackToDetails() {
    this.selectedApp = null;
    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: { application: null },
      queryParamsHandling: 'merge',
    });
  }

  get layoutClass() {
    if (this.selectedApp) {
      return 'show-app-list';
    } else if (this.selectedCampagne) {
      return 'show-campagne-details';
    } else {
      return 'show-campagne-list';
    }
  }
}
