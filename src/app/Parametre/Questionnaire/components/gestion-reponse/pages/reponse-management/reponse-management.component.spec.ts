import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReponseManagementComponent } from './reponse-management.component';

describe('ReponseManagementComponent', () => {
  let component: ReponseManagementComponent;
  let fixture: ComponentFixture<ReponseManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReponseManagementComponent]
    });
    fixture = TestBed.createComponent(ReponseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
