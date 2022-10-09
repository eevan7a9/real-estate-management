import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Property } from 'src/app/shared/interface/property';

@Component({
  selector: 'app-enquiries-reply-modal',
  templateUrl: './enquiries-reply-modal.component.html',
  styleUrls: ['./enquiries-reply-modal.component.scss'],
})
export class EnquiriesReplyModalComponent implements OnInit {
  @Input() title = 'Create Enquiry';
  @Input() property: Partial<Property>;
  @Input() replyTo?: {
    enquiry_id: string;
    title: string;
    topic: string;
  };
  @Input() userTo: string;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() { }

  public dismissModal() {
    this.modalCtrl.dismiss();
  }
}
