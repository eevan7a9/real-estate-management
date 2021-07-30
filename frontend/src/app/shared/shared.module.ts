import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyGalleryComponent } from './components/property-gallery/property-gallery.component';
import { ActionPopupComponent } from './components/action-popup/action-popup.component';


@NgModule({
  declarations: [PropertyGalleryComponent, ActionPopupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    PropertyGalleryComponent,
    ActionPopupComponent
  ]
})
export class SharedModule { }
