import { Component, input, OnInit } from '@angular/core';
import { UserNotificationType } from '../../enums/notification';

@Component({
  selector: 'app-notification-badge',
  templateUrl: './notification-badge.component.html',
  styleUrls: ['./notification-badge.component.css'],
  standalone: false,
})
export class NotificationBadgeComponent {
  public notificationType = input<string>('success');

  public getItemBadge(): string {
    switch (this.notificationType()) {
      case UserNotificationType.Account:
        return 'success';
      case UserNotificationType.System:
        return 'primary';
      default:
        return 'tertiary';
    }
  }
}
