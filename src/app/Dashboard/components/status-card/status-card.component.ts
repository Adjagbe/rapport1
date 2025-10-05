import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'status-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss'],
})
export class StatusCardComponent {
  @Input() iconClass: 'blue' | 'danger' | 'grey' | 'yellow' = 'blue';
  @Input() value: number | null = null;
  @Input() label: string = '';
  @Input() subLabel: string = '';
}
