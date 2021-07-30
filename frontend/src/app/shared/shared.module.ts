import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyGalleryComponent } from './components/property-gallery/property-gallery.component';



@NgModule({
  declarations: [PropertyGalleryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    PropertyGalleryComponent
  ]
})
export class SharedModule { }
