import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  AfterViewInit,
  ElementRef,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampagneList } from 'src/app/Models/common.model';
import { Campagnes } from 'src/app/Models/gestion-campagnes.model';

import { CertificationCardComponent } from '../certification-card/certification-card.component';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { PlusIconComponent } from 'src/app/Core/icons/plus-icon.component';

import { GestionCampagnesService } from 'src/app/Core/Services/gestion-campagnes.service';
import { LoaderService } from 'src/app/Core/Services/loader.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CERTIFICATION_STATUS_FILTERS } from 'src/app/Core/Constants/certification.constant';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, Subscription, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from 'src/app/Shared/Components/pagination/pagination.component';
import { HasPermissionDirective } from 'src/app/Core/hasPermission/has-permission.directive';

@Component({
  selector: 'certification-list',
  standalone: true,
  imports: [
    CommonModule,
    CertificationCardComponent,
    NgSelectModule,
    ReactiveFormsModule,
    PaginationComponent,
    HasPermissionDirective,
  ],
  templateUrl: './certification-list.component.html',
  styleUrls: ['./certification-list.component.scss'],
})
export class CertificationListComponent implements OnInit, AfterViewInit {
  #renderer = inject(Renderer2);
  #gestionCampagneService = inject(GestionCampagnesService);
  #loaderService = inject(LoaderService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  queryCampagne$ = this.#route.queryParamMap.pipe(
    map((querys) => {
      const id = querys.get('certification');
      if (id) return +id;
      else return null;
    }),
    tap((campagneQuery) => (this.currentCampagne = campagneQuery))
  );

  currentCampagne: number | null = null;
  CERTIFICATION_STATUS_FILTERS = CERTIFICATION_STATUS_FILTERS;
  certificationsListe: Array<Partial<Campagnes>> | null = null;
  certificationLoading = false;
  searchByStatusControl = new FormControl<string>('ACTIVE', {
    nonNullable: true,
  });
  searchByStatusControlSub: Subscription | null = null;

  searchControl = new FormControl<string>('', { nonNullable: true });
  searchControlSub: Subscription | null = null;

  currentPage = 1;
  pageSize = 4;
  totalCertifications = 0;

  @Input() selectedCertification: Partial<Campagnes> | null = null;
  @Input() certifications: CampagneList | null = null;
  @Output() emitCertification: EventEmitter<Partial<Campagnes>> =
    new EventEmitter();

  @ViewChild('headerGroup') headerGroup!: ElementRef;

  ngOnInit(): void {
    this.queryCampagne$.subscribe();
    this.#gestionCampagneService.refreshCampagnes$.subscribe(() => {
      this.getCertifications();
    });
    this.getCertifications();
    this.searchByStatusControlSub = this.searchByStatusControl.valueChanges
      .pipe(
        switchMap((status) =>
          this.#gestionCampagneService.getCampagnes(
            status,
            this.searchControl.value,
            (this.currentPage = 0),
            this.pageSize,
            true
          )
        )
      )
      .subscribe({
        next: (response) => {
          this.certificationsListe = response.campagnesList;
          this.totalCertifications = response.totalCampagnes;
          this.currentPage = 1;
        },
        error: (error) => {
          this.certificationsListe = null;
        },
      });

    this.searchControlSub = this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((name) =>
          this.#gestionCampagneService.getCampagnes(
            this.searchByStatusControl.value,
            name,
            (this.currentPage = 0),
            this.pageSize
          )
        )
      )
      .subscribe({
        next: (response) => {
          this.certificationsListe = response.campagnesList;
          this.totalCertifications = response.totalCampagnes;
          this.currentPage = 1;
        },
      });
  }
  #resetCertification() {
    this.#loaderService.show();
    this.certificationsListe = null;
  }
  getCertifications() {
    this.#resetCertification();
    this.#gestionCampagneService
      .getCampagnes(
        this.searchByStatusControl.value,
        this.searchControl.value,
        this.currentPage,
        this.pageSize,
        true
      )
      .subscribe({
        next: (response) => {
          this.certificationsListe = response.campagnesList;
          this.totalCertifications = response.totalCampagnes;

          this.#router.navigate([], {
            relativeTo: this.#route,
            queryParams: {
              certification: this.certificationsListe[0].idCampaign,
            },
          });
        },
        error: (error) => {
          // ...
        },
      });
  }

  ngAfterViewInit() {
    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width < 768) {
          this.#renderer.addClass(this.headerGroup.nativeElement, 'is-narrow');
        } else {
          this.#renderer.removeClass(
            this.headerGroup.nativeElement,
            'is-narrow'
          );
        }
      }
    });
    ro.observe(this.headerGroup.nativeElement);
  }

  onEmitCertification(certification: Partial<Campagnes>) {
    this.emitCertification.emit(certification);
    this.selectedCertification = certification;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getCertifications();
  }
}
