import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'warning-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './warning-card.component.html',
  styleUrls: ['./warning-card.component.scss'],
  host: {
    '[style.--warning-background-color]': 'backgroundColor',
    '[style.--warning-font-color]': 'fontColor',
    '[style.--warning-border-color]': 'borderColor',
  },
})
export class WarningCardComponent {
  @Input() text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.';
  @Input() backgroundColor: string = '#fffeea';
  @Input() fontColor: string = 'rgba(72, 33, 0, 1)';
  @Input() borderColor: string = '#fab900';
}
