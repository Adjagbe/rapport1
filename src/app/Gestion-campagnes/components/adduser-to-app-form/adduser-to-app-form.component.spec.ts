import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdduserToAppFormComponent } from './adduser-to-app-form.component';

describe('AdduserToAppFormComponent', () => {
  let component: AdduserToAppFormComponent;
  let fixture: ComponentFixture<AdduserToAppFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdduserToAppFormComponent]
    });
    fixture = TestBed.createComponent(AdduserToAppFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
