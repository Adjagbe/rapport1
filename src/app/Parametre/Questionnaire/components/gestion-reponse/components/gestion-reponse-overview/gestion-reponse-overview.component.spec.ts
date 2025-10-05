import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionReponseOverviewComponent } from './gestion-reponse-overview.component';

describe('GestionReponseOverviewComponent', () => {
  let component: GestionReponseOverviewComponent;
  let fixture: ComponentFixture<GestionReponseOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GestionReponseOverviewComponent]
    });
    fixture = TestBed.createComponent(GestionReponseOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
