import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTableV4Component } from './generic-table-v4.component';

describe('GenericTableV4Component', () => {
  let component: GenericTableV4Component;
  let fixture: ComponentFixture<GenericTableV4Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GenericTableV4Component]
    });
    fixture = TestBed.createComponent(GenericTableV4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
