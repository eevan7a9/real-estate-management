import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PropertiesNewComponent } from './properties-new-modal/properties-new.component';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.page.html',
  styleUrls: ['./properties.page.scss'],
})
export class PropertiesPage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: PropertiesNewComponent
    });
    return await modal.present();
  }

}
