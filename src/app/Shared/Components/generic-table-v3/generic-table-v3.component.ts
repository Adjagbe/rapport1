import { Component, DestroyRef, EventEmitter, inject, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ACCOUNTS_STATUS } from 'src/app/Core/Constants/gestion-utilisateurs.constant';
import { EditIconComponent2 } from 'src/app/Core/icons/edit-icon2.component';
import { PlusIconComponent } from 'src/app/Core/icons/plus-icon.component';
import { SearchIconComponent } from 'src/app/Core/icons/search-icon.component';
import { LockIconComponent } from 'src/app/Core/icons/lock-icon.component';
import { TrashIconComponent } from 'src/app/Core/icons/trash-icon.component';
import { BtnGenericComponent } from '../btn-generic/btn-generic.component';
import { UnlockIconComponent } from 'src/app/Core/icons/unlock-icon.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { DownIconComponent } from 'src/app/Core/icons/down-icon.component';
import { PopoverModule } from 'ngx-bootstrap/popover';

@Component({
  selector: 'app-generic-table-v3',
  standalone: true,
  imports: [CommonModule, 
      ReactiveFormsModule,
      EditIconComponent2,
      SearchIconComponent,
      TrashIconComponent,
      PlusIconComponent,
      LockIconComponent,
      UnlockIconComponent,
      BtnGenericComponent,
      PaginationComponent,
      DownIconComponent,
      FormsModule,
      PopoverModule],
  templateUrl: './generic-table-v3.component.html',
  styleUrls: ['./generic-table-v3.component.scss']
})
export class GenericTableV3Component {
  #destroyRef = inject(DestroyRef);
    ACCOUNTS_STATUS = ACCOUNTS_STATUS;
  
    filterSelectController = new FormControl('');
    
    filterInputController = new FormControl('');
    filter : string =''
    filter$: any;
    currentPage = 1;
    pageSize = 4; // Ou la valeur par défaut souhaitée
    // totalItems = 0; // Nombre total d'éléments pour la pagination
    @Input() actions: boolean = false;
    @Input() actionTemplate?: TemplateRef<any>;
    @Input() maxHeight: string = '400px';
    @Input() columns: Array<{ label: string; key: string; sortable?: boolean }> =
      [
        { label: 'Nom', key: 'name', sortable: true },
        { label: 'Profils', key: 'profile', sortable: true },
        { label: 'Statut', key: 'status' },
        { label: 'email', key: 'email' },
        { label: 'Actions', key: 'action' },
        
      ];
    @Input() statusClr: { [key: string]: string } = {};
    @Input() datas: any[] | null = null;
    @Input() totalItems: number = 0;
    @Input() btnTextCreate: string = '';
    @Input() nameListe: string = '';
    @Input() isViewDelete: boolean = true;
    @Input() isViewUpdate: boolean = true;
    @Input() isAction: boolean = false;
  
    @Output() onCreateUser = new EventEmitter<void>();
    
    @Output() onFilterUser = new EventEmitter<void>();
    @Output() onSearch = new EventEmitter<void>();
  
    @Output() editClick = new EventEmitter<any>();
    @Output() deleteClick = new EventEmitter<any>();
    @Output() lockClick = new EventEmitter<any>(); 
    @Output() unlockClick = new EventEmitter<any>(); 
    @Output() pageChange = new EventEmitter<{
      [key: string]: string;
      index: string;
      pageSize: string;
    }>();
  
  
      getStatusLabel(value: any): string {
      if (value === true || value === 'true') return 'Inactif';
      if (value === false || value === 'false') return 'Actif';
      return value; // pour les cas où c'est déjà "Actif"/"Inactif"
    }
  
    onCreateUserClick() {
      this.onCreateUser.emit()
    }
  
    Search(event : any){
      this.onSearch.emit(event);
    }
    FilterUserClick() {
        this.onFilterUser.emit()
    }
  
    editItem(item: any) {
      this.editClick.emit(item);
    }
  
    deleteItem(item: any) {
      this.deleteClick.emit(item);
    }
  
    lockItem(item: any) {
      this.lockClick.emit(item);
    }
  
    unlockItem(item: any) {
      this.unlockClick.emit(item);
    }
  
    onPageChange(index: number) {
      console.log(`new index: ${index} and old ${this.currentPage}`);
  
      this.currentPage = index; // Met à jour la page actuelle
  
      this.pageChange.emit({
        index: `${this.currentPage - 1}`, // Soustraction de 1 car l'index commence à 0
        pageSize: `${this.pageSize}`,
      });
    }
  
    @Output() emitFilter = new EventEmitter<{ column: string; value: string }>();
    @Output() emitChangeFilter = new EventEmitter<{ [cloumn: string]: string }>();
  
    onFilterFormChange() {
    // this.filter$ = this.filterInputController.valueChanges.pipe(
    //   debounceTime(500),
    //   tap((input) => {
       const column = this.filterSelectController?.value ?? '';
        const value = this.filterInputController.value ?? '';
        const filterPayload = {
          [column]: value
        };
        console.log(filterPayload)
        this.emitChangeFilter.emit(filterPayload);
    //   })
    // );
  }
  
    ngOnInit(): void {
      const sub = this.filter$.subscribe();
  
      this.#destroyRef.onDestroy(() => {
        sub?.unsubscribe();
      });
    }
}
