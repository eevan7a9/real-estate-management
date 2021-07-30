import { TestBed } from '@angular/core/testing';

import { EnquiriesService } from './enquiries.service';

describe('EnquiriesService', () => {
  let service: EnquiriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnquiriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
