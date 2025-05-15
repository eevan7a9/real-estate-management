import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPageRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserPage } from './user.page';
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ActivityTimelineComponent } from './profile/activity-timeline/activity-timeline.component';
import { UserPropertiesComponent } from './profile/user-properties/user-properties.component';
import { PropertiesPageModule } from '../properties/properties.module';
import { ProfileVerifiedComponent } from './profile/profile-verified/profile-verified.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserPageRoutingModule,
    SharedModule,
    PropertiesPageModule,
  ],
  declarations: [
    UserPage,
    RegisterComponent,
    SigninComponent,
    ChangePasswordComponent,
    ProfileComponent,
    NotificationsComponent,
    ActivityTimelineComponent,
    UserPropertiesComponent,
    ProfileVerifiedComponent,
  ]
})
export class UserPageModule { }
