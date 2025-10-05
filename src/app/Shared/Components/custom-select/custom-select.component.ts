import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
  ViewChild,
  TemplateRef,
  ContentChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
  icon?: string;
  [key: string]: any; // Index signature pour supporter l'indexation dynamique
}

@Component({
  selector: 'custom-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
  template: `
    <div
      class="custom-select"
      [class.open]="isOpen"
      [class.disabled]="disabled"
      [class.focused]="isFocused"
    >
      <div
        class="select-trigger"
        (click)="toggleDropdown()"
        (keydown)="onKeyDown($event)"
        tabindex="0"
        role="combobox"
        [attr.aria-expanded]="isOpen"
        [attr.aria-haspopup]="true"
      >
        <div class="select-value">
          <ng-container *ngIf="selectedOption; else placeholder">
            <ng-container
              *ngTemplateOutlet="
                selectedItemTemplate || defaultSelectedTemplate;
                context: { $implicit: selectedOption }
              "
            >
            </ng-container>
          </ng-container>
          <ng-template #placeholder>
            <span class="placeholder">{{
              placeholder || 'Sélectionner...'
            }}</span>
          </ng-template>
        </div>

        <div class="select-arrow">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <div class="select-dropdown" *ngIf="isOpen">
        <div class="dropdown-content">
          <!-- Champ de recherche -->
          <div *ngIf="filterable" class="search-container">
            <input
              type="text"
              [placeholder]="filterPlaceholder"
              [value]="filterValue"
              (input)="onFilterInput($event)"
              class="search-input"
              autocomplete="off"
            />
          </div>

          <div
            *ngFor="let option of filteredOptions; trackBy: trackByValue"
            class="select-option"
            [class.selected]="isOptionSelected(option)"
            [class.disabled]="option.disabled"
            (click)="selectOption(option)"
            (keydown)="onOptionKeyDown($event, option)"
            tabindex="0"
            role="option"
            [attr.aria-selected]="isOptionSelected(option)"
          >
            <ng-container
              *ngTemplateOutlet="
                itemTemplate || defaultItemTemplate;
                context: { $implicit: option }
              "
            >
            </ng-container>
          </div>

          <div *ngIf="filteredOptions.length === 0" class="no-options">
            <span>Aucune option disponible</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Templates par défaut -->
    <ng-template #defaultSelectedTemplate let-option>
      <span>{{ displayValue }}</span>
    </ng-template>

    <ng-template #defaultItemTemplate let-option>
      <span>{{ option.label }}</span>
    </ng-template>
  `,
  styleUrls: ['./custom-select.component.scss'],
})
export class CustomSelectComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() clearable: boolean = false;
  @Input() filterable: boolean = true;
  @Input() filterPlaceholder: string = 'Rechercher...';
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() trackBy: string = 'value';

  @Output() selectionChange = new EventEmitter<any>();
  @Output() dropdownOpen = new EventEmitter<void>();
  @Output() dropdownClose = new EventEmitter<void>();

  @ContentChild('selectedItemTemplate') selectedItemTemplate?: TemplateRef<any>;
  @ContentChild('itemTemplate') itemTemplate?: TemplateRef<any>;

  @ViewChild('dropdown') dropdownRef?: ElementRef;

  onFilterInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filterValue = target.value;
  }

  isOpen = false;
  isFocused = false;
  selectedOption: SelectOption | null = null;
  filterValue = '';
  private destroy$ = new Subject<void>();

  // ControlValueAccessor
  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.processOptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get filteredOptions(): SelectOption[] {
    if (!this.filterable || !this.filterValue) {
      return this.options;
    }
    return this.options.filter((option) =>
      option.label.toLowerCase().includes(this.filterValue.toLowerCase())
    );
  }

  // get displayValue(): string {
  //   if (!this.selectedOption) {
  //     return this.placeholder || '';
  //   }
  //   return this.selectedOption.label || '';
  // }

  processOptions() {
    if (this.options && this.options.length > 0) {
      this.options = this.options.map((option) => {
        if (typeof option === 'object') {
          return {
            label: option[this.optionLabel] || option.label || '',
            value: option[this.optionValue] || option.value,
            disabled: option.disabled || false,
            icon: option.icon || '',
          } as SelectOption;
        }
        return {
          label: String(option),
          value: option,
          disabled: false,
        } as SelectOption;
      });
    }
  }

  toggleDropdown() {
    if (this.disabled) return;

    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.dropdownOpen.emit();
      this.isFocused = true;
    } else {
      this.dropdownClose.emit();
      this.isFocused = false;
    }
  }

  selectOption(option: SelectOption) {
    if (option.disabled) return;

    this.selectedOption = option;
    this.isOpen = false;
    this.isFocused = false;
    this.onChange(option.value);
    this.onTouched();
    this.selectionChange.emit(option.value);
  }

  isOptionSelected(option: SelectOption): boolean {
    return this.selectedOption?.value === option.value;
  }

  trackByValue(index: number, option: SelectOption): any {
    return option[this.trackBy as keyof SelectOption] || option.value;
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleDropdown();
        break;
      case 'Escape':
        this.isOpen = false;
        this.isFocused = false;
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.toggleDropdown();
        }
        break;
    }
  }

  onOptionKeyDown(event: KeyboardEvent, option: SelectOption) {
    if (option.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectOption(option);
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.isFocused = false;
    }
  }

  writeValue(value: any): void {
    console.log('[writeValue] Valeur reçue:', value);

    if (value !== undefined && value !== null) {
      let searchValue = value;

      // Si la valeur est un objet, extraire la vraie valeur
      if (typeof value === 'object' && value !== null) {
        // Chercher les propriétés communes qui pourraient contenir la vraie valeur
        searchValue =
          value.optionValue ||
          value.idRelatedDepartment ||
          value.value ||
          value;
      }

      // Chercher l'option correspondante dans les options disponibles
      this.selectedOption =
        this.options.find((option) => {
          return (
            option.value === searchValue ||
            option.value === value ||
            (typeof value === 'object' && option.value === value.optionValue)
          );
        }) || null;

      console.log('[writeValue] Option trouvée:', this.selectedOption);
    } else {
      this.selectedOption = null;
    }
  }

  // Ajoutez aussi cette méthode pour améliorer le debugging :
  get displayValue(): string {
    if (!this.selectedOption) {
      return this.placeholder || '';
    }

    // Vérification de sécurité pour éviter [object Object]
    const label = this.selectedOption.label;
    if (typeof label === 'object') {
      console.warn(
        '[CustomSelect] Label is an object, this might cause display issues:',
        label
      );
      return String(label);
    }

    return label || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private elementRef = inject(ElementRef);
}
