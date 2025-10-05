import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassPageComponent } from './forgot-pass-page.component';

describe('ForgotPassPageComponent', () => {
  let component: ForgotPassPageComponent;
  let fixture: ComponentFixture<ForgotPassPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ForgotPassPageComponent]
    });
    fixture = TestBed.createComponent(ForgotPassPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
