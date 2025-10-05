import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';

@Component({
  selector: 'switch-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './switch-control.component.html',
  styleUrls: ['./switch-control.component.scss'],
})
export class SwitchControlComponent implements OnInit, OnDestroy {
  @Input() value = new FormControl(true, { nonNullable: true });
  @Output() valueChanged = new EventEmitter<boolean>(false);

  

  valueSub$ = this.value.valueChanges
    .pipe(tap(() => this.emitValue()))
    .subscribe();

  ngOnInit(): void {
    this.emitValue();
  }

  emitValue() {
    this.valueChanged.emit(this.value.value);
  }

  ngOnDestroy(): void {
    this.valueSub$?.unsubscribe();
  }
}
