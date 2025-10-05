import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { PreviewTableComponent } from './preview-table.component';
import { PaginationComponent } from '../pagination/pagination.component';

describe('PreviewTableComponent', () => {
  let component: PreviewTableComponent;
  let fixture: ComponentFixture<PreviewTableComponent>;

  const mockColumns = [
    { label: 'Nom', key: 'name', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Statut', key: 'status', sortable: false },
  ];

  const mockData = [
    { name: 'John Doe', email: 'john@example.com', status: 'Actif' },
    { name: 'Jane Smith', email: 'jane@example.com', status: 'Inactif' },
    { name: 'Bob Johnson', email: 'bob@example.com', status: 'Actif' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PreviewTableComponent,
        ReactiveFormsModule,
        PaginationComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewTableComponent);
    component = fixture.componentInstance;

    component.columns = mockColumns;
    component.datas = mockData;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct data', () => {
    expect(component.totalItems()).toBe(3);
    expect(component.currentPage()).toBe(1);
    expect(component.paginatedData().length).toBe(3);
  });

  it('should filter data correctly', () => {
    component.filterInputController.setValue('John');
    component.filterSelectController.setValue('name');

    expect(component.totalItems()).toBe(1);
    expect(component.paginatedData()[0].name).toBe('John Doe');
  });

  it('should handle pagination correctly', () => {
    component.pageSize = 2;
    component.onPageChange(2);

    expect(component.currentPage()).toBe(2);
    expect(component.paginatedData().length).toBe(1);
  });

  it('should sort data correctly', () => {
    const nameColumn = mockColumns[0];
    component.onSort(nameColumn);

    expect(component.paginatedData()[0].name).toBe('Bob Johnson');
    expect(component.paginatedData()[1].name).toBe('Jane Smith');
    expect(component.paginatedData()[2].name).toBe('John Doe');
  });

  it('should clear filter correctly', () => {
    component.filterInputController.setValue('John');
    component.clearFilter();

    expect(component.totalItems()).toBe(3);
    expect(component.currentPage()).toBe(1);
  });

  it('should handle empty data', () => {
    component.datas = [];
    fixture.detectChanges();

    expect(component.totalItems()).toBe(0);
    expect(component.paginatedData().length).toBe(0);
  });
});
