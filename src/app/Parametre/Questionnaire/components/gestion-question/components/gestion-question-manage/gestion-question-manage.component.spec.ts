import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionQuestionManageComponent } from './gestion-question-manage.component';

describe('GestionQuestionManageComponent', () => {
  let component: GestionQuestionManageComponent;
  let fixture: ComponentFixture<GestionQuestionManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GestionQuestionManageComponent]
    });
    fixture = TestBed.createComponent(GestionQuestionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
