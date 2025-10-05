import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTableV2Component } from './generic-table-v2.component';

describe('GenericTableComponent', () => {
  let component: GenericTableV2Component;
  let fixture: ComponentFixture<GenericTableV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GenericTableV2Component],
    });
    fixture = TestBed.createComponent(GenericTableV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
