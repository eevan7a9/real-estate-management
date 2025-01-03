import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Storage } from '@ionic/storage-angular';

import { AuthGuestGuard } from './auth-guest.guard';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AuthGuestGuard', () => {
  let guard: AuthGuestGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    providers: [Storage, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    guard = TestBed.inject(AuthGuestGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
