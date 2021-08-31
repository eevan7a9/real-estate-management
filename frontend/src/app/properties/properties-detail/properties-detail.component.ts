import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController, ToastController } from '@ionic/angular';

import { Property } from 'src/app/shared/interface/property';
import { PropertiesService } from '../properties.service';
import { ActionPopupComponent } from 'src/app/shared/components/action-popup/action-popup.component';
import { PropertiesEditComponent } from '../properties-edit-modal/properties-edit.component';

@Component({
  selector: 'app-properties-detail',
  templateUrl: './properties-detail.component.html',
  styleUrls: ['./properties-detail.component.scss'],
})
export class PropertiesDetailComponent implements OnInit {
  public property: Property | undefined;
  constructor(
    public location: Location,
    private router: Router,
    private propertiesService: PropertiesService,
    private popoverCtrl: PopoverController,
    public modalController: ModalController,
    private toastCtrl: ToastController,
  ) { }

  async ngOnInit() {
    this.propertiesService.property$.subscribe(property => {
      this.property = property;
      if (!this.property) {
        this.router.navigate(['/properties']);
      }
    });
  }

  public async actionPopup(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: ActionPopupComponent,
      event: ev,
      componentProps: {
        message: false
      },
      translucent: true
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (!data) {
      return;
    }
    if (data.action === 'delete') {
      this.propertiesService.removeProperty(this.property.id);
      this.presentToast('Success,property deleted');
      this.router.navigate(['/properties']);
    }
    if (data.action === 'edit') {
      this.editModal();
    }
    if (data.action === 'report') {
      this.presentToast('Success, we will take a look at this property.');
    }
  }

  public findInMap() {
    const { lat, lng } = this.property.position;
    this.router.navigate(['/map'], { queryParams: { lat, lng } });
  }

  private async editModal() {
    const modal = await this.modalController.create({
      component: PropertiesEditComponent
    });
    return await modal.present();
  }

  private async presentToast(message: string, color = 'success', duration = 3000) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color
    });
    toast.present();
  }

}
