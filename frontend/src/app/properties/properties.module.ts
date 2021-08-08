import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../shared/shared.module';
import { PropertiesPageRoutingModule } from './properties-routing.module';

import { PropertiesPage } from './properties.page';
import { PropertiesNewComponent } from './properties-new-modal/properties-new.component';
import { PropertiesListComponent } from './properties-list/properties-list.component';
import { PropertiesDetailComponent } from './properties-detail/properties-detail.component';
import { PropertiesEditComponent } from './properties-edit-modal/properties-edit.component';
import { MortgageCoreCalcComponent } from '../mortgage-calc/mortgage-core-calc/mortgage-core-calc.component';
import { PropertiesCoordinatesComponent } from './properties-coordinates-modal/properties-coordinates.component';
import { MapLeafletComponent } from '../map/map-leaflet/map-leaflet.component';
import { MapSearchFieldComponent } from '../map/map-search-field/map-search-field.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PropertiesPageRoutingModule,
    SharedModule
  ],
  declarations: [
    PropertiesPage,
    PropertiesNewComponent,
    PropertiesListComponent,
    PropertiesDetailComponent,
    PropertiesEditComponent,
    MortgageCoreCalcComponent,
    PropertiesCoordinatesComponent,
    MapLeafletComponent,
    MapSearchFieldComponent
  ]
})
export class PropertiesPageModule { }
