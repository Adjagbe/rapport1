import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionManagementComponent } from './direction-management.component';

describe('DirectionManagementComponent', () => {
  let component: DirectionManagementComponent;
  let fixture: ComponentFixture<DirectionManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DirectionManagementComponent]
    });
    fixture = TestBed.createComponent(DirectionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
