import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddActionViewComponent } from './add-action-view.component';


describe('AddActionViewComponent', () => {
  let component: AddActionViewComponent;
  let fixture: ComponentFixture<AddActionViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddActionViewComponent]
    });
    fixture = TestBed.createComponent(AddActionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
