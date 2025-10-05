import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCardComponent } from './status-card.component';

describe('StatusCardComponent', () => {
  let component: StatusCardComponent;
  let fixture: ComponentFixture<StatusCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatusCardComponent]
    });
    fixture = TestBed.createComponent(StatusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
