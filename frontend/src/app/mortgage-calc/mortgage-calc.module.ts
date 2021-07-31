import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MortgageCalcPageRoutingModule } from './mortgage-calc-routing.module';

import { MortgageCalcPage } from './mortgage-calc.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MortgageCalcPageRoutingModule,
    SharedModule
  ],
  declarations: [MortgageCalcPage]
})
export class MortgageCalcPageModule { }
