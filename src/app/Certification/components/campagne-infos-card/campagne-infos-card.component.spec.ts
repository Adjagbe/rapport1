import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampagneInfosCardComponent } from './campagne-infos-card.component';

describe('CampagneInfosCardComponent', () => {
  let component: CampagneInfosCardComponent;
  let fixture: ComponentFixture<CampagneInfosCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CampagneInfosCardComponent]
    });
    fixture = TestBed.createComponent(CampagneInfosCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
