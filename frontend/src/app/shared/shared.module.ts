import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyGalleryComponent } from './components/property-gallery/property-gallery.component';
import { ActionPopupComponent } from './components/action-popup/action-popup.component';
import { PropertyBadgeComponent } from './components/property-badge/property-badge.component';
import { DivHorizontalSlideComponent } from './components/div-horizontal-slide/div-horizontal-slide.component';
import { CustomValidatorsDirective } from './directives/custom-validators.directive';
import { AlertCardComponent } from './components/alert-card/alert-card.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { PropertyCardComponent } from './components/property-card/property-card.component';
import { EnquiryBadgeComponent } from './components/enquiry-badge/enquiry-badge.component';


@NgModule({
  declarations: [
    PropertyGalleryComponent,
    ActionPopupComponent,
    PropertyBadgeComponent,
    DivHorizontalSlideComponent,
    CustomValidatorsDirective,
    AlertCardComponent,
    ContactFormComponent,
    PropertyCardComponent,
    EnquiryBadgeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    PropertyGalleryComponent,
    ActionPopupComponent,
    PropertyBadgeComponent,
    DivHorizontalSlideComponent,
    CustomValidatorsDirective,
    AlertCardComponent,
    ContactFormComponent,
    PropertyCardComponent,
    EnquiryBadgeComponent
  ],
  providers: [CustomValidatorsDirective]
})
export class SharedModule { }
