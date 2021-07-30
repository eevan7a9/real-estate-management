import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnquiriesPage } from './enquiries.page';

const routes: Routes = [
  {
    path: '',
    component: EnquiriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnquiriesPageRoutingModule {}
