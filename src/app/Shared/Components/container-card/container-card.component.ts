import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CustomSelectComponent } from '../custom-select/custom-select.component';

@Component({
  selector: 'container-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomSelectComponent],
  templateUrl: './container-card.component.html',
  styleUrls: ['./container-card.component.scss'],
})
export class ContainerCardComponent {
  @Input() iconSlot: boolean = true;
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() filter: { label: string; value: string }[] | null = [];

  @Output() filterChange = new EventEmitter<
    'day' | 'week' | 'month' | 'year'
  >();

  filterControl = new FormControl('day');

  ngOnInit(): void {
    this.filterControl.valueChanges.subscribe((value) => {
      value &&
        this.filterChange.emit(value as 'day' | 'week' | 'month' | 'year');
    });
  }
}
