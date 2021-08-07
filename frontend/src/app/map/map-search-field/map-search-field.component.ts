import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalSearchComponent } from 'src/app/shared/components/modal-search/modal-search.component';
import cities from 'src/app/shared/data/php-cities';
import { Coord } from 'src/app/shared/interface/map';

@Component({
  selector: 'app-map-search-field',
  templateUrl: './map-search-field.component.html',
  styleUrls: ['./map-search-field.component.scss'],
})
export class MapSearchFieldComponent implements OnInit {

  @Output() selectedLocation = new EventEmitter<Coord>();

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  async showSearchModal() {
    const modal = await this.modalCtrl.create({
      component: ModalSearchComponent,
      componentProps: {
        title: 'Search Location',
        placeholder: 'Search Cities...',
        items: [...cities],
        displayProperty: 'city'
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      const { lat, lng } = data;
      this.selectedLocation.emit({ lat: Number(lat), lng: Number(lng) });
    }
  }
}
