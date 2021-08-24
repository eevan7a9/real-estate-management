import { Component, Input, OnInit } from '@angular/core';
import { EnquiryTopic } from '../../enums/enquiry';

@Component({
  selector: 'app-enquiry-badge',
  templateUrl: './enquiry-badge.component.html',
  styleUrls: ['./enquiry-badge.component.scss'],
})
export class EnquiryBadgeComponent implements OnInit {

  @Input() topic = 'residential';
  constructor() { }

  ngOnInit() { }

  topicColor() {
    switch (this.topic) {
      case EnquiryTopic.info:
        return 'secondary';
      case EnquiryTopic.sales:
        return 'warning';
      case EnquiryTopic.schedule:
        return 'danger';
      case EnquiryTopic.payment:
        return 'success';
      default:
        break;
    }
  }

  topicLabel() {
    switch (this.topic) {
      case EnquiryTopic.info:
        return 'Enquire Information';
      case EnquiryTopic.sales:
        return 'About Sales';
      case EnquiryTopic.schedule:
        return 'About Schedule';
      case EnquiryTopic.payment:
        return 'About Payment';
      default:
        break;
    }
  }
}
