import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { ActionPopupComponent } from 'src/app/shared/components/action-popup/action-popup.component';
import { Enquiry } from 'src/app/shared/interface/enquiries';
import { EnquiriesNewComponent } from '../enquiries-new-modal/enquiries-new.component';
import { EnquiriesService } from '../enquiries.service';

@Component({
  selector: 'app-enquiries-list',
  templateUrl: './enquiries-list.component.html',
  styleUrls: ['./enquiries-list.component.scss'],
})
export class EnquiriesListComponent implements OnInit {
  public date = new Date();
  public enquiries: Enquiry[];

  constructor(
    private enquiriesService: EnquiriesService,
    private router: Router,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.enquiriesService.enquiries$.subscribe(enquiries => {
      this.enquiries = enquiries;
      if (!this.enquiries.length) {
        this.enquiriesService.enquiries = [
          {
            content: 'lorem20',
            email: 'hello_user@email.com',
            id: '01',
            date: new Date('2020/3/3'),
            title: 'Hello World some.',
            topic: 'schedule',
            read: true,
            property: {
              name: 'Building A, 34-b',
              id: '02',
            },
            user: {
              from: '1',
              to: '2'
            }
          },
          {
            content: 'lorem43 32sad',
            email: 'naruto_zua@email.com',
            id: '02',
            date: new Date('2020/4/3'),
            title: 'Hello Zworld some.',
            topic: 'payment',
            read: false,
            property: {
              name: 'Dart Apartment A, 34-b',
              id: '03',
            },
            user: {
              from: '1',
              to: '2'
            }
          }
        ];
      }
    });
  }

  public selectEnquiry(enquiry: Enquiry) {
    this.enquiriesService.enquiry = enquiry;
    this.router.navigate(['/enquiries', enquiry.id]);
  }

  public async actionPopup(ev: Event, enqId: string) {
    ev.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: ActionPopupComponent,
      event: ev,
      componentProps: {
        edit: false
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
          handler: () => {
            this.enquiriesService.removeEnquiry(enqId);
            this.presentToast('Enquiry is deleted successfully.');
          }
        }
      ]
    });
    await alert.present();
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
      component: EnquiriesNewComponent
    });
    return await modal.present();
  }
}
