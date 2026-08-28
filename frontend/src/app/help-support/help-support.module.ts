import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HelpSupportPageRoutingModule } from './help-support-routing.module';

import { HelpSupportPage } from './help-support.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HelpSupportPageRoutingModule,
    SharedModule
  ],
  declarations: [HelpSupportPage]
})
export class HelpSupportPageModule {}
