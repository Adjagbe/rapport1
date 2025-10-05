import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewTableComponent } from '../Components/preview-table/preview-table.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalLayoutComponent } from 'src/app/Core/layouts/modal-layout/modal-layout.component';

@Component({
  selector: 'file-preview-modal',
  standalone: true,
  imports: [CommonModule, PreviewTableComponent, ModalLayoutComponent],
  template: `
    <modal-layout heading="Prévisualisation du fichier">
      <div class="wrapper">
        <preview-table
          [columns]="columns"
          [datas]="datas"
          [pageSize]="8"
          [maxHeight]="'500px'"
        ></preview-table>
      </div>
    </modal-layout>
  `,
  styleUrls: ['./file-preview-modal.component.scss'],
})
export class FilePreviewModalComponent {
  #activeModal = inject(NgbActiveModal);
  @Input() columns: any[] = [];
  @Input() datas: any[] = [];

  close() {
    this.#activeModal.close();
  }
}
