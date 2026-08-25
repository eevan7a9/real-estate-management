import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ManagementPageRoutingModule } from './management-routing.module';
import { ManagementPage } from './management.page';
import { ManagementPropertiesComponent } from './management-properties/management-properties.component';
import { PropertiesPageModule } from '@app/properties/properties.module';
import { ManagementKpiSummaryComponent } from './management-kpi-summary/management-kpi-summary.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ManagementPageRoutingModule,
    PropertiesPageModule
  ],
  declarations: [
    ManagementPage,
    ManagementPropertiesComponent,
    ManagementKpiSummaryComponent
  ]
})
export class ManagementPageModule {}
