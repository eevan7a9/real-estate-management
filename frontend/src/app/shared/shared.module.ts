import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionPopupComponent } from './components/action-popup/action-popup.component';
import { PropertyBadgeComponent } from './components/property-badge/property-badge.component';
import { DivHorizontalSlideComponent } from './components/div-horizontal-slide/div-horizontal-slide.component';
import { CustomValidatorsDirective } from './directives/custom-validators.directive';
import { AlertCardComponent } from './components/alert-card/alert-card.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { PropertyCardComponent } from './components/property-card/property-card.component';
import { EnquiryBadgeComponent } from './components/enquiry-badge/enquiry-badge.component';
// FROM MAP MODULE
import { MapLeafletComponent } from '../map/map-leaflet/map-leaflet.component';
import { MapSearchFieldComponent } from '../map/map-search-field/map-search-field.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    ActionPopupComponent,
    PropertyBadgeComponent,
    DivHorizontalSlideComponent,
    CustomValidatorsDirective,
    AlertCardComponent,
    ContactFormComponent,
    PropertyCardComponent,
    EnquiryBadgeComponent,
    MapLeafletComponent,
    MapSearchFieldComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ActionPopupComponent,
    PropertyBadgeComponent,
    DivHorizontalSlideComponent,
    CustomValidatorsDirective,
    AlertCardComponent,
    ContactFormComponent,
    PropertyCardComponent,
    EnquiryBadgeComponent,
    MapLeafletComponent,
    MapSearchFieldComponent,
    FooterComponent,
  ],
  providers: [CustomValidatorsDirective],
})
export class SharedModule { }
