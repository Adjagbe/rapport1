import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalLayoutComponent } from 'src/app/Core/layouts/modal-layout/modal-layout.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PaginationComponent } from 'src/app/Shared/Components/pagination/pagination.component';
import { GestionCampagnesService } from 'src/app/Core/Services/gestion-campagnes.service';
import { ACCOUNTS_STATUS } from 'src/app/Core/Constants/gestion-utilisateurs.constant';
import { BtnGenericComponent } from '../Components/btn-generic/btn-generic.component';

type BackendFilter = { column: string; value: string } | undefined;

@Component({
  selector: 'prefill-file-preview',
  standalone: true,
  imports: [
    CommonModule,
    ModalLayoutComponent,
    ReactiveFormsModule,
    PaginationComponent,
    BtnGenericComponent,
  ],
  template: `
    <modal-layout heading="Prévisualisation des comptes pré-remplis">
      <div class="wrapper">
        <div class="table-heading">
          <div class="text-container">
            <span>Total des utilisateurs: </span>
            <small>({{ totalItems }} utilisateurs)</small>
          </div>
          <div class="filter-container">
            <div class="d-flex gap-4">
              <select [formControl]="filterSelectController">
                <option *ngFor="let col of columns" [value]="col.key">
                  {{ col.label }}
                </option>
              </select>
              <input
                type="text"
                [placeholder]="getFilterPlaceholder()"
                [formControl]="filterInputController"
                *ngIf="!isStatusFilterSelected()"
              />
              <select
                [formControl]="filterSelectController2"
                *ngIf="isStatusFilterSelected()"
              >
                <option value="CERTIFIED">Certifiés</option>
                <option value="NOT_CERTIFIED">Non certifié</option>
                <option value="">Tous</option>
              </select>
              <button
                class="generic-btn"
                variante="tertiary"
                type="button"
                (click)="onFilterClick()"
              >
                filtrer
              </button>
            </div>
          </div>
        </div>

        <div
          class="table-scroll-container rounded"
          [style.max-height]="maxHeight"
        >
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th *ngFor="let col of columns">{{ col.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of rows; index as i">
                <td>{{ (currentPage - 1) * pageSize + i + 1 }}</td>
                <td>{{ row.login }}</td>
                <td [title]="row.firstName + ' ' + row.lastName">
                  {{ row.firstName }} {{ row.lastName }}
                </td>
                <td [title]="row.email">{{ row.email }}</td>
                <td>{{ row.cuid }}</td>
                <td>{{ row.profileName }}</td>
                <td>
                  <span
                    [ngClass]="{
                      certified:
                        row.finalCertificationStatusLibelle === 'certifié',
                      uncertified:
                        row.finalCertificationStatusLibelle === 'non certifié'
                    }"
                    [title]="row.finalCertificationStatus"
                  >
                    {{ row.finalCertificationStatusLibelle }}
                  </span>
                </td>
                <td [title]="row.departmentName">{{ row.departmentName }}</td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="!rows.length" class="no-data">
            <p class="text-muted">Aucune donnée trouvée</p>
          </div>
        </div>

        <div class="pagination-container" *ngIf="totalPages > 1">
          <pagination
            [totalItems]="totalItems"
            [pageSize]="pageSize"
            [currentPage]="currentPage"
            (pageChange)="onPageChange($event)"
          ></pagination>
        </div>

        <div class="pagination-info">
          <small class="text-muted">
            Affichage de {{ startItemIndex }} à {{ endItemIndex }} sur
            {{ totalItems }} éléments
          </small>
        </div>
      </div>
    </modal-layout>
  `,
  styleUrls: ['./prefill-file-preview.component.scss'],
})
export class PrefillFilePreviewComponent {
  #activeModal = inject(NgbActiveModal);
  #campagneService = inject(GestionCampagnesService);

  @Input() config!: { idCampagne: number; idApplication: number };

  // Configuration d'affichage
  pageSize = 5;
  currentPage = 1;
  totalItems = 0;
  maxHeight: string = '500px';

  // Données
  rows: any[] = [];

  // Colonnes affichées
  columns: Array<{ label: string; key: string }> = [
    { label: 'Login', key: 'login' },
    { label: 'Nom', key: 'name' },
    { label: 'Adresse', key: 'email' },
    { label: 'Cuid', key: 'cuid' },
    { label: 'Profils', key: 'profileName' },
    { label: 'Statut', key: 'finalCertificationStatus' },
    { label: 'Direction', key: 'departmentName' },
  ];

  // Contrôles de filtre
  filterSelectController = new FormControl<string>('name', {
    nonNullable: true,
  });
  filterInputController = new FormControl<string>('');
  filterSelectController2 = new FormControl<string>('');

  ngOnInit() {
    this.setupFiltering();
    this.fetchPage();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get startItemIndex(): number {
    if (this.totalItems === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItemIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  getFilterPlaceholder(): string {
    const selected = this.filterSelectController.value;
    const col = this.columns.find((c) => c.key === selected);
    return col ? `Rechercher dans ${col.label}` : 'Rechercher';
  }

  isStatusFilterSelected(): boolean {
    const c = this.filterSelectController.value;
    return (
      !!c &&
      ['CERTIFIED', 'NOT_CERTIFIED', 'finalCertificationStatus'].includes(c)
    );
  }

  clearFilter(): void {
    this.filterInputController.setValue('');
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchPage();
  }

  private setupFiltering(): void {
    this.filterInputController.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        // Si le champ est vidé, on remet le tableau à l'état initial
        if ((value ?? '').trim() === '') {
          this.currentPage = 1;
          this.fetchPage();
        }
      });

    // Select de statut: applique immédiatement le filtre statusLibelle
    this.filterSelectController2.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (
          this.filterSelectController.value &&
          ['CERTIFIED', 'NOT_CERTIFIED', 'finalCertificationStatus'].includes(
            this.filterSelectController.value as string
          )
        ) {
          this.currentPage = 1;
          this.fetchPage();
        }
      });
  }

  onFilterClick(): void {
    this.currentPage = 1;
    this.fetchPage();
  }

  private currentFilter(): BackendFilter {
    const column = this.filterSelectController.value;
    // Si on filtre par statut, utiliser la valeur du select 2
    if (
      column &&
      ['CERTIFIED', 'NOT_CERTIFIED', 'finalCertificationStatus'].includes(
        column as string
      )
    ) {
      const statusValue = this.filterSelectController2.value ?? '';
      return statusValue !== ''
        ? ({ column: 'statusLibelle', value: statusValue } as BackendFilter)
        : undefined;
    }

    const value = (this.filterInputController.value || '').trim();
    if (!value || !column) return undefined;
    return { column, value } as BackendFilter;
  }

  private fetchPage(): void {
    if (!this.config) return;
    this.#campagneService
      .getUsersByCampaignApplication(
        this.config.idCampagne,
        this.config.idApplication,
        this.currentPage,
        this.pageSize,
        this.currentFilter()
      )
      .subscribe({
        next: (res) => {
          this.rows = (res.items || []).map((user: any) => ({
            ...user,
            finalCertificationStatusLibelle:
              ACCOUNTS_STATUS[
                user.finalCertificationStatus as keyof typeof ACCOUNTS_STATUS
              ] || user.finalCertificationStatus,
          }));
          this.totalItems = res.count || this.rows.length || 0;
        },
        error: () => {
          this.rows = [];
          this.totalItems = 0;
        },
      });
  }

  close() {
    this.#activeModal.close();
  }
}
