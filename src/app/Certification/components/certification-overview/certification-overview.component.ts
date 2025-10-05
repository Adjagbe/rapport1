import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationListComponent } from 'src/app/Certification/components/certification-list/certification-list.component';
import { CertificationDetailsComponent } from 'src/app/Certification/components/certification-details/certification-details.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';
import { DetailsListComponent } from '../app-details/app-details.component';
import {
  ApplicationDetail,
  Campagnes,
} from 'src/app/Models/gestion-campagnes.model';
import { CampagneList } from 'src/app/Models/common.model';

interface Certification {
  id: number;
  name: string;
  description: string;
}

export interface AppCertification {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'certification-overview',
  standalone: true,
  imports: [
    CommonModule,
    CertificationListComponent,
    CertificationDetailsComponent,
    DetailsListComponent,
  ],
  templateUrl: './certification-overview.component.html',
  styleUrls: ['./certification-overview.component.scss'],
})
export class CertificationOverviewComponent {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #commonUtils = inject(CommonUtils);

  certifications: CampagneList = [];
  selectedCertification: Partial<Campagnes> | null = null;
  selectedAppCertification: Partial<ApplicationDetail> | null = null;
  hideCampagneCards = false;

  handleSelectedCertification(cert: Partial<Campagnes>) {
    // this.#commonUtils.setToggleNavBar(true);
    this.selectedCertification = cert;
    console.log('[***********]: ', this.selectedCertification);
    const config: NavigationExtras = {
      relativeTo: this.#route,
      queryParams: {
        certification: cert.idCampaign,
      },
      queryParamsHandling: 'merge',
    };
    this.#router.navigate([], config);
  }

  handleSelectedAppCertification(app: Partial<ApplicationDetail>) {
    this.hideCampagneCards = true;
    this.selectedAppCertification = app;
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
    this.selectedCertification = null;
    this.hideCampagneCards = false;
    this.selectedAppCertification = null;
    const config: NavigationExtras = {
      relativeTo: this.#route,
      queryParams: {
        certification: undefined,
        application: undefined,
        details: undefined,
      },
    };
    this.#router.navigate([], config);
  }

  handleBackToDetails() {
    this.hideCampagneCards = false;
    this.selectedAppCertification = null;
    // Utiliser setTimeout pour s'assurer que la navigation se fait après la mise à jour du composant
    setTimeout(() => {
      const config: NavigationExtras = {
        relativeTo: this.#route,
        queryParams: {
          application: undefined,
          details: undefined,
        },
        replaceUrl: true,
        queryParamsHandling: 'merge',
      };
      this.#router.navigate([], config);
    }, 0);
  }

  get layoutClass() {
    //   if (this.selectedAppCertification) {
    //     return 'show-app-list';
    //   }
    //   if (this.selectedCertification) {
    //     return 'show-certification-details';
    //   } if(this.selectedAppCertification) {
    //     return 'show-certification-list';
    //   }
    // }

    return this.selectedAppCertification
      ? 'show-app-list'
      : 'show-certification-details';
  }
}
