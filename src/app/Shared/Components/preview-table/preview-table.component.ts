import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PaginationComponent } from '../pagination/pagination.component';
import { BtnGenericComponent } from '../btn-generic/btn-generic.component';

@Component({
  selector: 'preview-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginationComponent,
    BtnGenericComponent,
  ],
  templateUrl: './preview-table.component.html',
  styleUrls: ['./preview-table.component.scss'],
})
export class PreviewTableComponent implements OnInit, OnChanges {
  @Input() columns: Array<{
    label: string;
    key: string;
    sortable?: boolean;
    isDescending?: boolean;
  }> = [];
  @Input() datas: any[] = [];
  @Input() pageSize: number = 10;
  @Input() maxHeight: string = '400px';

  // Signaux pour la réactivité
  private _filteredData = signal<any[]>([]);
  private _currentPage = signal(1);
  private _filterColumn = signal<string>('');
  private _filterValue = signal<string>('');

  // Contrôles de formulaire
  filterSelectController = new FormControl('');
  filterInputController = new FormControl('');
  filterSelectController2 = new FormControl('');

  // Données calculées
  filteredData = computed(() => this._filteredData());
  currentPage = computed(() => this._currentPage());
  totalItems = computed(() => this.filteredData().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize));

  // Données paginées
  paginatedData = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredData().slice(startIndex, endIndex);
  });

  // Fonctions utilitaires pour le template
  get startItemIndex(): number {
    return (this.currentPage() - 1) * this.pageSize + 1;
  }

  get endItemIndex(): number {
    return Math.min(this.currentPage() * this.pageSize, this.totalItems());
  }

  getFilterPlaceholder(): string {
    const selectedColumn = this.filterSelectController.value;
    if (selectedColumn) {
      const column = this.columns.find((c) => c.key === selectedColumn);
      return `Rechercher dans ${column?.label || selectedColumn}`;
    }
    return 'Rechercher dans toutes les colonnes';
  }

  isStatusFilterSelected(): boolean {
    const c = this.filterSelectController.value as string | null;
    return (
      !!c &&
      ['CERTIFIED', 'NOT_CERTIFIED', 'finalCertificationStatus'].includes(c)
    );
  }

  ngOnInit(): void {
    this.initializeData();
    this.setupFiltering();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datas'] || changes['columns']) {
      this.initializeData();
    }
  }

  private initializeData(): void {
    this._filteredData.set([...this.datas]);
    this._currentPage.set(1);

    if (this.columns.length > 0) {
      this._filterColumn.set(this.columns[0].key);
      this.filterSelectController.setValue(this.columns[0].key);
    }
  }

  private setupFiltering(): void {
    // Remise à zéro lorsque l'input est vidé
    this.filterInputController.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if ((value ?? '').trim() === '') {
          this._filterValue.set('');
          this.applyFilter();
        }
      });

    // Changement de colonne de filtrage (n'applique pas automatiquement)
    this.filterSelectController.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((column) => {
        this._filterColumn.set(column || '');
      });

    // Select de statut: applique immédiatement le filtre status côté client
    this.filterSelectController2.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        const isStatusColumn = [
          'CERTIFIED',
          'NOT_CERTIFIED',
          'finalCertificationStatus',
        ].includes(this._filterColumn() || '');
        if (isStatusColumn) {
          // Convertir en libellé si besoin pour comparer côté client
          const normalized = value ?? '';
          this._filterValue.set(normalized);
          this.applyFilter();
        }
      });
  }

  onFilterClick(): void {
    const column = this._filterColumn();
    // Si filtre statut, utiliser le select 2
    if (
      column &&
      ['CERTIFIED', 'NOT_CERTIFIED', 'finalCertificationStatus'].includes(
        column
      )
    ) {
      this._filterValue.set(this.filterSelectController2.value || '');
      this.applyFilter();
      return;
    }
    const value = this.filterInputController.value || '';
    this._filterValue.set(value);
    this.applyFilter();
  }

  private applyFilter(): void {
    const filterValue = this._filterValue().toLowerCase();
    const filterColumn = this._filterColumn();

    if (!filterValue || !filterColumn) {
      this._filteredData.set([...this.datas]);
    } else {
      const filtered = this.datas.filter((item) => {
        let cellValue = item[filterColumn];
        // Si filtre par statut final, mapper/normaliser comme dans generic-table-v2
        if (filterColumn === 'finalCertificationStatus') {
          // Les données côté preview-table sont dans le fichier, on compare tel quel
          // mais on accepte aussi CERTIFIED/NOT_CERTIFIED -> libellés éventuels
          const map: any = {
            CERTIFIED: 'certifié',
            NOT_CERTIFIED: 'non certifié',
          };
          if (map[filterValue.toUpperCase()]) {
            return (
              (cellValue || '').toString().toLowerCase() ===
              map[filterValue.toUpperCase()]
            );
          }
        }
        if (cellValue === null || cellValue === undefined) return false;
        return cellValue.toString().toLowerCase().includes(filterValue);
      });
      this._filteredData.set(filtered);
    }

    // Retour à la première page lors du filtrage
    this._currentPage.set(1);
  }

  onPageChange(page: number): void {
    this._currentPage.set(page);
  }

  onSort(column: any): void {
    if (!column.sortable) return;

    const currentData = [...this.filteredData()];
    const isAscending = !column.isDescending;

    currentData.sort((a, b) => {
      const aValue = a[column.key];
      const bValue = b[column.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = aValue.toString().localeCompare(bValue.toString());
      }

      return isAscending ? comparison : -comparison;
    });

    // Mettre à jour l'état de tri de la colonne
    this.columns.forEach((col) => {
      if (col.key === column.key) {
        col.isDescending = isAscending;
      } else {
        col.isDescending = undefined;
      }
    });

    this._filteredData.set(currentData);
    this._currentPage.set(1);
  }

  clearFilter(): void {
    this.filterInputController.setValue('');
    this._filterValue.set('');
    this._filteredData.set([...this.datas]);
    this._currentPage.set(1);
  }
}
