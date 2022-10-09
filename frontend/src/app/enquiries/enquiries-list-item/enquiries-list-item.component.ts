import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { ActionPopupComponent } from 'src/app/shared/components/action-popup/action-popup.component';
import { Enquiry } from 'src/app/shared/interface/enquiry';
import { UserService } from 'src/app/user/user.service';
import { EnquiriesReplyModalComponent } from '../enquiries-reply-modal/enquiries-reply-modal.component';
import { EnquiriesService } from '../enquiries.service';

@Component({
  selector: 'app-enquiries-list-item',
  templateUrl: './enquiries-list-item.component.html',
  styleUrls: ['./enquiries-list-item.component.scss'],
})
export class EnquiriesListItemComponent implements OnInit {

  @Input() enquiry: Enquiry;
  public sent = false;

  constructor(
    private enquiriesService: EnquiriesService,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.sent = this.userService.user.user_id === this.enquiry.users.from.user_id;
  }

  public async actionPopup(ev: Event, enqId: string) {
    ev.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: ActionPopupComponent,
      event: ev,
      componentProps: {
        edit: false,
        report: !this.sent,
        message: !this.sent,
      },
      translucent: true
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (!data) {
      return;
    }
    if (data.action === 'delete') {
      this.delete(enqId);
    }
    if (data.action === 'message') {
      this.createEnquiryModal();
    }
  }


  public async delete(enqId: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-alert-class',
      header: 'Delete Enquiry',
      // subHeader: 'Subtitle',
      message: 'Are you sure you want to delete this Enquiry?',
      buttons: [
        {
          text: 'Cancel'
        }, {
          text: 'DELETE',
          cssClass: 'alert-danger-text',
          handler: async () => {
            const res = await this.enquiriesService.removeEnquiry(enqId);
            if (!res || res.status !== 200) {
              const msg = 'Error: Something went wrong, please try again later.';
              this.presentToast(`${res.message || msg}`, 3000, 'danger');
              return;
            }
            return this.presentToast(res.message);
          }
        }
      ]
    });
    await alert.present();
  }

  public async presentToast(message: string, duration = 3000, color = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color
    });
    toast.present();
  }

  public async createEnquiryModal() {
    const modal = await this.modalCtrl.create({
      component: EnquiriesReplyModalComponent,
      componentProps: {
        title: 'Reply Enquiry',
        property: this.enquiry?.property,
        replyTo: {
          id: this.enquiry.enquiry_id,
          title: this.enquiry.title,
          topic: this.enquiry.topic
        },
        userTo: this.enquiry.users?.from?.user_id
      }
    });
    return await modal.present();
  }
}
