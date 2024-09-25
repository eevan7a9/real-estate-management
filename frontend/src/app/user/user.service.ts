import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { User, UserDetails, UserSignedIn } from '../shared/interface/user';
import { StorageService } from '../shared/services/storage/storage.service';
import { GoogleAuthResponse } from '../shared/interface/google';
import { Property } from '../shared/interface/property';
import { ApiResponse } from '../shared/interface/api-response';
import { requestOptions } from '../shared/utility/requests';
import { Router } from '@angular/router';

const url = environment.api.server;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user$: Observable<UserSignedIn>;
  private readonly userSub = new BehaviorSubject<UserSignedIn>(null);

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router,
  ) {
    this.user$ = this.userSub.asObservable();
    // Access Stored User
    this.storage.init().then(() => {
      this.storage.getUser().then((user) => {
        if (user) {
          this.setUser(user);
        }
      });
    });
  }

  public get user(): User {
    return this.userSub.getValue();
  }

  public get token(): string {
    return this.userSub.getValue().accessToken;
  }

  public async signOut(): Promise<void> {
    this.userSub.next(null);
    this.storage.removeUser();
    this.router.navigate(['/user/signin'], { replaceUrl: true });
  }

  public async signIn(email: string, password: string): Promise<ApiResponse<UserSignedIn>> {
    try {
      const result = await firstValueFrom(
        this.http.post<ApiResponse<UserSignedIn>>(
          url + 'auth/signin',
          {
            email,
            password,
          },
          requestOptions({ contentType: 'application/json' })
        )
      );
      await this.setUser(result.data);
      return result;
    } catch (error) {
      console.error('err', error);
      return error.error;
    }
  }

  public async register(fullName: string, email: string, password: string): Promise<ApiResponse<UserSignedIn>> {
    try {
      const result = await firstValueFrom(
        this.http.post<ApiResponse<UserSignedIn>>(
          url + 'auth/register',
          {
            fullName,
            email,
            password,
          },
          requestOptions({ contentType: 'application/json' })
        )
      );
      await this.setUser(result.data);
      return result;
    } catch (error) {
      console.error(error);
      return error.error || error;
    }
  }

  public async googleAuth(payload: GoogleAuthResponse): Promise<ApiResponse<UserSignedIn>> {
    try {
      const result = await firstValueFrom(
        this.http.post<ApiResponse<UserSignedIn>>(url + 'auth/google', payload)
      );
      await this.setUser(result.data);
      return result;
    } catch (error) {
      console.error('google-auth error:', error);
    }
  }

  public isPropertyOwner(property: Property): boolean {
    return this.user && this.user?.user_id === property?.user_id;
  }

  public async changePassword(passwordNew: string, passwordCurrent: string): Promise<ApiResponse> {
    try {
      const res = await firstValueFrom(this.http.post<ApiResponse>(url + 'auth/change-password',
        { passwordCurrent, passwordNew },
        requestOptions({ token: this.token, contentType: 'application/json' })
      ));
      return res;
    } catch (error) {
      console.error(error);
      return error.error;
    }
  }

  public async updateUser(user: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const res = await firstValueFrom(
        this.http.patch<ApiResponse<User>>(url + 'users/me', user, requestOptions({ token: this.token }))
      );
      return res;
    } catch (error) {
      console.error(error);
      return error.error || error;
    }
  }

  public async getCurrentUser(): Promise<ApiResponse<UserDetails>> {
    try {
      const res = await firstValueFrom(this.http.get<ApiResponse<UserDetails>>(url + 'users/me', requestOptions({ token: this.token })));
      return res;
    } catch (error) {
      console.error(error);
      return error.error || error;
    }
  }

  public async setUser(user: UserSignedIn) {
    this.userSub.next({ ...this.userSub.value, ...user });
    await this.storage.setUser(user);
  }
}
