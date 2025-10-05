import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationDetailsComponent } from './certification-details.component';

describe('CertificationDetailsComponent', () => {
  let component: CertificationDetailsComponent;
  let fixture: ComponentFixture<CertificationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CertificationDetailsComponent]
    });
    fixture = TestBed.createComponent(CertificationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
