import { Component, ElementRef, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'button.generic-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './btn-generic.component.html',
  styleUrls: ['./btn-generic.component.scss'],
  host: {
    '[class]': 'variante',
    '[class.outline-none]': 'isDisabled',
  },
})
export class BtnGenericComponent {
  #host = inject(ElementRef);
  @Input() text = '';
  @Input() variante:
    | 'primary'
    | 'primary sm'
    | 'primary outline'
    | 'secondary'
    | 'secondary outline'
    | 'tertiary'
    | 'tertiary muted sm'
    | 'tertiary outline success'
    | 'tertiary danger'
    | 'tertiary muted'
    | 'secondary muted'
    | 'primary outline'
    | 'primary muted' = 'primary';

  get isDisabled(): boolean {
    // Vérifie si l'attribut 'disabled' est présent sur le host
    return this.#host.nativeElement.hasAttribute('disabled');
  }
}
