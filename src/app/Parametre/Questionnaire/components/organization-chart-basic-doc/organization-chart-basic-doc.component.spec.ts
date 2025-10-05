import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationChartBasicDocComponent } from './organization-chart-basic-doc.component';

describe('OrganizationChartBasicDocComponent', () => {
  let component: OrganizationChartBasicDocComponent;
  let fixture: ComponentFixture<OrganizationChartBasicDocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrganizationChartBasicDocComponent]
    });
    fixture = TestBed.createComponent(OrganizationChartBasicDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
