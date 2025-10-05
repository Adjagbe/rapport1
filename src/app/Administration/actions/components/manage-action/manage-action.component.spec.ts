import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageActionComponent } from './manage-action.component';


describe('ManageActionComponent', () => {
  let component: ManageActionComponent;
  let fixture: ComponentFixture<ManageActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ManageActionComponent]
    });
    fixture = TestBed.createComponent(ManageActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
