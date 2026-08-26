import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ManagementPageRoutingModule } from './management-routing.module';
import { ManagementPage } from './management.page';
import { ManagementPropertiesComponent } from './management-properties/management-properties.component';
import { PropertiesPageModule } from '@app/properties/properties.module';
import { ManagementKpiSummaryComponent } from './management-kpi-summary/management-kpi-summary.component';
import { ManagementPortfolioOverviewComponent } from './management-portfolio-overview/management-portfolio-overview.component';
import { ManagementQuickActionComponent } from './management-quick-action/management-quick-action.component';
import { ManagementRecentListComponent } from './management-recent-list/management-recent-list.component';

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
    ManagementKpiSummaryComponent,
    ManagementPortfolioOverviewComponent,
    ManagementQuickActionComponent,
    ManagementRecentListComponent
  ]
})
export class ManagementPageModule {}
