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
import { RestrictionService } from 'src/app/shared/services/restriction/restriction.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css'],
    standalone: false
})
export class NotificationsComponent {
  public notifications = toSignal<Notification[]>(
    this.notificationsService.notifications$
  );
  public notificationsChecked = signal<string[]>([]);
  public isLoading = signal<boolean>(false);

  private notificationsToRead: string[] = [];
  private processingNotificationRead = false;

  @ViewChildren('notificationElement', { read: ElementRef })
  private notificationElements: QueryList<ElementRef<IonItem>>;

  constructor(
    private notificationsService: NotificationsService,
    private toast: ToastController,
    private changeDetector: ChangeDetectorRef,
    private restriction: RestrictionService
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
    if(this.restriction.restricted) {
      return this.restriction.showAlert();
    }
    if (!this.notificationsChecked().length) {
      return;
    }
    this.isLoading.set(true);
    const res = await this.notificationsService.deleteNotification(
      this.notificationsChecked()
    );
    if (res?.status === 200) {
      this.notificationsService.removeNotificationsFromState(this.notificationsChecked());
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
    if (!this.notificationsToRead.length || this.processingNotificationRead) {
      return;
    }
    this.processingNotificationRead = true;
    const res = await this.notificationsService.readNotification(
      this.notificationsToRead
    );
    if (!res.data?.length) {
      return;
    }
    this.notificationsToRead = [];
    this.processingNotificationRead = false;
    this.notificationsService.setNotificationsAsReadFromState(res.data.map(item => item.notification_id));
  }, 3000);
}
