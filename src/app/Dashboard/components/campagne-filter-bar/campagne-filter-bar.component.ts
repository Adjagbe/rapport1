import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlComponent } from 'src/app/Shared/Components/form-control/form-control.component';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { ReloadIconComponent } from 'src/app/Core/icons/reload-icon.component';
import {
  DashboardService,
  FilterCriteria,
} from 'src/app/Core/Services/dashboard.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'campagne-filter-bar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormControlComponent,
    BtnGenericComponent,
    ReloadIconComponent,
  ],
  templateUrl: './campagne-filter-bar.component.html',
  styleUrls: ['./campagne-filter-bar.component.scss'],
})
export class CampagneFilterBarComponent implements OnInit, OnDestroy {
  #dashboardService = inject(DashboardService);
  #filterCampagne$ = this.#dashboardService.filterCampagne$;
  #fb = inject(FormBuilder);
  #commonUtils = inject(CommonUtils);
  #sub: Subscription = new Subscription();

  filterCampagne = this.#fb.nonNullable.group({
    startDate: [''],
    estimatedEndDate: [''],
    search: [''],
  });

  isReloading = false;

  ngOnInit(): void {
    this.#sub = this.#synchroniserFormulaireAvecFiltreService();
  }

  /**
   * Synchronise le formulaire local avec les filtres du service DashboardService.
   * À chaque changement du filtre dans le service, le formulaire est mis à jour
   * avec les valeurs formatées au format supportté par les input de type date
   * pour les champs de type "date".
   */
  #synchroniserFormulaireAvecFiltreService() {
    return this.#filterCampagne$.subscribe((filter) => {
      this.filterCampagne.setValue({
        startDate: this.#commonUtils.formatDateForInput(filter.startDate),
        estimatedEndDate: this.#commonUtils.formatDateForInput(
          filter.estimatedEndDate
        ),
        search: filter.search,
      });
    });
  }

  reloadDashboard() {
    let filter = this.filterCampagne.value;
    if (filter) {
      filter = {
        ...filter,
        startDate: this.#commonUtils.formatDateForBackend(
          filter?.startDate ?? ''
        ),
        estimatedEndDate: this.#commonUtils.formatDateForBackend(
          filter?.estimatedEndDate ?? ''
        ),
      };
      this.#dashboardService.setFilterCampagne(filter as FilterCriteria);
    }
  }

  ngOnDestroy(): void {
    this.#sub.unsubscribe();
  }
}
