import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'root' })
export class NgbDateISOAdapter extends NgbDateAdapter<string> {
  fromModel(value: string | null): NgbDateStruct | null {
    if (!value) return null;
    const [year, month, day] = value.split('-').map((v) => Number(v));
    if (!year || !month || !day) return null;
    return { year, month, day } as NgbDateStruct;
  }

  toModel(date: NgbDateStruct | null): string | null {
    if (!date) return null;
    const y = String(date.year).padStart(4, '0');
    const m = String(date.month).padStart(2, '0');
    const d = String(date.day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
