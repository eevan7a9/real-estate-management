import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { SettingsThemeComponent } from './settings-theme/settings-theme.component';
import { SettingsCoordDefaultComponent } from './settings-coord-default/settings-coord-default.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule
  ],
  declarations: [SettingsPage, SettingsThemeComponent, SettingsCoordDefaultComponent]
})

export class SettingsPageModule { }
