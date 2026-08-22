import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, concatMap, from, map, tap } from 'rxjs';
import { User, UserDetails, UserSignedIn } from '../shared/interface/user';
import { StorageService } from '../shared/services/storage/storage.service';
import { GoogleAuthResponse } from '../shared/interface/google';
import { Property } from '../shared/interface/property';
import { ApiResponse } from '../shared/interface/api-response';
import { requestOptions } from '../shared/utility/requests';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

const url = environment.api.server;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user$: Observable<UserSignedIn | undefined>;
  private readonly userSub = new BehaviorSubject<UserSignedIn | undefined>(
    undefined
  );

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router,
    private toastCtrl: ToastController
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

  public get user(): User | undefined {
    return this.userSub.getValue();
  }

  public get token(): string {
    return this.userSub.getValue()?.accessToken || '';
  }

  public async signOut(): Promise<void> {
    this.userSub.next(undefined);
    this.storage.removeUser();
    this.router.navigate(['/user/signin'], { replaceUrl: true });
  }

  public signIn(
    email: string,
    password: string
  ): Observable<ApiResponse<UserSignedIn | undefined>> {
    return this.http
      .post<ApiResponse<UserSignedIn>>(
        url + 'auth/signin',
        {
          email,
          password
        },
        requestOptions({ contentType: 'application/json' })
      )
      .pipe(
        concatMap((res) => from(this.setUser(res.data)).pipe(map(() => res)))
      );
  }

  public register(
    fullName: string,
    email: string,
    password: string
  ): Observable<ApiResponse<UserSignedIn>> {
    return this.http
      .post<ApiResponse<UserSignedIn>>(
        url + 'auth/register',
        {
          fullName,
          email,
          password
        },
        requestOptions({ contentType: 'application/json' })
      )
      .pipe(
        concatMap((res) => from(this.setUser(res.data)).pipe(map(() => res)))
      );
  }

  public googleAuth(
    payload: GoogleAuthResponse
  ): Observable<ApiResponse<UserSignedIn>> {
    return this.http
      .post<ApiResponse<UserSignedIn>>(url + 'auth/google', payload)
      .pipe(
        concatMap((res) => from(this.setUser(res.data)).pipe(map(() => res)))
      );
  }

  public isPropertyOwner(property: Property): boolean | undefined {
    return this.user && this.user?.user_id === property?.user_id;
  }

  public changePassword(
    passwordNew: string,
    passwordCurrent: string
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      url + 'auth/change-password',
      { passwordCurrent, passwordNew },
      requestOptions({
        token: this.token,
        contentType: 'application/json'
      })
    );
  }

  public updateUser(user: Partial<User>): Observable<ApiResponse<User>> {
    return this.http
      .patch<ApiResponse<User>>(
        url + 'users/me',
        user,
        requestOptions({ token: this.token })
      )
      .pipe(
        tap((res) => {
          if (res.status !== 200) return;
          const updatedUser = { ...res.data, accessToken: this.token };
          this.setUser(updatedUser);
        })
      );
  }

  public getCurrentUser(): Observable<ApiResponse<UserDetails>> {
    return this.http.get<ApiResponse<UserDetails>>(
      url + 'users/me',
      requestOptions({ token: this.token })
    );
  }

  public async setUser(user?: UserSignedIn): Promise<void> {
    if (user) {
      this.userSub.next({ ...this.userSub.value, ...user });
      return await this.storage.setUser(user);
    }
    this.userSub.next(undefined);
    await this.storage.removeUser();
  }

  private async showToast(
    message: string,
    color: 'success' | 'danger' = 'success'
  ): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color
    });
    await toast.present();
  }
}
