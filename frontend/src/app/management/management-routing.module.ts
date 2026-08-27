import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementPage } from './management.page';
import { ManagementPropertiesPage } from './management-properties/management-properties.page';

const routes: Routes = [
  { path: '', component: ManagementPage },
  { path: 'properties', component: ManagementPropertiesPage }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ManagementPageRoutingModule {}
