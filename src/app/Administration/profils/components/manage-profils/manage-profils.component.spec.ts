import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProfilsComponent } from './manage-profils.component';

describe('ManageProfilsComponent', () => {
  let component: ManageProfilsComponent;
  let fixture: ComponentFixture<ManageProfilsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ManageProfilsComponent]
    });
    fixture = TestBed.createComponent(ManageProfilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
