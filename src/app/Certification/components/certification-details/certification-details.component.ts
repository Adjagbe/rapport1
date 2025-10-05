import {
  Component,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input, Output, EventEmitter } from '@angular/core';
import { AppCertification } from '../certification-overview/certification-overview.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';
import {
  ApplicationDetail,
  CampagneDetails,
  Campagnes,
} from 'src/app/Models/gestion-campagnes.model';
import {
  distinctUntilChanged,
  filter,
  map,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { GestionCampagnesService } from 'src/app/Core/Services/gestion-campagnes.service';
import { AppDetailsComponent } from 'src/app/Gestion-campagnes/components/app-details/app-details.component';
import { CampagneInfosCardComponent } from '../campagne-infos-card/campagne-infos-card.component';

interface Certification {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'certification-details',
  standalone: true,
  imports: [CommonModule, AppDetailsComponent, CampagneInfosCardComponent],
  templateUrl: './certification-details.component.html',
  styleUrls: ['./certification-details.component.scss'],
})
export class CertificationDetailsComponent
  implements OnInit, OnDestroy, OnChanges
{
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #commonUtils = inject(CommonUtils);
  #campagneService = inject(GestionCampagnesService);
  #campagneDetailsSubscription!: Subscription;

  applicationQuery: number = 0;

  certifiedAccounts: number | null = null;
  uncertifiedAccounts: number | null = null;
  totalCertifiedApplications: number | null = null;
  totalUncertifiedApplications: number | null = null;

  applicationList: Array<ApplicationDetail> | null = null;
  selectedApp: ApplicationDetail | null = null;

  @Input() hideCampagneCards = false;
  @Input() certification: Partial<Campagnes> | null = null;
  @Output() backToList = new EventEmitter<void>();
  @Output() emitAppCertification = new EventEmitter<ApplicationDetail>();

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.#route.queryParamMap.subscribe((params) => {
      this.applicationQuery = +(params?.get('application') ?? 0);
    });
    this.#campagneDetailsSubscription = this.#getCampagneDetails();
  }

  #getCampagneDetails() {
    return this.#route.queryParamMap
      .pipe(
        map((params) => params.get('certification')),
        filter((campagne) => campagne !== null && campagne !== undefined),
        distinctUntilChanged(),
        map((hasId) => {
          console.log('[CAMPAGNE ID]: ', hasId);
          if (hasId) return +hasId;
          return 0;
        }),
        switchMap((idCampagne) =>
          this.#campagneService.getCampagneDetails(idCampagne)
        ),
        tap((campagnDetails) => {
          this.certification = campagnDetails;
          this.certifiedAccounts = campagnDetails?.certifiedAccounts ?? 0;
          this.uncertifiedAccounts = campagnDetails?.uncertifiedAccounts ?? 0;
          this.totalCertifiedApplications =
            campagnDetails?.totalCertifiedApplications ?? 0;
          this.totalUncertifiedApplications =
            campagnDetails?.totalUncertifiedApplications ?? 0;
        }),
        map((campagneDetails) => this.#getApplist(campagneDetails))
      )
      .subscribe({
        next: (appList) => {
          if (appList.length) {
            this.applicationList = appList;
          }
          console.log('[APP LIST]: ', this.applicationList);
          console.log('[CERTIFICATION]: ', this.certification);
        },
        error: (error) => {},
      });
  }

  #getApplist(campagneDetails: CampagneDetails) {
    return campagneDetails.applicationDetails;
  }

  goBack() {
    this.#commonUtils.setToggleNavBar(false);
    this.backToList.emit();
    const config: NavigationExtras = {
      relativeTo: this.#route,
      queryParams: {},
    };
    this.#router.navigate([], config);
    this.hideCampagneCards = false;
  }

  selectAppCertification() {
    this.selectedApp && this.emitAppCertification.emit(this.selectedApp);
  }

  onEmitCampagneApp(app: ApplicationDetail) {
    this.selectedApp = app;
    this.emitAppCertification.emit(app);
    this.#commonUtils.setToggleNavBar(true);
  }

  ngOnDestroy(): void {
    this.#campagneDetailsSubscription?.unsubscribe();
  }
}
