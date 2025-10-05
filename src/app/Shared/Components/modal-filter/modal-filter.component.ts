import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from 'src/app/Core/layouts/modal/modal.component';
import { BtnGenericComponent } from '../btn-generic/btn-generic.component';
import { ReloadIconComponent } from 'src/app/Core/icons/reload-icon.component';
import { ValidIconComponent } from 'src/app/Core/icons/valid-icon.component';
import { PreviewIconComponent } from 'src/app/Core/icons/preview-icon.component';
import { EntrerIconComponent } from 'src/app/Core/icons/entrer-icon.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SearchIconComponent } from 'src/app/Core/icons/search-icon.component';
import { CustomSelectComponent } from '../custom-select/custom-select.component';
import { NgbPanelTitle } from "../../../../../node_modules/@ng-bootstrap/ng-bootstrap/accordion/accordion";

@Component({
  selector: 'app-modal-filter',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    BtnGenericComponent,
    ReloadIconComponent,
    EntrerIconComponent,
    ReactiveFormsModule,
    SearchIconComponent,
    CustomSelectComponent,
    NgbPanelTitle
],
  templateUrl: './modal-filter.component.html',
  styleUrls: ['./modal-filter.component.scss'],
})
export class ModalFilterComponent {
  @Input() columnsUser: Array<{
    label: string;
    key: string;
    sortable?: boolean;
  }> = [];

  filterSelectController = new FormControl('');
  filterInputController = new FormControl('');

  get columnOptions() {
    return [
      { label: 'Rechercher par', value: '' },
      ...this.columnsUser.map((col) => ({ label: col.label, value: col.key })),
    ];
  }

  @Output() emitChangeFilter = new EventEmitter<{ [cloumn: string]: string }>();

  onFilterFormChange() {
    const column = this.filterSelectController?.value ?? '';
    const value = this.filterInputController.value ?? '';
    const filterPayload = {
      [column]: value,
    };
    console.log(filterPayload);
    this.emitChangeFilter.emit(filterPayload);
  }

  

  resetFilter() {
    this.filterSelectController.setValue('');
    this.filterInputController.setValue('');
    this.emitChangeFilter.emit(); // émet un filtre vide au parent
  }
}
