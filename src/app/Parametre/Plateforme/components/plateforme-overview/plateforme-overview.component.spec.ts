import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateformeOverviewComponent } from './plateforme-overview.component';

describe('PlateformeOverviewComponent', () => {
  let component: PlateformeOverviewComponent;
  let fixture: ComponentFixture<PlateformeOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlateformeOverviewComponent]
    });
    fixture = TestBed.createComponent(PlateformeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
