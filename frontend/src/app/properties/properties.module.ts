import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../shared/shared.module';
import { PropertiesPageRoutingModule } from './properties-routing.module';

import { PropertiesPage } from './properties.page';
import { PropertiesNewComponent } from './properties-new-modal/properties-new.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PropertiesPageRoutingModule,
    SharedModule
  ],
  declarations: [PropertiesPage, PropertiesNewComponent]
})
export class PropertiesPageModule { }
