import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerCardComponent } from 'src/app/Shared/Components/container-card/container-card.component';
import { ProgressTrackerComponent } from '../progress-tracker/progress-tracker.component';
import { PaginationComponent } from 'src/app/Shared/Components/pagination/pagination.component';
import { FolderIconComponent } from 'src/app/Core/icons/folder-icon.component';
import { TopArrowIconComponent } from 'src/app/Core/icons/top-arrow.icon.component';
import { ProgressTrackerData } from 'src/app/Models/dashboard.model';
import { DashboardService } from 'src/app/Core/Services/dashboard.service';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { GestionCampagnesService } from 'src/app/Core/Services/gestion-campagnes.service';
import { HasPermissionDirective } from "src/app/Core/hasPermission/has-permission.directive";

@Component({
  selector: 'grouped-campagne',
  standalone: true,
  imports: [
    CommonModule,
    ContainerCardComponent,
    ProgressTrackerComponent,
    PaginationComponent,
    FolderIconComponent,
    TopArrowIconComponent,
    HasPermissionDirective
],
  templateUrl: './grouped-campagne.component.html',
  styleUrls: ['./grouped-campagne.component.scss'],
})
export class GroupedCampagneComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  readonly #destroyRef = inject(DestroyRef);
  readonly #dashboardService = inject(DashboardService);
  readonly #gestionCampagneService = inject(GestionCampagnesService);

  activeCampagne: ProgressTrackerData[] = [];
  closedCampagne: ProgressTrackerData[] = [];
  terminatedCampagne: ProgressTrackerData[] = [];

  // Pagination pour les campagnes actives
  activeCurrentPage = 1;
  activeTotalItems = 0;
  activePageSize = 2;

  // Pagination pour les campagnes clôturées
  closedCurrentPage = 1;
  closedTotalItems = 0;
  closedPageSize = 2;

  // Pagination pour les campagnes terminées
  terminatedCurrentPage = 1;
  terminatedTotalItems = 0;
  terminatedPageSize = 2;

  ngOnInit() {
    this.loadActiveCampagnes();
    this.loadClosedCampagnes();
    this.loadTerminatedCampagnes();

    const filterSub = this.#dashboardService.filterCampagne$
      .pipe(
        switchMap((filter) =>
          this.#gestionCampagneService.getCampagnes('', filter.search)
        )
      )
      .subscribe();

    this.#destroyRef.onDestroy(() => {
      filterSub.unsubscribe();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadActiveCampagnes(page: number = 1) {
    this.#dashboardService
      .getActiveCampagnes(page, this.activePageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.activeCampagne = response.campagnes;
          this.activeTotalItems = response.totalCampagnes;
          this.activeCurrentPage = page;
        },
        error: (error) => {
          console.error(
            'Erreur lors du chargement des campagnes actives:',
            error
          );
        },
      });
  }

  loadClosedCampagnes(page: number = 1) {
    this.#dashboardService
      .getClosedCampagnes(page, this.closedPageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.closedCampagne = response.campagnes;
          this.closedTotalItems = response.totalCampagnes;
          this.closedCurrentPage = page;
        },
        error: (error) => {
          console.error(
            'Erreur lors du chargement des campagnes clôturées:',
            error
          );
        },
      });
  }

  onActivePageChange(page: number) {
    this.loadActiveCampagnes(page);
  }

  onClosedPageChange(page: number) {
    this.loadClosedCampagnes(page);
  }

  loadTerminatedCampagnes(page: number = 1) {
    this.#dashboardService
      .getTerminatedCampagnes(page, this.terminatedPageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.terminatedCampagne = response.campagnes;
          this.terminatedTotalItems = response.totalCampagnes;
          this.terminatedCurrentPage = page;
        },
        error: (error) => {
          console.error(
            'Erreur lors du chargement des campagnes terminées:',
            error
          );
        },
      });
  }

  onTerminatedPageChange(page: number) {
    this.loadTerminatedCampagnes(page);
  }
}
