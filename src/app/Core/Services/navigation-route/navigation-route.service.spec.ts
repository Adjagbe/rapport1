import { TestBed } from '@angular/core/testing';

import { NavigationRouteService } from './navigation-route.service';

describe('NavigationRouteService', () => {
  let service: NavigationRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
