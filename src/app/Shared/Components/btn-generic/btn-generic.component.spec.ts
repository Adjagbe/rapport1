import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnGenericComponent } from './btn-generic.component';

describe('BtnGenericComponent', () => {
  let component: BtnGenericComponent;
  let fixture: ComponentFixture<BtnGenericComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BtnGenericComponent]
    });
    fixture = TestBed.createComponent(BtnGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
