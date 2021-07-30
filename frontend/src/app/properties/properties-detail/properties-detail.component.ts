import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';

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
    public modalController: ModalController
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
      translucent: true
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data.action === 'delete') {
      this.propertiesService.removeProperty(this.property.propId);
      this.router.navigate(['/properties']);
    }
    if (data.action === 'edit') {
      this.editModal();
    }
  }

  private async editModal() {
    const modal = await this.modalController.create({
      component: PropertiesEditComponent
    });
    return await modal.present();
  }
}
