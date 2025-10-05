import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';

@Component({
  selector: 'campagne-infos-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campagne-infos-card.component.html',
  styleUrls: ['./campagne-infos-card.component.scss'],
  host: {
    '[class.card-blue]': 'type === "blue"',
    '[class.card-pink]': 'type === "pink"',
    '[class.card-green]': 'type === "green"',
    '[class.card-yellow]': 'type === "yellow"',
  },
})
export class CampagneInfosCardComponent {
  @Input() label!: string;
  @Input() value!: number | string | null;
  @Input() type: 'blue' | 'pink' | 'green' | 'yellow' = 'blue';
}
