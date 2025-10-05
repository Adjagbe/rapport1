import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'form-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.scss'],
})
export class FormControlComponent {
  @Input() isRequired = true;
  @Input() subLabel: string | null = null;
  @Input() label = '';
  @Input() isRequiredField = false;
  @Input() from: 'left' | 'right' = 'right';

  @Output() showIconEvent = new EventEmitter<void>();
}
