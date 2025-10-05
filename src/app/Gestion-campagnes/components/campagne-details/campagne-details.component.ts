import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDetailsComponent } from '../app-details/app-details.component';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';
import {
  ApplicationDetail,
  CampagneDetails,
  Campagnes,
} from 'src/app/Models/gestion-campagnes.model';
import { GestionCampagnesService } from 'src/app/Core/Services/gestion-campagnes.service';
import { ActivatedRoute } from '@angular/router';
import {
  map,
  switchMap,
  tap,
  distinctUntilChanged,
  filter,
  takeUntil,
} from 'rxjs';
import { AdduserToAppFormComponent } from '../adduser-to-app-form/adduser-to-app-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { HasPermissionDirective } from 'src/app/Core/hasPermission/has-permission.directive';

@Component({
  selector: 'campagne-details',
  standalone: true,
  imports: [CommonModule, AppDetailsComponent, HasPermissionDirective],
  templateUrl: './campagne-details.component.html',
  styleUrls: ['./campagne-details.component.scss'],
})
export class CampagneDetailsComponent implements OnInit {
  #commonUtils = inject(CommonUtils);
  #campagneService = inject(GestionCampagnesService);
  #route = inject(ActivatedRoute);
  #ngModal = inject(NgbModal);
  #destroyRef = inject(DestroyRef);
  #destroy$ = new Subject<void>();

  hideActions = ['ACTIVE', 'CLOTURE', 'TERMINATE'];

  selectedApp: ApplicationDetail | null = null;
  applicationList: Array<ApplicationDetail> | null = null;
  @Input() campagne: Partial<Campagnes> | null = null;
  @Output() emitCampagneApp: EventEmitter<ApplicationDetail> =
    new EventEmitter();
  @Output() backToList = new EventEmitter<void>();

  ngOnInit(): void {
    const sub = this.getCurrentAppId().subscribe();

    // Configuration de la destruction automatique
    this.#destroyRef.onDestroy(() => {
      this.#destroy$.next();
      this.#destroy$.complete();
      sub?.unsubscribe();
    });

    // Subscription pour les détails de campagne
    this.#getCampagneDetails();

    // Subscription pour le refresh des détails
    this.#campagneService.refreshCampagneDetails$
      .pipe(takeUntil(this.#destroy$))
      .subscribe({
        next: () => {
          this.campagne = null;
          this.applicationList = null;
          this.selectedApp = null;
          this.#getCampagneDetails();
        },
      });

    // Subscription pour récupérer la campagne par ID
    this.#getCampagneById();
  }

  currentApp = 0;
  getCurrentAppId() {
    return this.#route.queryParamMap.pipe(
      tap((paramMap) => {
        this.currentApp = paramMap.get('application')
          ? Number(paramMap.get('application'))
          : 0;
      })
    );
  }

  #getCampagneDetails() {
    this.#route.queryParamMap
      .pipe(
        map((params) => params.get('campagne')),
        filter((campagne) => campagne !== null && campagne !== undefined),
        distinctUntilChanged(),
        map((hasId) => {
          console.log('[CAMPAGNE ID]: ', hasId);
          if (hasId) return +hasId;
          return 0;
        }),
        tap((idCampagne) => {
          this.currentApp = idCampagne;
        }),
        switchMap((idCampagne) =>
          this.#campagneService.getCampagneDetails(idCampagne)
        ),
        map((campagneDetails) => this.#getApplist(campagneDetails)),
        takeUntil(this.#destroy$)
      )
      .subscribe({
        next: (appList) => {
          if (appList.length) {
            this.applicationList = appList;
          }
          console.log('[APP LIST]: ', this.applicationList);
        },
        error: (error) => {},
      });
  }
  #getCampagneById() {
    this.#route.queryParamMap
      .pipe(
        map((params) => params.get('campagne')),
        filter((campagne) => campagne !== null && campagne !== undefined),
        distinctUntilChanged(),
        switchMap((idCampagne) =>
          this.#campagneService.getCampagneById(+(idCampagne as string))
        ),
        tap((campagneDetails) => {
          this.campagne = campagneDetails;
          console.log('[CAMPAGNE DETAILS]: ', this.campagne);
        }),
        takeUntil(this.#destroy$)
      )
      .subscribe();
  }

  #getApplist(campagneDetails: CampagneDetails) {
    return campagneDetails.applicationDetails;
  }

  onEmitCampagneApp(campagneApp: ApplicationDetail) {
    this.emitCampagneApp.emit(campagneApp);
    this.selectedApp = campagneApp;
  }

  backToCampagneList() {
    this.selectedApp = null;
    this.backToList.emit();
    this.#commonUtils.setToggleNavBar(false);
  }

  goToAdduserAppForm() {
    this.#ngModal.open(AdduserToAppFormComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
  }

  // La destruction est gérée automatiquement par destroyRef
}
