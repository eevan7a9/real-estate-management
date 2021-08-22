import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

import { Enquiry } from 'src/app/shared/interface/enquiry';
import { EnquiriesNewComponent } from '../enquiries-new-modal/enquiries-new.component';
import { EnquiriesService } from '../enquiries.service';

@Component({
  selector: 'app-enquiries-detail',
  templateUrl: './enquiries-detail.component.html',
  styleUrls: ['./enquiries-detail.component.scss'],
})
export class EnquiriesDetailComponent implements OnInit {
  public enquiry: Enquiry;

  constructor(
    public location: Location,
    private router: Router,
    private enquiriesService: EnquiriesService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.enquiriesService.enquiry$.subscribe(enquiry => {
      this.enquiry = enquiry;
      if (!this.enquiry) {
        this.router.navigate(['/enquiries']);
      }
    });
  }

  public async report(enqId: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-alert-class',
      header: 'Report Message',
      // subHeader: 'Subtitle',
      message: 'Are you sure you want to Report this Message?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Confirm Cancel: blah');
          }
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

  public async delete(enqId: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-alert-class',
      header: 'Delete Enquiry',
      // subHeader: 'Subtitle',
      message: 'Are you sure you want to delete this Enquiry?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'DELETE',
          cssClass: 'alert-danger-text',
          role: 'delete',
          handler: () => {
            this.enquiriesService.removeEnquiry(enqId);
            this.router.navigate(['/enquiries']);
            this.presentToast('Enquiry is deleted successfully.');
          }
        }
      ]
    });

    await alert.present();
    // const { role } = await alert.onDidDismiss();
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
    const modal = await this.modalCtrl.create({
      component: EnquiriesNewComponent,
      componentProps: {
        title: 'Reply Enquiry'
      }
    });
    return await modal.present();
  }
}
