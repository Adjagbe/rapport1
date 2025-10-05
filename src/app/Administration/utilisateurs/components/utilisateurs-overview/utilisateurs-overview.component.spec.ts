import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateursOverviewComponent } from './utilisateurs-overview.component';

describe('UtilisateursOverviewComponent', () => {
  let component: UtilisateursOverviewComponent;
  let fixture: ComponentFixture<UtilisateursOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UtilisateursOverviewComponent]
    });
    fixture = TestBed.createComponent(UtilisateursOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
