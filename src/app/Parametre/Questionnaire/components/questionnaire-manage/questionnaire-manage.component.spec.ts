import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireManageComponent } from './questionnaire-manage.component';

describe('QuestionnaireManageComponent', () => {
  let component: QuestionnaireManageComponent;
  let fixture: ComponentFixture<QuestionnaireManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuestionnaireManageComponent]
    });
    fixture = TestBed.createComponent(QuestionnaireManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
