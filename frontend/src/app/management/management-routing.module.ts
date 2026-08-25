import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementPage } from './management.page';

const routes: Routes = [
  { path: '', component: ManagementPage },
  {
    path: 'properties',
    loadComponent: () =>
      import('./management-properties/management-properties.component').then(
        (m) => m.ManagementPropertiesComponent
      )
  }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ManagementPageRoutingModule {}
