import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlateformeViewComponent } from './add-plateforme-view.component';

describe('AddPlateformeViewComponent', () => {
  let component: AddPlateformeViewComponent;
  let fixture: ComponentFixture<AddPlateformeViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddPlateformeViewComponent]
    });
    fixture = TestBed.createComponent(AddPlateformeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
