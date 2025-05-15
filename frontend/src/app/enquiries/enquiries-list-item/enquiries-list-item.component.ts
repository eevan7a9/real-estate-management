import { Component, computed, input } from '@angular/core';
import { AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { ActionPopupComponent } from 'src/app/shared/components/action-popup/action-popup.component';
import { Enquiry } from 'src/app/shared/interface/enquiry';
import { UserService } from 'src/app/user/user.service';
import { EnquiriesReplyModalComponent } from '../enquiries-reply-modal/enquiries-reply-modal.component';
import { EnquiriesService } from '../enquiries.service';
import { RestrictionService } from 'src/app/shared/services/restriction/restriction.service';

@Component({
    selector: 'app-enquiries-list-item',
    templateUrl: './enquiries-list-item.component.html',
    styleUrls: ['./enquiries-list-item.component.css'],
    standalone: false
})
export class EnquiriesListItemComponent {

  public enquiry = input<Enquiry>();
  public sent = computed(() => this.userService.user.user_id === this.enquiry().users.from.user_id)

  constructor(
    private enquiriesService: EnquiriesService,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    public userService: UserService,
    private restriction: RestrictionService
  ) { }

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
    if(this.restriction.restricted) {
      return this.restriction.showAlert();
    }
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
        property: this.enquiry().property,
        replyTo: {
          enquiry_id: this.enquiry().enquiry_id,
          title: this.enquiry().title,
          topic: this.enquiry().topic
        },
        userTo: this.enquiry().users?.from?.user_id
      }
    });
    return await modal.present();
  }
}
