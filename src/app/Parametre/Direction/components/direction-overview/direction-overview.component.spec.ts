import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionOverviewComponent } from './direction-overview.component';

describe('DirectionOverviewComponent', () => {
  let component: DirectionOverviewComponent;
  let fixture: ComponentFixture<DirectionOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DirectionOverviewComponent]
    });
    fixture = TestBed.createComponent(DirectionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
