import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

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

  constructor(public modalController: ModalController, private propertiesService: PropertiesService) { }

  async ngOnInit() {
    this.propertiesService.properties = [
      {
        name: 'Property A',
        address: 'Some place free',
        description: 'And this is nice',
        type: 'house'
      },
      {
        name: 'Property B',
        address: 'Some place free',
        description: 'And this is nice',
        type: 'apartment'
      },
      {
        name: 'Property C',
        address: 'Some place free',
        description: 'And this is nice',
        type: 'pad'
      },
      {
        name: 'Property D',
        address: 'Some place free',
        description: 'And this is nice',
        type: 'pad'
      },
      {
        name: 'Property E',
        address: 'Some place free',
        description: 'And this is nice',
        type: 'boardingHouse'
      }
    ];
    this.properties = this.propertiesService.properties;
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: PropertiesNewComponent
    });
    return await modal.present();
  }

}
