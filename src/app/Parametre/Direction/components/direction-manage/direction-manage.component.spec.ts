import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionManageComponent } from './direction-manage.component';

describe('DirectionManageComponent', () => {
  let component: DirectionManageComponent;
  let fixture: ComponentFixture<DirectionManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DirectionManageComponent]
    });
    fixture = TestBed.createComponent(DirectionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
