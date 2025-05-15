import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionPopupComponent } from './components/action-popup/action-popup.component';
import { PropertyBadgeComponent } from './components/property-badge/property-badge.component';
import { DivHorizontalSlideComponent } from './components/div-horizontal-slide/div-horizontal-slide.component';
import { AlertCardComponent } from './components/alert-card/alert-card.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { EnquiryBadgeComponent } from './components/enquiry-badge/enquiry-badge.component';
// FROM MAP MODULE
import { MapLeafletComponent } from '../map/map-leaflet/map-leaflet.component';
import { MapSearchFieldComponent } from '../map/map-search-field/map-search-field.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterLinkWithHref } from '@angular/router';
import { NeedSigninContinueComponent } from './components/need-signin-continue/need-signin-continue.component';
import { NotificationBellComponent } from './components/notification-bell/notification-bell.component';
import { NotificationBadgeComponent } from './components/notification-badge/notification-badge.component';

@NgModule({
  declarations: [
    ActionPopupComponent,
    PropertyBadgeComponent,
    DivHorizontalSlideComponent,
    AlertCardComponent,
    ContactFormComponent,
    EnquiryBadgeComponent,
    MapLeafletComponent,
    MapSearchFieldComponent,
    FooterComponent,
    NeedSigninContinueComponent,
    NotificationBellComponent,
    NotificationBadgeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterLinkWithHref,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ActionPopupComponent,
    PropertyBadgeComponent,
    DivHorizontalSlideComponent,
    AlertCardComponent,
    ContactFormComponent,
    EnquiryBadgeComponent,
    MapLeafletComponent,
    MapSearchFieldComponent,
    FooterComponent,
    NeedSigninContinueComponent,
    NotificationBellComponent,
    NotificationBadgeComponent,
  ],
})
export class SharedModule {}
