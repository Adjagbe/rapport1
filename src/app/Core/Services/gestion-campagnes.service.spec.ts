import { TestBed } from '@angular/core/testing';

import { GestionCampagnesService } from './gestion-campagnes.service';

describe('GestionCampagnesService', () => {
  let service: GestionCampagnesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionCampagnesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
