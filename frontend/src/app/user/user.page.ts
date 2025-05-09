import { Component } from '@angular/core';
import { NotificationsService } from './notifications/notifications.service';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-user',
    templateUrl: './user.page.html',
    styleUrls: ['./user.page.css'],
    standalone: false
})
export class UserPage {
  public unreadNotifications = toSignal(
    this.notificationsService.notifications$.pipe(
      map(
        (notifications) => notifications.filter((notif) => !notif.read).length
      )
    ),
    { initialValue: 0 }
  );

  constructor(private notificationsService: NotificationsService) {}
}
