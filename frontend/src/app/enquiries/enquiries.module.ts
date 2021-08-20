import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnquiriesPageRoutingModule } from './enquiries-routing.module';

import { EnquiriesPage } from './enquiries.page';
import { EnquiriesListComponent } from './enquiries-list/enquiries-list.component';
import { EnquiriesDetailComponent } from './enquiries-detail/enquiries-detail.component';
import { SharedModule } from '../shared/shared.module';
import { EnquiriesNewComponent } from './enquiries-new-modal/enquiries-new.component';
import { EnquiriesNewFormComponent } from './enquiries-new-form/enquiries-new-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnquiriesPageRoutingModule,
    SharedModule
  ],
  declarations: [
    EnquiriesPage,
    EnquiriesListComponent,
    EnquiriesDetailComponent,
    EnquiriesNewComponent,
    EnquiriesNewFormComponent
  ]
})
export class EnquiriesPageModule { }
