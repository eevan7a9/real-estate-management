import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import { PropertiesListComponent } from '../properties/properties-list/properties-list.component';
import { MapLeafletComponent } from './map-leaflet/map-leaflet.component';
import { MapPopupComponent } from './map-popup/map-popup.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    SharedModule
  ],
  declarations: [MapPage, PropertiesListComponent, MapLeafletComponent, MapPopupComponent]
})
export class MapPageModule { }
