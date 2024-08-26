import { SocketNotificationType } from '../enums/notification';
import { Activity } from './activities';
import { Enquiry } from './enquiry';
import { Property } from './property';

export interface Notification {
  id: string;
  title: string;
  type: string;
  date: Date;
  content?: {
    id: string;
  };
}

export interface WebSocketNotification {
  type: SocketNotificationType;
  payload: Enquiry | Property | Activity;
}
