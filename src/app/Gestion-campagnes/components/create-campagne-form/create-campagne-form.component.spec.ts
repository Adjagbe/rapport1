import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCampagneFormComponent } from './create-campagne-form.component';

describe('CreateCampagneFormComponent', () => {
  let component: CreateCampagneFormComponent;
  let fixture: ComponentFixture<CreateCampagneFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateCampagneFormComponent]
    });
    fixture = TestBed.createComponent(CreateCampagneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
