import {
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { UserNotificationType } from 'src/app/shared/enums/notification';
import { Notification } from 'src/app/shared/interface/notification';
import { NotificationsService } from './notifications.service';
import { CheckboxCustomEvent, IonItem, ToastController } from '@ionic/angular';
import { debounce } from 'src/app/shared/utility/helpers';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  public notifications = toSignal<Notification[]>(
    this.notificationsService.notifications$
  );
  public notificationsChecked = signal<string[]>([]);
  public isLoading = signal<boolean>(false);

  private notificationsToRead: string[] = [];

  @ViewChildren('notificationElement', { read: ElementRef })
  private notificationElements: QueryList<ElementRef<IonItem>>;

  constructor(
    private notificationsService: NotificationsService,
    private toast: ToastController,
    private changeDetector: ChangeDetectorRef
  ) {
    effect(() => {
      if (this.notifications().length) {
        this.changeDetector.detectChanges();
        this.notificationElementObserver();
      }
    });
  }

  public itemClicked(e: CheckboxCustomEvent, id: string): void {
    if (e.detail.checked) {
      this.notificationsChecked.update((items) => {
        items.push(id);
        return items;
      });
    } else {
      this.notificationsChecked.update((items) => {
        items = items.filter((item) => item !== id);
        return items;
      });
    }
  }

  public getItemBadge(type: string): string {
    switch (type) {
      case UserNotificationType.Account:
        return 'success';
      case UserNotificationType.System:
        return 'primary';
      default:
        return 'tertiary';
    }
  }

  public async deleteSelectedNotfications(): Promise<void> {
    if (!this.notificationsChecked().length) {
      return;
    }
    this.isLoading.set(true);
    const res = await this.notificationsService.deleteNotification(
      this.notificationsChecked()
    );
    if (res?.status === 200) {
      this.notificationsService.notifications = this.notifications().filter(
        (item) => {
          return !this.notificationsChecked().includes(item.notification_id);
        }
      );
    }
    const toast = this.toast.create({
      duration: 5000,
      message: res.message,
      color: res?.status === 200 ? 'success' : 'danger',
    });
    (await toast).present();

    this.notificationsChecked.set([]);
    this.isLoading.set(false);
  }

  private notificationElementObserver(): void {
    this.notificationElements.forEach((element, index) => {
      const nativeElement = element.nativeElement as unknown as HTMLElement;
      const observer = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          !this.notifications()[index].read &&
          !this.notificationsToRead.includes(
            this.notifications()[index].notification_id
          )
        ) {
          const notification_id = this.notifications()[index].notification_id;
          this.notificationsToRead.push(notification_id);
          this.setNotificationAsRead();
        }
      });
      observer.observe(nativeElement);
    });
  }

  private setNotificationAsRead = debounce(async () => {
    if (!this.notificationsToRead.length) {
      return;
    }
    const res = await this.notificationsService.readNotification(
      this.notificationsToRead
    );
    if (!res.data?.length) {
      return;
    }
    const readNotifications = res.data;
    const tempNotifications = this.notifications();

    readNotifications.forEach((item) => {
      const found = tempNotifications.find(
        (noti) => noti.notification_id === item.notification_id
      );
      if (found) {
        found.read = true;
      }
    });
    this.notificationsService.notifications = tempNotifications;
    this.notificationsToRead = [];
  }, 3000);
}
