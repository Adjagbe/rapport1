import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampagneCardComponent } from './campagne-card.component';

describe('CampagneCardComponent', () => {
  let component: CampagneCardComponent;
  let fixture: ComponentFixture<CampagneCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CampagneCardComponent]
    });
    fixture = TestBed.createComponent(CampagneCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
