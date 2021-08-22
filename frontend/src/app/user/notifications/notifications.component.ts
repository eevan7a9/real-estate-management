import { Component, OnInit } from '@angular/core';
import { NotificationType } from 'src/app/shared/enums/notification';
import { Notification } from 'src/app/shared/interface/notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  public notifications: Notification[] = [
    {
      id: '01',
      title: 'Property have been added.',
      type: 'property',
      date: new Date()
    },
    {
      id: '02',
      title: 'Property have been added.',
      type: 'property',
      date: new Date()
    },
    {
      id: '03',
      title: 'Test@email.com have have sent you enquiries',
      type: 'enquiry',
      date: new Date('2021/8/6')
    },
    {
      id: '04',
      title: 'Success, your Email have been verified!!!',
      type: 'app',
      date: new Date('2021/8/5')
    },
    {
      id: '05',
      title: 'Welcome friend, Account created',
      type: 'app',
      date: new Date('2021/8/5')
    }
  ];
  constructor() { }

  ngOnInit() { }

  itemClicked() {
    console.log('item is clicked');
  }

  getItemBadge(type: string) {
    switch (type) {
      case NotificationType.enquiry:
        return 'secondary';
      case NotificationType.property:
        return 'success';
      default:
        return 'primary';
    }
  }
}
