import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertifiedUserDetailsComponent } from './certified-user-details.component';

describe('CertifiedUserDetailsComponent', () => {
  let component: CertifiedUserDetailsComponent;
  let fixture: ComponentFixture<CertifiedUserDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CertifiedUserDetailsComponent]
    });
    fixture = TestBed.createComponent(CertifiedUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
