import { Component, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorIconRoundedComponent } from 'src/app/Core/icons/error-icon-rounded.component';

@Component({
  selector: 'error-message',
  standalone: true,
  imports: [CommonModule, ErrorIconRoundedComponent],
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  @Input() viewMessage = true;
  projectedContent?: ElementRef<HTMLElement>;

  @Input() errorMessage =
    'Login non reconnu. Vérifiez vos informations et réessayez. Si le problème persiste, contactez le support technique.';
}
