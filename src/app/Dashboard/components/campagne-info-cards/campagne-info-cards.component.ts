import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'campagne-info-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campagne-info-cards.component.html',
  styleUrls: ['./campagne-info-cards.component.scss'],
  host: {
    '[class.card-blue]': 'type === "blue"',
    '[class.card-purple]': 'type === "purple"',
    '[class.card-green]': 'type === "green"',
    '[class.card-pink]': 'type === "pink"',
    '[class.card-grey]': 'type === "grey"',
    '[class.card-orange]': 'type === "orange"',
    '[class.card-red]': 'type === "red"',
  },
})
export class CampagneInfoCardComponent {
  @Input() label!: string;
  @Input() value!: number | string;
  @Input() type:
    | 'blue'
    | 'purple'
    | 'green'
    | 'pink'
    | 'grey'
    | 'orange'
    | 'red' = 'blue';
  @Input() unit: string | null = null;
}
