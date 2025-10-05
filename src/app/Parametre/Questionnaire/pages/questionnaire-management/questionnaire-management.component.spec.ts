import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireManagementComponent } from './questionnaire-management.component';

describe('QuestionnaireManagementComponent', () => {
  let component: QuestionnaireManagementComponent;
  let fixture: ComponentFixture<QuestionnaireManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuestionnaireManagementComponent]
    });
    fixture = TestBed.createComponent(QuestionnaireManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
