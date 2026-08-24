import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { FolderPageRoutingModule } from './folder-routing.module';

import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular';

import { FolderPage } from './folder.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar, FolderPageRoutingModule],
  declarations: [FolderPage]
})
export class FolderPageModule {}
