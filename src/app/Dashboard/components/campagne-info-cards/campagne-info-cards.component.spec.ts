import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampagneInfoCardsComponent } from './campagne-info-cards.component';

describe('CampagneInfoCardsComponent', () => {
  let component: CampagneInfoCardsComponent;
  let fixture: ComponentFixture<CampagneInfoCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CampagneInfoCardsComponent]
    });
    fixture = TestBed.createComponent(CampagneInfoCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
