import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PropertyType } from '../shared/enums/property';

import { Property } from '../shared/interface/property';
import { PropertiesNewComponent } from './properties-new-modal/properties-new.component';
import { PropertiesService } from './properties.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.page.html',
  styleUrls: ['./properties.page.scss'],
})
export class PropertiesPage implements OnInit {
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
  constructor(public modalController: ModalController) { }

  async ngOnInit() { }

  async presentModal() {
    const modal = await this.modalController.create({
      component: PropertiesNewComponent
    });
    return await modal.present();
  }

}
