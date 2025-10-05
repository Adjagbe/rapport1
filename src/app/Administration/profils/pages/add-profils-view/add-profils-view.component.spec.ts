import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfilsViewComponent } from './add-profils-view.component';

describe('AddProfilsViewComponent', () => {
  let component: AddProfilsViewComponent;
  let fixture: ComponentFixture<AddProfilsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddProfilsViewComponent]
    });
    fixture = TestBed.createComponent(AddProfilsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
