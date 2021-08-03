import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Coord } from 'src/app/shared/interface/map';
import { StorageService } from 'src/app/shared/services/storage/storage.service';

@Component({
  selector: 'app-settings-coord-default',
  templateUrl: './settings-coord-default.component.html',
  styleUrls: ['./settings-coord-default.component.scss'],
})
export class SettingsCoordDefaultComponent implements OnInit {

  public coord: Coord = { lat: 8.947416086535465, lng: 125.5451552207221 };

  constructor(
    public toastController: ToastController,
    private storageService: StorageService
  ) { }

  async ngOnInit() {
    await this.storageService.init();
    const coord = await this.storageService.getCoord();
    if (coord) {
      this.coord = coord;
    }
  }

  async setCoord() {
    this.storageService.setCoord(this.coord);
    const toast = await this.toastController.create({
      color: 'success',
      message: 'Your settings have been saved.',
      duration: 2000
    });;
    toast.present();
  }

  async resetCoord() {
    this.coord = { lat: 8.947416086535465, lng: 125.5451552207221 };
    this.storageService.setCoord(this.coord);
    const toast = await this.toastController.create({
      color: 'success',
      message: 'Your settings have been Reset.',
      duration: 2000
    });;
    toast.present();
  }
}
