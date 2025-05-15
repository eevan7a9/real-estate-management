import { TestBed } from '@angular/core/testing';

import { RestrictionService } from './restriction.service';

describe('RestrictionService', () => {
  let service: RestrictionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestrictionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
