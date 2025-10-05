import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCampagnePageComponent } from './gestion-campagne-page.component';

describe('GestionCampagnePageComponent', () => {
  let component: GestionCampagnePageComponent;
  let fixture: ComponentFixture<GestionCampagnePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GestionCampagnePageComponent]
    });
    fixture = TestBed.createComponent(GestionCampagnePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
