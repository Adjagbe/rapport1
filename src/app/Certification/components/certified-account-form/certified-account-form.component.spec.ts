import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertifiedAccountFormComponent } from './certified-account-form.component';

describe('CertifiedAccountFormComponent', () => {
  let component: CertifiedAccountFormComponent;
  let fixture: ComponentFixture<CertifiedAccountFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CertifiedAccountFormComponent]
    });
    fixture = TestBed.createComponent(CertifiedAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
