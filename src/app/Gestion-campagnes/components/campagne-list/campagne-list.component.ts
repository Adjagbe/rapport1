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
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampagneList } from 'src/app/Models/common.model';
import { Campagnes } from 'src/app/Models/gestion-campagnes.model';

import { CampagneCardComponent } from '../campagne-card/campagne-card.component';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { PlusIconComponent } from 'src/app/Core/icons/plus-icon.component';

import { CreateCampagneFormComponent } from '../create-campagne-form/create-campagne-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GestionCampagnesService } from 'src/app/Core/Services/gestion-campagnes.service';

import { LoaderService } from 'src/app/Core/Services/loader.service';
import { CustomSelectComponent } from 'src/app/Shared/Components/custom-select/custom-select.component';
import { CAMPAGNE_STATUS_FILTERS } from 'src/app/Core/Constants/gestion-campagnes.constant';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, Subscription, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PaginationComponent } from 'src/app/Shared/Components/pagination/pagination.component';
import { HasPermissionDirective } from 'src/app/Core/hasPermission/has-permission.directive';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';

@Component({
  selector: 'campagne-list',
  standalone: true,
  imports: [
    CommonModule,
    CampagneCardComponent,
    BtnGenericComponent,
    PlusIconComponent,
    CustomSelectComponent,
    ReactiveFormsModule,
    PaginationComponent,
    HasPermissionDirective,
  ],
  templateUrl: './campagne-list.component.html',
  styleUrls: ['./campagne-list.component.scss'],
})
export class CampagneListComponent implements OnInit, AfterViewInit {
  #renderer = inject(Renderer2);
  #ngModal = inject(NgbModal);
  #gestionCampagneService = inject(GestionCampagnesService);
  #loaderService = inject(LoaderService);
  #route = inject(ActivatedRoute);

  queryCampagne$ = this.#route.queryParamMap.pipe(
    map((querys) => querys.get('campagne')),
    tap((campagneQuery) =>
      console.log(
        'campagne query: ',
        (this.idCampagne = campagneQuery
          ? +campagneQuery
          : (campagneQuery as null))
      )
    )
  );

  CAMPAGNE_STATUS_FILTERS = CAMPAGNE_STATUS_FILTERS;
  idCampagne: number | null = null;

  campagnesListe: Array<Partial<Campagnes>> | null = null;
  campagneLoading = false;
  searchByStatusControl = new FormControl<string>('', { nonNullable: true });
  searchByStatusControlSub: Subscription | null = null;

  searchControl = new FormControl<string>('', { nonNullable: true });
  searchControlSub: Subscription | null = null;

  currentPage = 1;
  pageSize = 4; // Ou la valeur par défaut souhaitée
  totalCampagnes = 0; // Nombre total d'éléments pour la pagination

  @Input() selectedCampagne: Partial<Campagnes> | null = null;
  @Input() campagnes: CampagneList | null = null;
  @Output() emitCampagne: EventEmitter<Partial<Campagnes>> = new EventEmitter();

  @ViewChild('headerGroup') headerGroup!: ElementRef;

  @HostBinding('class.padding-inline-end') hasQuery = false;
  private queryCampagneSub: Subscription | null = null;

  ngOnInit(): void {
    this.queryCampagneSub = this.queryCampagne$.subscribe((campagneQuery) => {
      this.idCampagne = campagneQuery
        ? +campagneQuery
        : (campagneQuery as null);
      this.hasQuery = campagneQuery !== null;
    });
    this.#gestionCampagneService.refreshCampagnes$.subscribe(() => {
      this.getCampagnes();
    });
    this.getCampagnes();

    this.searchByStatusControlSub = this.searchByStatusControl.valueChanges
      .pipe(
        switchMap((status) =>
          this.#gestionCampagneService.getCampagnes(
            status,
            this.searchControl.value,
            (this.currentPage = 0),
            this.pageSize,
            status ? true : false
          )
        )
      )
      .subscribe({
        next: (response) => {
          this.campagnesListe = response.campagnesList;
          this.totalCampagnes = response.totalCampagnes;
          this.currentPage = 1;
        },
        error: (error) => {
          this.campagnesListe = null;
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
          this.campagnesListe = response.campagnesList;
          this.totalCampagnes = response.totalCampagnes;
          this.currentPage = 1;
        },
      });
  }
  #resetCampagne() {
    this.#loaderService.show();
    this.campagnesListe = null;
  }
  getCampagnes() {
    this.#resetCampagne();
    this.#gestionCampagneService
      .getCampagnes(
        this.searchByStatusControl.value,
        this.searchControl.value,
        this.currentPage,
        this.pageSize
      )
      .subscribe({
        next: (response) => {
          this.campagnesListe = response.campagnesList;
          this.totalCampagnes = response.totalCampagnes;
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

  onEmitCampagne(campagne: Partial<Campagnes>) {
    this.emitCampagne.emit(campagne);
    this.selectedCampagne = campagne;
  }

  gotCreateCampagneForm() {
    this.#ngModal.open(CreateCampagneFormComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getCampagnes();
  }
}
