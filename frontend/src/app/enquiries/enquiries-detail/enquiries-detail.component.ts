import { Location } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';

import { Enquiry } from 'src/app/shared/interface/enquiry';
import { User } from 'src/app/shared/interface/user';
import { UserService } from 'src/app/user/user.service';
import { EnquiriesReplyModalComponent } from '../enquiries-reply-modal/enquiries-reply-modal.component';
import { EnquiriesService } from '../enquiries.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RestrictionService } from 'src/app/shared/services/restriction/restriction.service';
import { ConfirmationAlertService } from 'src/app/shared/services/confirmation-alert/confirmation-alert.service';
import { firstValueFrom } from 'rxjs';
import { baseRequestResponse, errorHandler } from '@app/shared/utility/requests';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-enquiries-detail',
  templateUrl: './enquiries-detail.component.html',
  styleUrls: ['./enquiries-detail.component.css'],
  standalone: false
})
export class EnquiriesDetailComponent implements OnInit {
  public enquiry = signal<Enquiry | undefined>(undefined);
  public user = toSignal<User | undefined>(this.userService.user$);
  public paramId = toSignal(this.route.paramMap);
  public ready = signal<boolean>(false);
  public sentByMe = computed(() => {
    if (this.user() && this.enquiry()) {
      return this.user()?.user_id === this.enquiry()?.users.from.user_id;
    }
    return false;
  })

  constructor(
    public location: Location,
    private router: Router,
    private enquiriesService: EnquiriesService,
    private userService: UserService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private restriction: RestrictionService,
    private confirmationAlert: ConfirmationAlertService
  ) {

  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Fetching enquiry details...',
      spinner: 'circular'
    });
    loading.present();
    await this.setEnquiryDetails();
    this.setEnquiryRead(this.enquiry());
    loading.dismiss();
    this.ready.set(true)
  }

  async gotToProperty(propertyId: string) {
    await this.router.navigate(['/properties', propertyId]);
  }
  async goToEnquiry(enqId: string) {
    await this.router.navigate(['/enquiries', enqId]);
  }

  public async reportEnquiry(enqId: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-alert-class',
      header: 'Report Message',
      // subHeader: 'Subtitle',
      message: 'Are you sure you want to Report this Message?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'REPORT',
          cssClass: 'alert-danger-text',
          role: 'delete',
          handler: () => {
            this.presentToast('Enquiry will be place for investigation.');
          }
        }
      ]
    });
    await alert.present();
  }

  public async deleteEnquiry(enqId: string) {
    if (this.restriction.restricted) {
      return this.restriction.showAlert();
    }
    this.confirmationAlert.confirm(
      'Delete Enquiry',
      'Are you sure you want to delete this enquiry?',
      'Delete',
      'Cancel'
    )
      .then(async (confirmed) => {
        if (confirmed) {
          try {
            const res = await firstValueFrom(this.enquiriesService.removeEnquiry(enqId));
            if (res.status === 200) {
              this.enquiriesService.removeEnquiryFromState(enqId);
              this.router.navigate(['/enquiries']);
              this.presentToast('Enquiry is deleted successfully.');
            }
          } catch (error: unknown) {
            let response = { ...baseRequestResponse };
            if (error instanceof HttpErrorResponse) {
              response = errorHandler(error);
              console.error('fetchEnquiries error:', response.message);
              this.toastCtrl.create({
                message: response.message,
                duration: 3000,
                color: 'danger'
              }).then(toast => toast.present());
            }
            console.error('Error Deleting Enquiry:', response.message);
          }
        }
      })
  }

  async presentToast(message: string, duration = 3000) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color: 'success'
    });
    toast.present();
  }

  async createEnquiryModal() {
    const enquiry = this.enquiry();
    if (!enquiry) return;
    const modal = await this.modalCtrl.create({
      component: EnquiriesReplyModalComponent,
      componentProps: {
        title: 'Reply Enquiry',
        property: this.enquiry()?.property,
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

  private async setEnquiryDetails(): Promise<void> {
    const enquiryId = this.paramId()?.get('id');
    if (!enquiryId) {
      this.router.navigate(['/enquiries']);
      return;
    }
    try {
      const res = await firstValueFrom(this.enquiriesService.fetchEnquiry(enquiryId));
      if (res.status === 200) {
        this.enquiry.set(res.data);
      }
    } catch (error: unknown) {
      let response = { ...baseRequestResponse };
      if (error instanceof HttpErrorResponse) {
        response = errorHandler(error);
        console.error('fetchEnquiries error:', response.message);
        this.toastCtrl.create({
          message: response.message,
          duration: 3000,
          color: 'danger'
        }).then(toast => toast.present());
      }
      console.error('Error fetching enquiry details:', response.message);
    }
  }

  private setEnquiryRead(enquiry: Enquiry): void {
    if (enquiry && !enquiry?.read && enquiry?.users?.to.user_id === this.user()?.user_id) {
      firstValueFrom(this.enquiriesService.readEnquiry(enquiry.enquiry_id)).then((res) => {
        this.enquiriesService.updateEnquiriesState(res?.data as Enquiry);
        this.enquiry.set(res?.data);
      });
    }
  }
}
