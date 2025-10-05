import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTableV3Component } from './generic-table-v3.component';

describe('GenericTableV3Component', () => {
  let component: GenericTableV3Component;
  let fixture: ComponentFixture<GenericTableV3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GenericTableV3Component]
    });
    fixture = TestBed.createComponent(GenericTableV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
