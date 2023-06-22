import { EnquiryNotification } from '../enums/enquiry';
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
  type: EnquiryNotification | 'message';
  payload: Enquiry | Property;
}
