import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MortgageCalcPageRoutingModule } from './mortgage-calc-routing.module';

import { MortgageCalcPage } from './mortgage-calc.page';
import { SharedModule } from '../shared/shared.module';
import { MortgageCoreCalcComponent } from './mortgage-core-calc/mortgage-core-calc.component';
import { MortgagePieChartComponent } from './mortgage-pie-chart/mortgage-pie-chart.component';
import { MortgageLineChartComponent } from './mortgage-line-chart/mortgage-line-chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MortgageCalcPageRoutingModule,
    SharedModule
  ],
  declarations: [
    MortgageCalcPage,
    MortgageCoreCalcComponent,
    MortgagePieChartComponent,
    MortgageLineChartComponent
  ]
})
export class MortgageCalcPageModule { }
