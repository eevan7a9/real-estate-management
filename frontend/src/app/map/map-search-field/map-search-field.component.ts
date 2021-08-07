import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

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
        displayProperty: 'city',
        searchFunction: this.searchFunction
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      const { lat, lng } = data;
      this.selectedLocation.emit({ lat: Number(lat), lng: Number(lng) });
    }
  }

  public async searchFunction(text: string) {
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: text });
    if (!results) {
      return;
    }
    const items = results.map(item => {
      const { label, y, x } = item;
      return { city: label, lat: y, lng: x };
    });
    return items;
  }
}
