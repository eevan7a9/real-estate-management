import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertiesPageRoutingModule } from './properties-routing.module';

import { PropertiesPage } from './properties.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertiesPageRoutingModule
  ],
  declarations: [PropertiesPage]
})
export class PropertiesPageModule {}
