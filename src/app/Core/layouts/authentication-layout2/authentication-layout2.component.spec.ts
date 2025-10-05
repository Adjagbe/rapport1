import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationLayout2Component } from './authentication-layout2.component';

describe('AuthenticationLayout2Component', () => {
  let component: AuthenticationLayout2Component;
  let fixture: ComponentFixture<AuthenticationLayout2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AuthenticationLayout2Component]
    });
    fixture = TestBed.createComponent(AuthenticationLayout2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
