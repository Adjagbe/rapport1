import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ACCOUNTS_STATUS } from 'src/app/Core/Constants/gestion-utilisateurs.constant';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, filter, tap } from 'rxjs';
import { BtnGenericComponent } from '../btn-generic/btn-generic.component';
import { TruncatePipe } from 'src/app/Shared/Pipes/truncate.pipe';
import { CustomSelectComponent } from '../custom-select/custom-select.component';

@Component({
  selector: 'generic-table-v2',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BtnGenericComponent,
    TruncatePipe,
    CustomSelectComponent,
  ],
  templateUrl: './generic-table-v2.component.html',
  styleUrls: ['./generic-table-v2.component.scss'],
})
export class GenericTableV2Component implements OnInit {
  #destroyRef = inject(DestroyRef);
  ACCOUNTS_STATUS = ACCOUNTS_STATUS;
  filterSelectController = new FormControl('');
  filterInputController = new FormControl('');
  filterSelectController2 = new FormControl('');

  @Input() actions: boolean = false;
  @Input() actionTemplate?: TemplateRef<any>;
  @Input() maxHeight: string = '400px';
  @Input() columns: Array<{ label: string; key: string; sortable?: boolean }> =
    [
      { label: 'Nom', key: 'name', sortable: true },
      { label: 'Profils', key: 'profileName', sortable: true },
      { label: 'Statut', key: 'status' },
      { label: 'Actions', key: 'action' },
      { label: 'email', key: 'email' },
    ];
  @Input() datas: any[] | null = null;
  @Input() totalItems?: number;
  @Input() truncateLimit: number = 10;
  @Output() emitFilter = new EventEmitter<{ column: string; value: string }>();

  statusOptions = [
    { label: 'Certifiés', value: 'CERTIFIED' },
    { label: 'Non certifié', value: 'NOT_CERTIFIED' },
    { label: 'Tous', value: '' },
  ];

  get columnOptions() {
    return this.columns.map((col) => ({ label: col.label, value: col.key }));
  }

  filter$ = this.filterInputController.valueChanges.pipe(
    debounceTime(500),
    tap((value) => console.log('v: ', value)),
    filter((value) => value === ''),
    tap((input) => {
      const filterPayload = {
        column: this.filterSelectController?.value ?? '',
        value: input ?? '',
      };
      this.emitFilter.emit(filterPayload);
    })
  );

  filter$2 = this.filterSelectController2.valueChanges.pipe(
    tap((value) => console.log('v2: ', value)),
    tap((value) => {
      const filterPayload = {
        column: 'statusLibelle',
        value: value ?? '',
      };
      this.emitFilter.emit(filterPayload);
    })
  );

  onFilterFormChange() {
    const filterPayload = {
      column: this.filterSelectController?.value ?? '',
      value: this.filterInputController.value ?? '',
    };
    this.emitFilter.emit(filterPayload);
  }

  onExport() {}

  ngOnInit(): void {
    const sub = this.filter$.subscribe();
    const sub2 = this.filter$2.subscribe();
    this.filterSelectController.setValue(this.columns[0]?.key);
    this.#destroyRef.onDestroy(() => {
      sub.unsubscribe();
      sub2.unsubscribe();
    });
  }
}
