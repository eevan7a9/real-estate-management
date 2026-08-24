import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';
import { IonicModule } from '@ionic/angular/lazy';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StorageService } from './shared/services/storage/storage.service';
import { SharedModule } from './shared/shared.module';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule,
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    SharedModule,
    MarkdownModule.forRoot()
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    StorageService,
    provideIonicAngular(),
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule {}
