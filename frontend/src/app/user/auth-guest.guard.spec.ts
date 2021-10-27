import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Storage } from '@ionic/storage-angular';

import { AuthGuestGuard } from './auth-guest.guard';

describe('AuthGuestGuard', () => {
  let guard: AuthGuestGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [Storage]
    });
    guard = TestBed.inject(AuthGuestGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
