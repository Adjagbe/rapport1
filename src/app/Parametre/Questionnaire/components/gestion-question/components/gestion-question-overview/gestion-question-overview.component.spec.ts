import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionQuestionOverviewComponent } from './gestion-question-overview.component';

describe('GestionQuestionOverviewComponent', () => {
  let component: GestionQuestionOverviewComponent;
  let fixture: ComponentFixture<GestionQuestionOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GestionQuestionOverviewComponent]
    });
    fixture = TestBed.createComponent(GestionQuestionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
