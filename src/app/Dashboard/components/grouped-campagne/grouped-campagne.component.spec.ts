import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedCampagneComponent } from './grouped-campagne.component';

describe('GroupedCampagneComponent', () => {
  let component: GroupedCampagneComponent;
  let fixture: ComponentFixture<GroupedCampagneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GroupedCampagneComponent]
    });
    fixture = TestBed.createComponent(GroupedCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
