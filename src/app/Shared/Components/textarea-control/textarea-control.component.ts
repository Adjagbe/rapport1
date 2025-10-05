import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'textarea-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './textarea-control.component.html',
  styleUrls: ['./textarea-control.component.scss']
})
export class TextareaControlComponent {

  @Input() isRequired = true;
  @Input() subLabel: string | null = null;
  @Input() label = '';
  @Input() rows: number = 4; // nombre de lignes par défaut
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() from: 'left' | 'right' = 'right';

  @Output() valueChange = new EventEmitter<string>();

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }
  
}
