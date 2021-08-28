import { TestBed } from '@angular/core/testing';

import { AuthGuestGuard } from './auth-guest.guard';

describe('AuthGuestGuard', () => {
  let guard: AuthGuestGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGuestGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
