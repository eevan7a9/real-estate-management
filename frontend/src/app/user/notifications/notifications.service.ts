import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { UserNotificationType } from 'src/app/shared/enums/notification';
import { ApiResponse } from 'src/app/shared/interface/api-response';
import { Notification } from 'src/app/shared/interface/notification';
import { requestOptions } from 'src/app/shared/utility/requests';
import { environment } from 'src/environments/environment';
import { UserService } from '../user.service';

const notificationUrl = environment.api.server + 'notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  public initialFetchDone = signal<boolean>(false);
  public readonly notifications$: Observable<Notification[]>;
  private readonly notificationsSub = new BehaviorSubject<Notification[]>([]);

  constructor(
    private http: HttpClient,
    private user: UserService
  ) {
    this.notifications$ = this.notificationsSub.asObservable();
  }

  public get notifications(): Notification[] {
    return this.notificationsSub.value;
  }

  public set notifications(notifications: Notification[]) {
    this.notificationsSub.next(notifications);
  }

  public resetState(): void {
    this.notifications = [];
    this.initialFetchDone.set(false);
  }

  public fetchNotifications(): Observable<ApiResponse<Notification[]>> {
    return this.http.get<ApiResponse<Notification[]>>(
      notificationUrl,
      requestOptions({ token: this.user.token })
    );
  }

  public async readNotification(
    id: string | string[]
  ): Promise<ApiResponse<Notification[]>> {
    if (!id.length) {
      return;
    }
    const body = { id };
    try {
      const res = await firstValueFrom(
        this.http.patch<ApiResponse<Notification[]>>(
          notificationUrl,
          body,
          requestOptions({ token: this.user.token })
        )
      );
      return res;
    } catch (error) {
      console.error(error);
      return error?.error || error;
    }
  }

  public removeNotificationsFromState(ids: string[]) {
    this.notifications = this.notifications.filter((item) => {
      return !ids.includes(item.notification_id);
    });
  }

  public setNotificationsAsReadFromState(ids: string[]) {
    const updatedNotifications = this.notifications.map((notification) =>
      ids.includes(notification.notification_id)
        ? { ...notification, read: true }
        : notification
    );
    this.notifications = updatedNotifications;
  }

  public async deleteNotification(id: string | string[]): Promise<ApiResponse> {
    try {
      const res = await firstValueFrom(
        this.http.delete<ApiResponse>(
          notificationUrl,
          requestOptions({ token: this.user.token }, { id })
        )
      );
      return res;
    } catch (error) {
      console.error(error);
      return error?.error || error;
    }
  }

  public insertNotificationToState(notification: Notification): void {
    this.notifications = [notification, ...this.notifications];
  }
}
