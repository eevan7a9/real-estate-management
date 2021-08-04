import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyGalleryComponent } from './components/property-gallery/property-gallery.component';
import { ActionPopupComponent } from './components/action-popup/action-popup.component';
import { PropertyBadgeComponent } from './components/property-badge/property-badge.component';
import { DivHorizontalSlideComponent } from './components/div-horizontal-slide/div-horizontal-slide.component';


@NgModule({
  declarations: [
    PropertyGalleryComponent,
    ActionPopupComponent,
    PropertyBadgeComponent,
    DivHorizontalSlideComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    PropertyGalleryComponent,
    ActionPopupComponent,
    PropertyBadgeComponent,
    DivHorizontalSlideComponent
  ]
})
export class SharedModule { }
