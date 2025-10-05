import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedAppCardComponent } from './selected-app-card.component';

describe('SelectedAppCardComponent', () => {
  let component: SelectedAppCardComponent;
  let fixture: ComponentFixture<SelectedAppCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectedAppCardComponent]
    });
    fixture = TestBed.createComponent(SelectedAppCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
