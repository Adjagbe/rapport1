import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CloseIconComponent } from '../../icons/close-icon.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule,CloseIconComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
 @Input() subHeading = '';
  #activeModal = inject(NgbActiveModal);
  closeModal(): void {
    this.#activeModal.close();
  }
}
