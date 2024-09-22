import { SocketNotificationType, UserNotificationType } from '../enums/notification';
import { Activity } from './activities';
import { Enquiry } from './enquiry';
import { Property } from './property';

export interface Notification {
  notification_id: string;
  message: string;
  type: UserNotificationType;
  read: boolean;
  expiresAt?: string;
  createdAt: Date;
}

export interface WebSocketNotification {
  type: SocketNotificationType;
  payload: Enquiry | Property | Activity | Notification;
}
