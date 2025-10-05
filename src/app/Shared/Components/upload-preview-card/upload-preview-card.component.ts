import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseIconComponent } from 'src/app/Core/icons/close-icon.component';

@Component({
  selector: 'upload-preview-card',
  standalone: true,
  imports: [CommonModule, CloseIconComponent],
  templateUrl: './upload-preview-card.component.html',
  styleUrls: ['./upload-preview-card.component.scss'],
})
export class UploadPreviewCardComponent {
  @Output() _ = new EventEmitter<void>();

  onRemove() {
    this._.emit();
  }
}
