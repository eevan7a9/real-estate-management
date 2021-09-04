import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import { MapPopupComponent } from './map-popup/map-popup.component';
import { SharedModule } from '../shared/shared.module';
import { MapMarkersLegendComponent } from './map-markers-legend/map-markers-legend.component';
import { ModalSearchComponent } from '../shared/components/modal-search/modal-search.component';
import { PropertiesPageModule } from '../properties/properties.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    SharedModule,
    PropertiesPageModule
  ],
  declarations: [
    MapPage,
    MapPopupComponent,
    MapMarkersLegendComponent,
    ModalSearchComponent
  ],
})
export class MapPageModule { }
