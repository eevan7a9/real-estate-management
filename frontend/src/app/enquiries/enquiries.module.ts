import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnquiriesPageRoutingModule } from './enquiries-routing.module';

import { EnquiriesPage } from './enquiries.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnquiriesPageRoutingModule
  ],
  declarations: [EnquiriesPage]
})
export class EnquiriesPageModule {}
