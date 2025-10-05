import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassFormComponent } from './forgot-pass-form.component';

describe('ForgotPassFormComponent', () => {
  let component: ForgotPassFormComponent;
  let fixture: ComponentFixture<ForgotPassFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ForgotPassFormComponent]
    });
    fixture = TestBed.createComponent(ForgotPassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
