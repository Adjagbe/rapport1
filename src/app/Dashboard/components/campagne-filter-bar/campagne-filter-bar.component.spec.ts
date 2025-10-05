import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampagneFilterBarComponent } from './campagne-filter-bar.component';

describe('CampagneFilterBarComponent', () => {
  let component: CampagneFilterBarComponent;
  let fixture: ComponentFixture<CampagneFilterBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CampagneFilterBarComponent]
    });
    fixture = TestBed.createComponent(CampagneFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
