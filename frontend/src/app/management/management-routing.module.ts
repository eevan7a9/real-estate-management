import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementPage } from './management.page';
const routes: Routes = [{ path: '', component: ManagementPage }];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ManagementPageRoutingModule {}
