import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NotificationsService } from './notifications/notifications.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit, OnDestroy {

  public unreadNotifications = signal<number>(0);
  private subscription: Subscription;

  constructor(private notificationsService: NotificationsService) { }

  ngOnInit() {
    this.subscription = this.notificationsService.notifications$.subscribe((notifications) => {
      const unreadCount = notifications.filter(item => !item.read).length;
      this.unreadNotifications.set(unreadCount);
    });
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
