import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpPageComponent } from './otp-page.component';

describe('OtpPageComponent', () => {
  let component: OtpPageComponent;
  let fixture: ComponentFixture<OtpPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OtpPageComponent]
    });
    fixture = TestBed.createComponent(OtpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
