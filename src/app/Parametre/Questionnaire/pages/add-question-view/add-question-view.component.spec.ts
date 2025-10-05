import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuestionViewComponent } from './add-question-view.component';

describe('AddQuestionViewComponent', () => {
  let component: AddQuestionViewComponent;
  let fixture: ComponentFixture<AddQuestionViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddQuestionViewComponent]
    });
    fixture = TestBed.createComponent(AddQuestionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
