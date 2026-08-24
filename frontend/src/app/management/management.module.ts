import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { ManagementPageRoutingModule } from './management-routing.module';
import { ManagementPage } from './management.page';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ManagementPageRoutingModule
  ],
  declarations: [ManagementPage]
})
export class ManagementPageModule {}
