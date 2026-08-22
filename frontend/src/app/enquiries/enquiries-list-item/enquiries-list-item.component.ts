import { Component, computed, input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ModalController,
  PopoverController,
  ToastController
} from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ActionPopupComponent } from 'src/app/shared/components/action-popup/action-popup.component';
import { Enquiry } from 'src/app/shared/interface/enquiry';
import { UserService } from 'src/app/user/user.service';
import { EnquiriesReplyModalComponent } from '../enquiries-reply-modal/enquiries-reply-modal.component';
import { EnquiriesService } from '../enquiries.service';
import { RestrictionService } from 'src/app/shared/services/restriction/restriction.service';
import { ConfirmationAlertService } from 'src/app/shared/services/confirmation-alert/confirmation-alert.service';
import {
  baseRequestResponse,
  errorHandler
} from '@app/shared/utility/requests';

@Component({
  selector: 'app-enquiries-list-item',
  templateUrl: './enquiries-list-item.component.html',
  styleUrls: ['./enquiries-list-item.component.css'],
  standalone: false
})
export class EnquiriesListItemComponent {
  public enquiry = input<Enquiry>();
  public sent = computed(
    () => this.userService.user?.user_id === this.enquiry()?.users.from.user_id
  );

  constructor(
    public userService: UserService,
    private enquiriesService: EnquiriesService,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private restriction: RestrictionService,
    private confirmationAlert: ConfirmationAlertService
  ) {}

  public async actionPopup(ev: Event, enqId: string) {
    ev.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: ActionPopupComponent,
      event: ev,
      componentProps: {
        edit: false,
        report: !this.sent,
        message: !this.sent
      },
      translucent: true
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (!data) {
      return;
    }
    if (data.action === 'delete') {
      if (this.restriction.restricted) {
        return this.restriction.showAlert();
      }
      this.confirmationAlert
        .confirm(
          'Delete Enquiry',
          'Are you sure you want to delete this enquiry?',
          'Delete',
          'Cancel'
        )
        .then(async (confirmed) => {
          if (confirmed) {
            try {
              const res = await firstValueFrom(
                this.enquiriesService.removeEnquiry(enqId)
              );
              if (res.status === 200) {
                this.enquiriesService.removeEnquiryFromState(enqId);
                this.presentToast('Enquiry is deleted successfully.');
              }
            } catch (error: unknown) {
              if (error instanceof HttpErrorResponse) {
                const response = errorHandler(error);
                this.toastCtrl
                  .create({
                    message: response.message,
                    duration: 3000,
                    color: 'danger'
                  })
                  .then((toast) => toast.present());
              }
              console.error('Error Deleting Enquiry:', error);
            }
          }
        });
    }
    if (data.action === 'message') {
      this.createEnquiryModal();
    }
  }

  public async presentToast(
    message: string,
    duration = 3000,
    color = 'success'
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color
    });
    toast.present();
  }

  public async createEnquiryModal() {
    const enquiry = this.enquiry();
    if (!enquiry) return;

    const modal = await this.modalCtrl.create({
      component: EnquiriesReplyModalComponent,
      componentProps: {
        title: 'Reply Enquiry',
        property: enquiry.property,
        replyTo: {
          enquiry_id: enquiry.enquiry_id,
          title: enquiry.title,
          topic: enquiry.topic
        },
        userTo: enquiry.users?.from?.user_id
      }
    });
    return await modal.present();
  }
}
