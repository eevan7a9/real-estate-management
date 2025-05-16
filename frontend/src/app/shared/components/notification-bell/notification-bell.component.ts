import { Component, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { map } from 'rxjs';
import { NotificationsService } from 'src/app/user/notifications/notifications.service';
import { UserService } from 'src/app/user/user.service';
import { debounce } from '../../utility/helpers';
import { RestrictionService } from '../../services/restriction/restriction.service';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css'],
  standalone: false,
})
export class NotificationBellComponent {
  public currUser = toSignal(this.userService.user$);
  public notifications = toSignal(
    this.notificationsService.notifications$.pipe(
      map((notifications) => notifications.slice(0, 3))
    )
  );
  public unreadNotifications = toSignal(
    this.notificationsService.notifications$.pipe(
      map((notifications) => notifications.filter((item) => !item.read))
    ),
    { initialValue: [] }
  );
  public isOpen = signal<boolean>(false);

  constructor(
    private userService: UserService,
    private notificationsService: NotificationsService,
    private toast: ToastController,
    private router: Router,
    private restriction: RestrictionService
  ) {
    toObservable(this.isOpen).pipe(takeUntilDestroyed()).subscribe((isOpen) => {
      if (isOpen && this.unreadNotifications().length) {
        this.setReadNotifications();
      }
    });
  }

  public toggleNotification() {
    this.isOpen.set(!this.isOpen());
  }

  public async deleteNotification(id: string) {
    if(this.restriction.restricted) {
      return this.restriction.showAlert();
    }
    const res = await this.notificationsService.deleteNotification(id);
    if (res?.status === 200) {
      this.notificationsService.removeNotificationsFromState([id]);
    }
    const toast = this.toast.create({
      duration: 5000,
      message: res.message,
      color: res?.status === 200 ? 'success' : 'danger',
    });
    (await toast).present();
  }

  public viewAll() {
    this.isOpen.set(false);
    setTimeout(
      () => this.router.navigate(['/user/account/notifications']),
      500
    );
  }

  private setReadNotifications = debounce(async () => {
    if (!this.unreadNotifications().length) {
      return;
    }
    const ids = this.unreadNotifications().map((item) => item.notification_id);
    try {
      const res = await this.notificationsService.readNotification(ids);
      if (res.data?.length) {
        this.notificationsService.setNotificationsAsReadFromState(
          res.data.map((item) => item.notification_id)
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, 2000);
}
