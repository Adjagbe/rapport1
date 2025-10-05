import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCampagneOverviewComponent } from './gestion-campagne-overview.component';

describe('GestionCampagneOverviewComponent', () => {
  let component: GestionCampagneOverviewComponent;
  let fixture: ComponentFixture<GestionCampagneOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GestionCampagneOverviewComponent]
    });
    fixture = TestBed.createComponent(GestionCampagneOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
