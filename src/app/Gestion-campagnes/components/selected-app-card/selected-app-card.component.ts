import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'selected-app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-app-card.component.html',
  styleUrls: ['./selected-app-card.component.scss'],
})
export class SelectedAppCardComponent {
  @Input() name: string = '';
  @Input() fileName: string = '';

  @Output() previewEvent = new EventEmitter<void>();

  onPreview() {
    this.previewEvent.emit();
  }
}
