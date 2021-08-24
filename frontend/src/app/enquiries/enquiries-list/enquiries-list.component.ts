import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { ActionPopupComponent } from 'src/app/shared/components/action-popup/action-popup.component';
import { Enquiry } from 'src/app/shared/interface/enquiry';
import { EnquiriesNewComponent } from '../enquiries-new-modal/enquiries-new.component';
import { EnquiriesService } from '../enquiries.service';
import { enquiries } from '../../shared/dummy-data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { sortListByDate, sortListByName } from 'src/app/shared/utility';

@Component({
  selector: 'app-enquiries-list',
  templateUrl: './enquiries-list.component.html',
  styleUrls: ['./enquiries-list.component.scss'],
})
export class EnquiriesListComponent implements OnInit, OnDestroy {
  public date = new Date();
  public enquiries: Enquiry[];
  public filterBy: string[] = [];
  public sortBy = 'latest';
  private unsubscribe$ = new Subject<void>();

  constructor(
    private enquiriesService: EnquiriesService,
    private router: Router,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getEnquiries();
  }

  ngOnDestroy() {
    this.unSubscribed();
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

  public async presentToast(message: string, duration = 3000) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color: 'success'
    });
    toast.present();
  }

  public async createEnquiryModal() {
    const modal = await this.modalCtrl.create({
      component: EnquiriesNewComponent,
      componentProps: {
        title: 'Reply Enquiry'
      }
    });
    return await modal.present();
  }

  public setFilters(filter: string[]) {
    this.filterBy = filter;
    this.getEnquiries();
  }

  public setSort(sort: string) {
    this.sortBy = sort;
    switch (this.sortBy) {
      case 'title':
        this.enquiries = sortListByName(this.enquiries, { property: 'title' });
        break;

      default:
        this.enquiries = sortListByDate(this.enquiries, { property: 'date' });
        break;
    }
  }

  private getEnquiries() {
    this.unSubscribed();
    this.enquiriesService.enquiries$.pipe(takeUntil(this.unsubscribe$)).subscribe(items => {
      this.enquiries = items;
      if (this.filterBy.length) {
        this.enquiries = this.enquiries.filter(item => this.filterBy.includes(item.topic));
      }
      if (!this.enquiries.length) {
        this.enquiriesService.enquiries = enquiries;
      }
    });
  }

  private unSubscribed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
