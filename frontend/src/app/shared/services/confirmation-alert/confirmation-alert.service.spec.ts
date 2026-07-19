import { TestBed } from '@angular/core/testing';

import { ConfirmationAlertService } from './confirmation-alert.service';

describe('ConfirmationAlertService', () => {
  let service: ConfirmationAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
