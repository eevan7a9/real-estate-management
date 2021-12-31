import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { PropertyType } from '../shared/enums/property';

import { Property } from '../shared/interface/property';
import { UserService } from '../user/user.service';
import { PropertiesNewComponent } from './properties-new-modal/properties-new.component';
import { PropertiesUploadsComponent } from './properties-uploads-modal/properties-uploads.component';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.page.html',
  styleUrls: ['./properties.page.scss'],
})
export class PropertiesPage implements OnInit {
  public progressBar = false;
  public search = '';
  public properties: Property[] = [];
  public filterBy: string[] = [];
  public filters = [
    {
      value: PropertyType.residential,
      label: 'Residential'
    },
    {
      value: PropertyType.commercial,
      label: 'Commercial'
    },
    {
      value: PropertyType.industrial,
      label: 'Industrial'
    },
    {
      value: PropertyType.land,
      label: 'Land'
    },
  ];
  public sortBy = 'latest';
  public sorts = [
    {
      value: 'latest',
      label: 'Latest'
    },
    {
      value: 'name',
      label: 'Name'
    },
    {
      value: 'price',
      label: 'Price'
    }
  ];
  constructor(
    public modalController: ModalController,
    private userService: UserService,
    private router: Router,
    private toastCtrl: ToastController,
  ) { }

  async ngOnInit() { }

  async presentModal() {
    const user = this.userService.user;
    if (!user) {
      this.router.navigateByUrl('/user/signin');
      this.toastCtrl.create({
        message: 'Please sign in, to continue',
        duration: 3000,
        color: 'danger'
      }).then(toast => toast.present());
      return;
    }
    const modalPropertiesNew = await this.modalController.create({
      component: PropertiesNewComponent
    });
    await modalPropertiesNew.present();
    const { data } = await modalPropertiesNew.onDidDismiss();
    if (data) {
      this.presentUploadModal(data);
    }
  }

  public async presentLoading() {
    this.progressBar = true;
    setTimeout(() => this.progressBar = false, 1500);
  }

  private async presentUploadModal(property: Property) {
    const modalUploads = await this.modalController.create({
      component: PropertiesUploadsComponent,
      componentProps: { property }
    });
    await modalUploads.present();
  }
}
