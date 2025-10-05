import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireOverviewComponent } from './questionnaire-overview.component';

describe('QuestionnaireOverviewComponent', () => {
  let component: QuestionnaireOverviewComponent;
  let fixture: ComponentFixture<QuestionnaireOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuestionnaireOverviewComponent]
    });
    fixture = TestBed.createComponent(QuestionnaireOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
