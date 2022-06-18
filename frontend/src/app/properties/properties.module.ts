import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../shared/shared.module';
import { PropertiesPageRoutingModule } from './properties-routing.module';

import { PropertiesPage } from './properties.page';
import { PropertiesNewComponent } from './properties-new-modal/properties-new.component';
import { PropertiesListComponent } from './properties-list/properties-list.component';
import { PropertiesCardComponent } from './properties-card/properties-card.component';
import { PropertiesDetailComponent } from './properties-detail/properties-detail.component';
import { PropertiesEditComponent } from './properties-edit-modal/properties-edit.component';
import { PropertiesCoordinatesComponent } from './properties-coordinates-modal/properties-coordinates.component';
import { EnquiriesPageModule } from '../enquiries/enquiries.module';
import { MortgageCalcPageModule } from '../mortgage-calc/mortgage-calc.module';
import { PropertiesUploadsComponent } from './properties-uploads-modal/properties-uploads.component';
import { PropertiesGalleryComponent } from './properties-gallery/properties-gallery.component';
import { SwiperModule } from 'swiper/angular';
import { PropertiesCurrentImagesComponent } from './properties-uploads-modal/properties-current-images/properties-current-images.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PropertiesPageRoutingModule,
    SharedModule,
    EnquiriesPageModule,
    MortgageCalcPageModule,
    SwiperModule
  ],
  declarations: [
    PropertiesPage,
    PropertiesNewComponent,
    PropertiesListComponent,
    PropertiesCardComponent,
    PropertiesDetailComponent,
    PropertiesEditComponent,
    PropertiesCoordinatesComponent,
    PropertiesUploadsComponent,
    PropertiesGalleryComponent,
    PropertiesCurrentImagesComponent
  ],
  exports: [
    PropertiesListComponent,
  ]
})
export class PropertiesPageModule { }
