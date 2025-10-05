import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilsManagementComponent } from './profils-management.component';

describe('ProfilsManagementComponent', () => {
  let component: ProfilsManagementComponent;
  let fixture: ComponentFixture<ProfilsManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProfilsManagementComponent]
    });
    fixture = TestBed.createComponent(ProfilsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
