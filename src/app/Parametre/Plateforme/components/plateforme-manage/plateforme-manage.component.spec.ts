import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateformeManageComponent } from './plateforme-manage.component';

describe('PlateformeManageComponent', () => {
  let component: PlateformeManageComponent;
  let fixture: ComponentFixture<PlateformeManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlateformeManageComponent]
    });
    fixture = TestBed.createComponent(PlateformeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
