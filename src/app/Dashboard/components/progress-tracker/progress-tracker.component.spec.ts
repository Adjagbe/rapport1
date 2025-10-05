import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressTrackerComponent } from './progress-tracker.component';

describe('ProgressTrackerComponent', () => {
  let component: ProgressTrackerComponent;
  let fixture: ComponentFixture<ProgressTrackerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProgressTrackerComponent]
    });
    fixture = TestBed.createComponent(ProgressTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
