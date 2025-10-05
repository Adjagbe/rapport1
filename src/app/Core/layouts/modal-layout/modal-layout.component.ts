import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseIconComponent } from '../../icons/close-icon.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'modal-layout',
  standalone: true,
  imports: [CommonModule, CloseIconComponent],
  templateUrl: './modal-layout.component.html',
  styleUrls: ['./modal-layout.component.scss'],
})
export class ModalLayoutComponent {
  @Input() heading = 'Modal is working !';
  @Input() subHeading = '';
  #activeModal = inject(NgbActiveModal);
  closeModal(): void {
    this.#activeModal.close();
  }
}
