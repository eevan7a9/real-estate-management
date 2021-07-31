import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnquiriesDetailComponent } from './enquiries-detail/enquiries-detail.component';

import { EnquiriesPage } from './enquiries.page';

const routes: Routes = [
  {
    path: '',
    component: EnquiriesPage
  },
  {
    path: ':id',
    component: EnquiriesDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnquiriesPageRoutingModule { }
