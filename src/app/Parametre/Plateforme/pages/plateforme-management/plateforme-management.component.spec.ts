import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateformeManagementComponent } from './plateforme-management.component';

describe('PlateformeManagementComponent', () => {
  let component: PlateformeManagementComponent;
  let fixture: ComponentFixture<PlateformeManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlateformeManagementComponent]
    });
    fixture = TestBed.createComponent(PlateformeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
