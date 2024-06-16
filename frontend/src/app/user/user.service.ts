import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { headerDict } from '../shared/utility';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { User } from '../shared/interface/user';
import { StorageService } from '../shared/services/storage/storage.service';
import { GoogleAuthResponse } from '../shared/interface/google';
import { Property } from '../shared/interface/property';
import { ApiResponse } from '../shared/interface/api-response';

const url = environment.api.server;
const requestOptions = (
  { token = '', contentType = 'application/json' },
  body = {}
) => ({
  headers: new HttpHeaders(headerDict({ token, contentType })),
  body,
});

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user$: Observable<User>;
  private readonly userSub = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private storage: StorageService) {
    this.user$ = this.userSub.asObservable();
    // Access Stored User
    this.storage.init().then(() => {
      this.storage.getUser().then((user) => {
        if (user) {
          this.updateUser(user);
        }
      });
    });
  }

  public get user(): User {
    return this.userSub.getValue();
  }

  public token(): string {
    return this.userSub.getValue().accessToken;
  }

  public async signOut() {
    this.userSub.next(null);
    this.storage.removeUser();
  }

  public async signIn(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const result = await firstValueFrom(
        this.http.post<ApiResponse<User>>(
          url + 'auth/signin',
          {
            email,
            password,
          },
          requestOptions({ contentType: 'application/json' })
        )
      );
      await this.updateUser(result.data);
      return result;
    } catch (error) {
      console.error('err', error);
      return error.error;
    }
  }

  public async register(fullName: string, email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const result = await firstValueFrom(
        this.http.post<ApiResponse<User>>(
          url + 'auth/register',
          {
            fullName,
            email,
            password,
          },
          requestOptions({ contentType: 'application/json' })
        )
      );
      await this.updateUser(result.data);
      return result;
    } catch (error) {
      console.log('error', error);
      return error;
    }
  }

  public async googleAuth(payload: GoogleAuthResponse): Promise<ApiResponse<User>> {
    try {
      const result = await firstValueFrom(
        this.http.post<ApiResponse<User>>(url + 'auth/google', payload)
      );
      await this.updateUser(result.data);
      return result;
    } catch (error) {
      console.error('google-auth error:', error);
    }
  }

  public isPropertyOwner(property: Property): boolean {
    return this.user && this.user.user_id === property.user_id;
  }

  public async changePassword(passwordNew: string, passwordCurrent: string): Promise<ApiResponse> {
    try {
      const res = await firstValueFrom(this.http.post<ApiResponse>(url + 'auth/change-password',
        { passwordCurrent, passwordNew },
        requestOptions({ token: this.token(), contentType: 'application/json' })
      ));
      // console.log(res);
      return res;
    } catch (error) {
      console.error(error);
      return error.error;
    }
  }

  private async updateUser(user: User) {
    this.userSub.next(user);
    await this.storage.setUser(user);
  }
}
