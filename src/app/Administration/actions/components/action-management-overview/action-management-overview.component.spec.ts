import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionManagementOverviewComponent } from './action-management-overview.component';


describe('ActionManagementOverviewComponent', () => {
  let component: ActionManagementOverviewComponent;
  let fixture: ComponentFixture<ActionManagementOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActionManagementOverviewComponent]
    });
    fixture = TestBed.createComponent(ActionManagementOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
