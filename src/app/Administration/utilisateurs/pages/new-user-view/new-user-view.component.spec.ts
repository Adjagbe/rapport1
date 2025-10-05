import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserViewComponent } from './new-user-view.component';

describe('NewUserViewComponent', () => {
  let component: NewUserViewComponent;
  let fixture: ComponentFixture<NewUserViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewUserViewComponent]
    });
    fixture = TestBed.createComponent(NewUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
