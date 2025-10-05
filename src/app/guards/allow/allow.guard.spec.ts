import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { allowGuard } from './allow.guard';

describe('allowGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => allowGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
