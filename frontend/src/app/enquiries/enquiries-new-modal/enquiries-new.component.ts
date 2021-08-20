import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-enquiries-new',
  templateUrl: './enquiries-new.component.html',
  styleUrls: ['./enquiries-new.component.scss'],
})
export class EnquiriesNewComponent implements OnInit {
  @Input() title = 'Create Enquiry';

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() { }

  public dismissModal() {
    this.modalCtrl.dismiss();
  }
}
