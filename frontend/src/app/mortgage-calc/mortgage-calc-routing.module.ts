import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MortgageCalcPage } from './mortgage-calc.page';

const routes: Routes = [
  {
    path: '',
    component: MortgageCalcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MortgageCalcPageRoutingModule {}
