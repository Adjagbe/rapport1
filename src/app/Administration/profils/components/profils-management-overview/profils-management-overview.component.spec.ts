import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilsManagementOverviewComponent } from './profils-management-overview.component';

describe('ProfilsManagementOverviewComponent', () => {
  let component: ProfilsManagementOverviewComponent;
  let fixture: ComponentFixture<ProfilsManagementOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProfilsManagementOverviewComponent]
    });
    fixture = TestBed.createComponent(ProfilsManagementOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
